document.getElementById('registerForm')?.addEventListener('submit', function (event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const repeatPassword = document.getElementById('repeatPassword').value;
  const address = document.getElementById('address').value.trim();
  const country = document.getElementById('country').value;
  const state = document.getElementById('state').value.trim();
  const city = document.getElementById('city').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const role = document.querySelector('input[name="role"]:checked')?.value || "user";

  if (password !== repeatPassword) {
    alert('Passwords do not match.');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) {
    alert('This email is already registered.');
    return;
  }

  const user = { firstName, lastName, email, password, address, country, state, city, phone, role };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));

  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const publicPages = ['index.html', 'register.html'];
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  function checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role');
      alert("You must be logged in to access this page.");
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  if (!publicPages.includes(currentPage)) {
    checkLogin();
  }

  const navLinks = document.querySelectorAll('a[href]');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const page = href.split("/").pop().toLowerCase();

    if (!publicPages.includes(page)) {
      link.addEventListener('click', (e) => {
        if (!checkLogin()) e.preventDefault();
      });
    }
  });

  const role = localStorage.getItem('role');
  if (role !== 'driver') {
    const footerRidesWrapper = document.getElementById('footer-rides-wrapper');
    if (footerRidesWrapper) footerRidesWrapper.style.display = 'none';
  }

  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.trim().toLowerCase() === "logout") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");
        window.location.href = "index.html";
      });
    }
  });
});
