
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('comment').addEventListener('input', function() {
  this.style.height = 'auto';                  // reset height
  this.style.height = this.scrollHeight + 'px'; // expand to fit content
});
});