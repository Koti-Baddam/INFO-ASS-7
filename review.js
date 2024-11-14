const REVIEW_URL = 'https://zipbites.free.beeceptor.com/reviews';
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');

function submitReview(event) {
    event.preventDefault();

    const review = {
        restaurantId: restaurantId,
        reviewer: document.getElementById('reviewer-name').value,
        content: document.getElementById('review-content').value,
        rating: parseInt(document.getElementById('review-rating').value),
    };

    fetch(REVIEW_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit review: ' + response.statusText);
        }
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
    })
    .catch(error => console.error('Error submitting review:', error));
}

// Go Back function to navigate to the previous page
function goBack() {
    window.history.back();
}
