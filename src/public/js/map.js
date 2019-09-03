const L = require('leaflet')

document.addEventListener('DOMContentLoaded', () => {
  const mapElem = document.querySelector('#map')
  if (mapElem) {
    // set up the map
    const lat = mapElem.attributes.lat.value
    const lon = mapElem.attributes.lon.value
    const map = new L.Map('map', { scrollWheelZoom: false })

    // create the tile layer with correct attribution
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, { minZoom: 10, maxZoom: 17, attribution: osmAttrib })
    // start the map in South-East England
    map.addLayer(osm)
    L.Icon.Default.prototype.options.imagePath = '/images/'
    L.marker([lat, lon]).addTo(map)
    map.setView(new L.LatLng(lat, lon), 17)
  }
})
