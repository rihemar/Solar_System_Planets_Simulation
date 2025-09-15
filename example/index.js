const params = new URLSearchParams(window.location.search);

const planetName = params.get('name') || 'Planet';
const textureFile = params.get('texture') || '8k_planet.jpg';
const hasRing = params.get('ring') === 'true';


// src/main.js
const routes = {
  '/': 'Home Page',
  '/about': 'About Page',
  '/contact': 'Contact Page'
};

// Function to handle route changes
function renderRoute() {
  const path = window.location.pathname;
  const content = routes[path] || '404 Not Found';
  document.getElementById('app').innerHTML = `<h1>${content}</h1>`;
}

// Listen for popstate events (like clicking on links or using the back/forward buttons)
window.addEventListener('popstate', renderRoute);

// Initialize routing on first load
renderRoute();

// Handle link clicks to change the URL and render the correct page
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const newPath = link.getAttribute('href');
    history.pushState(null, '', newPath);
    renderRoute();
  });
});
