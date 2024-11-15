const REVIEW_URL = 'https://zipbites1.free.beeceptor.com/reviews';
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
        if (response.ok) {
            alert('Review submitted successfully!');
            document.getElementById('review-form').reset();
        } else {
            throw new Error('Failed to submit review: ' + response.statusText);
        }
    })
    .catch(error => console.error('Error submitting review:', error));
}

// Optional Go Back function if you want a separate button functionality
function goBack() {
    window.history.back();
}
