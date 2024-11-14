const API_URL = 'https://zipbites.free.beeceptor.com/restaurants';
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');

function fetchRestaurantDetails() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const restaurant = data.find(item => item.id == restaurantId);

            if (!restaurant) {
                document.getElementById('restaurant-details').innerHTML = '<p>Restaurant not found.</p>';
                return;
            }

            const detailsContainer = document.getElementById('restaurant-details');
            detailsContainer.innerHTML = `
                <h2>${restaurant.name}</h2>
                <p><strong>Style:</strong> ${restaurant.style}</p>
                <p><strong>Location:</strong> ${restaurant.location} - ${restaurant.pincode}</p>
                <p><strong>Dietary Options:</strong> ${restaurant.dietary_options.join(', ')}</p>
                <p><strong>Rating:</strong> ${restaurant.rating}</p>
                <p><strong>Contact:</strong> ${restaurant.contact}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching restaurant details:', error);
            document.getElementById('restaurant-details').innerHTML = '<p>Error loading details.</p>';
        });
}

function goBack() {
    window.history.back();
}

// Fetch and display restaurant details when the page loads
fetchRestaurantDetails();
