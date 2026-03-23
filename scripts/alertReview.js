
document.addEventListener("DOMContentLoaded", () => {
  // Auto-resize textarea
  document.getElementById('comment').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // Submit logic
  document.querySelector('.submit-button button').addEventListener('click', (e) => {
    e.preventDefault();

    const hazard = document.querySelector('input[name="hazard"]:checked')?.value;
    const situation = document.querySelector('input[name="situation"]:checked')?.value;
    const location = document.querySelector('input[name="location"]:checked')?.value;
    const severity = document.querySelector('input[name="severity"]:checked')?.value;
    const comment = document.getElementById('comment')?.value.trim();

    if (!hazard || !situation || !location || !severity) {
      alert('Please answer all required questions before submitting.');
      return;
    }

    // Save review to localStorage
    const review = { hazard, situation, location, severity, comment, submittedAt: new Date().toISOString() };
    const reviews = JSON.parse(localStorage.getItem('alertReviews') || '[]');
    reviews.push(review);
    localStorage.setItem('alertReviews', JSON.stringify(reviews));

    alert('Thank you! Your review has been submitted.');
    window.location.href = 'alertHistory.html';
  });
});