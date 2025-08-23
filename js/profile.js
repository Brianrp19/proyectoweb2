document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role") || "";

  const driverFieldsDiv = document.getElementById("driverFields");
  const userFieldsDiv = document.getElementById("userFields");

  if (role.includes("driver")) {
    driverFieldsDiv.style.display = "block";
  } else {
    driverFieldsDiv.style.display = "none";
  }

  if (role.includes("user")) {
    userFieldsDiv.style.display = "block";
  } else {
    userFieldsDiv.style.display = "none";
  }

  const navRides = document.getElementById("nav-rides");
  if (role.includes("user") && !role.includes("driver")) {
    if (navRides) navRides.style.display = "none";
  } else {
    if (navRides) navRides.style.display = "inline-block";
  }

  const footerRidesWrapper = document.getElementById("footer-rides-wrapper");
  if (role.includes("user") && !role.includes("driver")) {
    if (footerRidesWrapper) footerRidesWrapper.style.display = "none";
  } else {
    if (footerRidesWrapper) footerRidesWrapper.style.display = "inline";
  }

  const currentUserJSON = localStorage.getItem("currentUser");
  if (!currentUserJSON) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = JSON.parse(currentUserJSON);
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
  const form = document.getElementById("profileForm");

  let fullUserData;
  if (role.includes("driver")) {
    fullUserData = drivers.find(d => d.email === currentUser.email);
  } else {
    fullUserData = users.find(u => u.email === currentUser.email);
  }
  if (!fullUserData) fullUserData = currentUser;

  form.firstName.value = fullUserData.firstName || "";
  form.lastName.value = fullUserData.lastName || "";
  form.email.value = fullUserData.email || "";
  form.password.value = fullUserData.password || "";
  form.repeatPassword.value = fullUserData.password || "";

  if (role.includes("user")) {
    form.phoneUser.value = fullUserData.phone || "";
  }
  if (role.includes("driver")) {
    form.phoneDriver.value = fullUserData.phone || "";
  }

  if (role.includes("user")) {
    form.address.value = fullUserData.address || "";
    form.country.value = fullUserData.country || "CR";
    form.state.value = fullUserData.state || "";
    form.city.value = fullUserData.city || "";
  }

  if (role.includes("driver")) {
    form.querySelector("#cedula").value = fullUserData.cedula || "";
    form.querySelector("#birthDate").value = fullUserData.birthDate || "";
    form.querySelector("#carMake").value = fullUserData.carMake || "";
    form.querySelector("#carModel").value = fullUserData.carModel || "";
    form.querySelector("#carYear").value = fullUserData.carYear || "";
    form.querySelector("#licensePlate").value = fullUserData.licensePlate || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.password.value !== form.repeatPassword.value) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const updatedUser = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
      phone: role.includes("user") ? form.phoneUser.value : form.phoneDriver.value
    };

    if (role.includes("user")) {
      updatedUser.address = form.address.value;
      updatedUser.country = form.country.value;
      updatedUser.state = form.state.value;
      updatedUser.city = form.city.value;
    }

    if (role.includes("driver")) {
      updatedUser.cedula = form.querySelector("#cedula").value;
      updatedUser.birthDate = form.querySelector("#birthDate").value;
      updatedUser.carMake = form.querySelector("#carMake").value;
      updatedUser.carModel = form.querySelector("#carModel").value;
      updatedUser.carYear = form.querySelector("#carYear").value;
      updatedUser.licensePlate = form.querySelector("#licensePlate").value;
    }

    if (role.includes("user")) {
      const updatedUsers = users.map(u => (u.email === currentUser.email ? updatedUser : u));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    if (role.includes("driver")) {
      const updatedDrivers = drivers.map(d => (d.email === currentUser.email ? updatedUser : d));
      localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    window.location.href = "SearchHome.html";
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
