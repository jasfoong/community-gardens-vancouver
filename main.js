let map = L.map('map').setView([49.2827, -123.1207], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

const gardenIcon = L.icon({
    iconUrl: '/public/apple-freepik.png', 
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const parkIcon = L.icon({
    iconUrl: '/public/butterfly-goodware.png', 
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
})

async function addCommunityGardensLayer(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: gardenIcon });
            },
            onEachFeature: function (feature, layer) {
                const { name, merged_address, number_of_plots, jurisdiction, steward_or_managing_organization, public_e_mail, website } = feature.properties;
                layer.bindPopup(`
                    <strong class="text-xl">${name}</strong><br><br>
                    <strong>Address:</strong> ${merged_address}<br>
                    <strong>Number of Plots:</strong> ${number_of_plots || 'N/A'}<br>
                    <strong>Jurisdiction:</strong> ${jurisdiction}<br>
                    <strong>Steward:</strong> ${steward_or_managing_organization || 'N/A'}<br>
                    <strong>Email:</strong> ${public_e_mail || 'N/A'}<br>
                    <strong>Website:</strong> ${website ? `<a href="${website}" target="_blank" rel="noopener noreferrer">${website}</a>` : 'N/A'}
                `);
            }
        }).addTo(map);
    } catch (error) {
        console.error('Error fetching community gardens data:', error);
    }
}

async function addParksLayer(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: parkIcon });
            },
            onEachFeature: function (feature, layer) {
                const { name, streetname, neighbourhoodname, washrooms } = feature.properties;
                layer.bindPopup(`
                    <strong class="text-xl">${name}</strong><br><br>
                    <strong>Address:</strong> ${streetname}<br>
                    <strong>Neighbourhood:</strong> ${neighbourhoodname}<br>
                    <strong>Washrooms Available:</strong> ${washrooms}<br>
                `);
            }
        }).addTo(map);
    } catch (error) {
        console.error('Error fetching parks data:', error);
    }
}

const communityGardensUrl = '/data/community-gardens-and-food-trees.geojson';
const parksUrl = '/data/parks.geojson';


addCommunityGardensLayer(communityGardensUrl);
addParksLayer(parksUrl);
