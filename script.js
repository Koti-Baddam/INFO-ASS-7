const API_URL = 'https://zipbites1.free.beeceptor.com/restaurants';

// Fetch and display top 10 restaurants on page load
document.addEventListener("DOMContentLoaded", fetchTop10Restaurants);

// Fetch and display the top 10 restaurants
function fetchTop10Restaurants() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const top10Restaurants = data
                .sort((a, b) => b.rating - a.rating) // Sort by rating in descending order
                .slice(0, 10); // Limit to top 10

            displayRestaurants(top10Restaurants); // Display the top 10 restaurants
        })
        .catch(error => console.error('Error fetching top 10 restaurants:', error));
}

// Fetch and display filtered restaurants based on search criteria
function fetchRestaurants() {
    const zipcode = document.getElementById('zipcode').value;
    const dietaryFilter = document.getElementById('dietary-filter').value;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            let filteredRestaurants = data;

            // Step 1: Filter by pincode
            if (zipcode) {
                // Exact matches for pincode come first
                const exactMatches = data.filter(restaurant => restaurant.pincode === zipcode);
                
                // Nearby matches with the same starting digits
                const nearbyMatches = data.filter(restaurant => restaurant.pincode.startsWith(zipcode.slice(0, 2)) && restaurant.pincode !== zipcode);
                
                // Combine exact and nearby matches, removing duplicates
                filteredRestaurants = [...new Set([...exactMatches, ...nearbyMatches])];
            }

            // Step 2: Filter by dietary options if specified
            if (dietaryFilter) {
                filteredRestaurants = filteredRestaurants.filter(restaurant =>
                    restaurant.dietary_options.includes(dietaryFilter)
                );
            }

            // Step 3: Sort by pincode to prioritize nearest locations (ascending order)
            filteredRestaurants.sort((a, b) => {
                const aDistance = Math.abs(a.pincode - zipcode);
                const bDistance = Math.abs(b.pincode - zipcode);
                return aDistance - bDistance;
            });

            // Step 4: Limit results to top 10 after filtering
            const limitedRestaurants = filteredRestaurants.slice(0, 10);

            // Display the filtered and sorted restaurants
            displayRestaurants(limitedRestaurants);
        })
        .catch(error => console.error('Error fetching filtered data:', error));
}

// Display restaurants (either top 10 or filtered) in the main section
function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = ''; // Clear previous content

    if (restaurants.length === 0) {
        restaurantList.innerHTML = `<p>No restaurants found matching your criteria.</p>`;
        return;
    }

    restaurants.forEach(restaurant => {
        const restaurantItem = document.createElement('div');
        restaurantItem.classList.add('restaurant-item');

        // Display name, style, and rating in homepage
        restaurantItem.innerHTML = `
            <div class="restaurant-name">
                <a href="details.html?id=${restaurant.id}">${restaurant.name}</a>
            </div>
            <div class="restaurant-details">
                <p><strong>Style:</strong> ${restaurant.style}</p>
                <p><strong>Rating:</strong> ${restaurant.rating}</p>
                <a href="review.html?id=${restaurant.id}" class="review-link">Submit a Review</a>
            </div>
        `;

        restaurantList.appendChild(restaurantItem);
    });
}

// Attach event listener to the search button
document.querySelector('.search-button').addEventListener('click', fetchRestaurants);
