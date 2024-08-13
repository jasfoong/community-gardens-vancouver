var map = L.map('map').setView([49.2827, -123.1207], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

var gardenIcon = L.icon({
    iconUrl: '/public/apple-freepik.png', 
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

async function loadGeoJSON() {
    try {
        const response = await fetch('/community-gardens-and-food-trees.geojson');
        
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: gardenIcon });
        },
        onEachFeature: function (feature, layer) {
            const { name, merged_address, number_of_plots, jurisdiction, steward_or_managing_organization, public_e_mail, website } = feature.properties;

            const popupContent = `
            <strong class="text-xl">${name}</strong><br><br>
            <strong>Address:</strong> ${merged_address}<br>
            <strong>Number of Plots:</strong> ${number_of_plots || 'N/A'}<br>
            <strong>Jurisdiction:</strong> ${jurisdiction}<br>
            <strong>Managing Organization:</strong> ${steward_or_managing_organization || 'N/A'}<br>
            <strong>Email:</strong> ${public_e_mail || 'N/A'}<br>
            <strong>Website:</strong> ${website ? `<a href="${website}" target="_blank" rel="noopener noreferrer">${website}</a>` : 'N/A'}
            `;

            layer.bindPopup(popupContent);
        }
        }).addTo(map);

    } catch(error) {
            console.error('Error loading GeoJSON:', error)
        }
}

loadGeoJSON();
