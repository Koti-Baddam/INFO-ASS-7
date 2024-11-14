const API_URL = 'https://zipbite1.free.beeceptor.com/restaurants';

function fetchRestaurants() {
    const zipcode = document.getElementById('zipcode').value;
    const dietaryFilter = document.getElementById('dietary-filter').value;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            let filteredRestaurants = data;

            // Step 1: Filter based on pincode
            if (zipcode) {
                // Exact pincode matches are prioritized
                const exactMatches = data.filter(restaurant => restaurant.pincode === zipcode);

                // If there are fewer than 5 exact matches, try finding nearby restaurants
                if (exactMatches.length < 5) {
                    const nearbyMatches = data.filter(restaurant => 
                        restaurant.pincode.startsWith(zipcode.slice(0, 2))
                    );

                    // Combine exact and nearby matches, ensuring no duplicates
                    filteredRestaurants = [...new Set([...exactMatches, ...nearbyMatches])];
                } else {
                    filteredRestaurants = exactMatches;
                }
            }

            // Step 2: Filter based on dietary preferences
            if (dietaryFilter) {
                filteredRestaurants = filteredRestaurants.filter(restaurant =>
                    restaurant.dietary_options.includes(dietaryFilter)
                );
            }

            // Step 3: Sort by rating in descending order and limit to top 5
            filteredRestaurants = filteredRestaurants
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5);

            // Display the filtered top 5 restaurants
            displayRestaurants(filteredRestaurants);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = ''; // Clear previous results

    if (restaurants.length === 0) {
        restaurantList.innerHTML = `<p>No restaurants found matching your criteria.</p>`;
        return;
    }

    restaurants.forEach(restaurant => {
        const restaurantItem = document.createElement('div');
        restaurantItem.classList.add('restaurant-item');

        restaurantItem.innerHTML = `
            <div class="restaurant-name">
                <a href="details.html?id=${restaurant.id}">${restaurant.name}</a>
            </div>
            <div class="restaurant-details">
                <p><strong>Style:</strong> ${restaurant.style}</p>
                <p><strong>Location:</strong> ${restaurant.location} - ${restaurant.pincode}</p>
                <p><strong>Dietary Options:</strong> ${restaurant.dietary_options.join(', ')}</p>
                <p><strong>Rating:</strong> ${restaurant.rating}</p>
                <p><strong>Contact:</strong> ${restaurant.contact}</p>
                <a href="review.html?id=${restaurant.id}" class="review-link">Submit a Review</a>
            </div>
        `;

        restaurantList.appendChild(restaurantItem);
    });
}

