document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) { 
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storedDrivers = JSON.parse(localStorage.getItem("drivers")) || [];

      const user = storedUsers.find(u => u.email === email && u.password === password);
      const driver = storedDrivers.find(d => d.email === email && d.password === password);

      if (user || driver) {
 
        const roles = [];
        if (user) roles.push("user");
        if (driver) roles.push("driver");

        const currentUser = user || driver;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem("role", roles.join(",")); 

        window.location.href = "SearchHome.html"; 
      } else {
        alert("Email o contraseña incorrectos"); 
      }
    });
  }

 
  const role = localStorage.getItem("role") || "";
  if (!role.includes("driver")) {
    const footerRidesWrapper = document.getElementById("footer-rides-wrapper");
    if (footerRidesWrapper) {
      footerRidesWrapper.style.display = "none";
    }
  }


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const footerLinks = document.querySelectorAll("footer a");

  footerLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!currentUser && href !== "index.html" && href !== "Register.html") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
      });
    }
  });


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
