document.addEventListener("DOMContentLoaded", () => {
  const driverForm = document.getElementById("driverForm");

  if (driverForm) {
    driverForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const cedula = document.getElementById("cedula").value.trim();
      const birthDate = document.getElementById("birthDate").value;
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const carMake = document.getElementById("carMake").value.trim();
      const carModel = document.getElementById("carModel").value.trim();
      const carYear = document.getElementById("carYear").value.trim();
      const licensePlate = document.getElementById("licensePlate").value.trim();

      const password = document.getElementById("password").value;
      const repeatPassword = document.getElementById("repeatPassword").value;

      if (!password || password !== repeatPassword) {
        return;
      }

      const driver = {
        firstName,
        lastName,
        cedula,
        birthDate,
        email,
        phone,
        carMake,
        carModel,
        carYear,
        licensePlate,
        password
      };

      const existingDrivers = JSON.parse(localStorage.getItem("drivers")) || [];
      if (existingDrivers.find(d => d.email === email)) {
        alert("Este correo ya está registrado como conductor.");
        return;
      }

      existingDrivers.push(driver);
      localStorage.setItem("drivers", JSON.stringify(existingDrivers));

      window.location.href = "index.html";
    });
  }

  const footerLinks = document.querySelectorAll('footer a, #footer-rides-wrapper a');
  footerLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const href = link.getAttribute("href");

      if (!currentUser && href && !["index.html", "driverRegister.html"].includes(href.toLowerCase())) {
        e.preventDefault();
      }
    });
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
