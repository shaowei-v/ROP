mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhb3dlaXciLCJhIjoiY21xNzN3YnZiMDdsMTJyb2d4cmhsMWlqbyJ9.UzSZhQi1J3OhSw9uqHUL0w';

const myMap = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shaoweiw/cmq7472d3001101sqhlj42u35/draft',
  center: [-122.27, 37.8],
  zoom: 9
});
