mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhb3dlaXciLCJhIjoiY21xNzN3YnZiMDdsMTJyb2d4cmhsMWlqbyJ9.UzSZhQi1J3OhSw9uqHUL0w';

const OVERVIEW = { center: [-124.15, 41.14], zoom: 12, pitch: 0, bearing: 0 };
const PANEL_W = 460;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shaoweiw/cmq7472d3001101sqhlj42u35',
  center: OVERVIEW.center,
  zoom: OVERVIEW.zoom
});

let activeFeature = null;

map.on('load', () => {
  map.addSource('points-data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/shaowei-v/ROP/refs/heads/main/data/data.geojson'
  });

  map.addLayer({
    id: 'points-layer',
    type: 'circle',
    source: 'points-data',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 5, 14, 11],
      'circle-color': '#4264FB',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
});

map.on('click', (e) => {
  const hits = map.queryRenderedFeatures(e.point, { layers: ['points-layer'] });
  if (hits.length) {
    enterFocus(hits[0]);
  } else if (activeFeature) {
    exitFocus();
  }
});

map.on('mouseenter', 'points-layer', () => (map.getCanvas().style.cursor = 'pointer'));
map.on('mouseleave', 'points-layer', () => (map.getCanvas().style.cursor = ''));

function enterFocus(feature) {
  hideHint();
  const p = feature.properties;
  const coords = feature.geometry.coordinates.slice();

  map.flyTo({
    center: coords,
    zoom: 16,
    pitch: 60,
    bearing: 20,
    duration: 1800,
    essential: true,
    padding: { right: PANEL_W } 
  });

  document.getElementById('panel-body').innerHTML = buildPanel(p);
  document.getElementById('focus-panel').classList.add('open');
  activeFeature = feature;
}

function exitFocus() {
  document.getElementById('focus-panel').classList.remove('open');
  activeFeature = null;
  map.flyTo({ ...OVERVIEW, duration: 1400, essential: true, padding: { right: 0 } });
}

document.getElementById('panel-close').addEventListener('click', exitFocus);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeFeature) exitFocus();
});

function buildPanel(p) {
  const img = p.image_link
    ? `<figure>
         <img src="${p.image_link}" alt="${p['alt-text'] || ''}">
         ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ''}
       </figure>`
    : '';

  return `
    <h2>${p.feature_name || p.rop_renaming_new_name || ''}</h2>
    ${p.rop_renaming_former_name
      ? `<p class="formerly">formerly <s>${p.rop_renaming_former_name}</s></p>`
      : ''}
    ${p.description ? `<p class="lead">${p.description}</p>` : ''}
    ${img}
    ${row('Meaning', p.rop_renaming_meaning)}
    ${row('Tribal partner', p.rop_renaming_tribal_partner)}
    ${row('Park', park(p))}
  `;
}

function row(label, value) {
  return value ? `<p class="row"><span class="lbl">${label}</span>${value}</p>` : '';
}
function park(p) {
  const u = p.rop_renaming_park_unit;
  const d = p.rop_renaming_park_district;
  if (u && d) return `${u}, ${d}`;
  return u || d || '';
}

function hideHint() {
  const h = document.getElementById('hint');
  if (h) h.classList.add('hidden');
}
map.on('dragstart', hideHint);
map.on('zoomstart', hideHint);
