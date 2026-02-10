// Initialize Leaflet map focused on India
var map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Restrict map to India bounds
var indiaBounds = L.latLngBounds([8, 68], [37, 97]);
map.setMaxBounds(indiaBounds);
map.setMinZoom(4);
map.setMaxZoom(10);

// Display items on map
db.collection("items").get().then(snapshot => {
  snapshot.forEach(doc => {
    const item = doc.data();
    if (item.location) {
      L.marker([item.location.lat, item.location.lon])
        .addTo(map)
        .bindPopup(`<b>${item.name}</b><br>Owner: ${item.ownerName}`);
    }
  });
});
