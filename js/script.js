mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhb3dlaXciLCJhIjoiY21xNzN3YnZiMDdsMTJyb2d4cmhsMWlqbyJ9.UzSZhQi1J3OhSw9uqHUL0w';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shaoweiw/cmq7472d3001101sqhlj42u35',
  center: [-124.15, 41.14],
  zoom: 12
});

map.on('load', function () {
  map.addSource('points-data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/shaowei-v/ROP/refs/heads/main/data/data.geojson'
  });

  map.addLayer({
    id: 'points-layer',
    type: 'circle',
    source: 'points-data',
    paint: {
      'circle-color': '#4264FB',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  map.on('click', 'points-layer', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const p = e.features[0].properties;

    const popupContent = `
      <div style="max-width: 260px; line-height:1.4;">
        <h3 style="margin:0 0 2px;">${p.feature_name}</h3>
        <p style="margin:0 0 8px; font-size:12px; color:#888;">
          formerly ${p.rop_renaming_former_name}
        </p>
        <p style="margin:2px 0;">${p.description}</p>
        <p style="margin:2px 0;"><strong>Meaning:</strong> ${p.rop_renaming_meaning}</p>
        <p style="margin:2px 0;"><strong>Tribal partner:</strong> ${p.rop_renaming_tribal_partner}</p>
        <p style="margin:2px 0;"><strong>Park:</strong> ${p.rop_renaming_park_unit}, ${p.rop_renaming_park_district}</p>
        ${p.image_link
          ? `<img src="${p.image_link}" alt="${p['alt-text']}" style="width:100%; border-radius:5px; margin:8px 0 4px;">
             <p style="margin:0; font-size:12px; color:#666; font-style:italic;">${p.caption}</p>`
          : ''}
      </div>
    `;

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  map.on('mouseenter', 'points-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'points-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});
