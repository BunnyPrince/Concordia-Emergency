
document.addEventListener("DOMContentLoaded", () => {
  // Auto-resize textarea
  document.getElementById('comment').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  if (isNaN(id)) {
    alert('Missing alert id. Please open review from an alert details page.');
    window.location.href = 'alertHistory.html';
    return;
  }

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

    // --- Update alert status and verification ---
    const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    const alertToUpdate = alerts.find(a => Number(a.id) === id);

    if (alertToUpdate) {
      // Update status based on hazard answer
      if (hazard === 'yes' || hazard === 'partially') {
        alertToUpdate.status = 'ACTIVE';
      } else if (hazard === 'no') {
        alertToUpdate.status = 'RESOLVED';
      }

      // Set verification
      alertToUpdate.verification = 'Verified by Campus Safety';
      // Update updateTime
      alertToUpdate.updateTime = new Date().toISOString();
      localStorage.setItem('alerts', JSON.stringify(alerts));
    }

    alert('Thank you! Your review has been submitted.');
    window.location.href = 'alertHistory.html';
  });
});