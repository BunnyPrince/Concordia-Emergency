
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('comment').addEventListener('input', function() {
    this.style.height = 'auto';                 
    this.style.height = this.scrollHeight + 'px'; 
  });
});