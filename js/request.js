document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const navRides = document.getElementById("nav-rides");
  const footerRides = document.getElementById("footer-rides");

  if (role !== "driver") {
    if (navRides) navRides.style.setProperty("display", "none", "important");
    if (footerRides) footerRides.style.setProperty("display", "none", "important");
  }

  const requestButton = document.querySelector(".btn-request");
  const userNameElement = document.querySelector(".user-name");

  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (userData && userData.firstName) {
    userNameElement.textContent = `${userData.firstName} ${userData.lastName}`;
  } else {
    userNameElement.textContent = "Usuario desconocido";
  }

  const params = new URLSearchParams(window.location.search);
  const rideId = params.get("id");

  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const ride = allRides.find(r => r.id === rideId);

  if (!ride) {
    alert("No se encontró el ride.");
    window.location.href = "SearchHome.html";
    return;
  }


  const departureSpan = document.querySelector(".horizontal-info p:nth-of-type(1) span");
  const arrivalSpan = document.querySelector(".horizontal-info p:nth-of-type(2) span");
  if (departureSpan) departureSpan.textContent = ride.from;
  if (arrivalSpan) arrivalSpan.textContent = ride.to;

  document.getElementById("time-select").value = ride.time || "";
  document.getElementById("seats-select").value = ride.seats || "";
  document.getElementById("fee-select").value = ride.fee || "";
  document.getElementById("make-select").value = ride.make || "";
  document.getElementById("model-input").value = ride.model || "";
  document.getElementById("year-select").value = ride.year || "";

  
  if (ride.days && Array.isArray(ride.days)) {
    ride.days.forEach(day => {
      const checkbox = document.querySelector(`.days-checkbox input[value="${day}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }


  if (requestButton) {
    requestButton.addEventListener("click", function (e) {
      e.preventDefault();

      const daysCheckboxes = document.querySelectorAll(".days-checkbox input[type='checkbox']");
      const selectedDays = Array.from(daysCheckboxes)
        .filter(chk => chk.checked)
        .map(chk => chk.value);

      const time = document.getElementById("time-select").value;
      const seats = document.getElementById("seats-select").value;
      const fee = document.getElementById("fee-select").value;
      const make = document.getElementById("make-select").value;
      const model = document.getElementById("model-input").value;
      const year = document.getElementById("year-select").value;

      const departure = departureSpan ? departureSpan.textContent : "Desconocido";
      const arrival = arrivalSpan ? arrivalSpan.textContent : "Desconocido";

      const booking = {
        rideId: ride.id, 
        user: userData && userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : "Anon",
        departure,
        arrival,
        days: selectedDays,
        time,
        seats,
        fee,
        vehicle: { make, model, year },
        dateCreated: new Date().toISOString()
      };

      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push(booking);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      window.location.href = "SearchHome.html";
    });
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
