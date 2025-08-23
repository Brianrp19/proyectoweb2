document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  if (role !== "driver") {
    alert("Solo los conductores pueden crear rides.");
    window.location.href = "SearchHome.html";
    return;
  }

  const createButton = document.querySelector(".btn-create");

  createButton.addEventListener("click", () => {
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const time = document.getElementById("time").value;
    const seats = parseInt(document.getElementById("seats").value);
    const fee = parseFloat(document.getElementById("fee").value);
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value.trim();
    const year = document.getElementById("year").value;
    const days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("No hay un usuario logueado.");
      return;
    }

    const rideId = Date.now().toString();

    const newRide = {
      id: rideId,
      userId: currentUser.email,
      driverName: `${currentUser.firstName} ${currentUser.lastName}`,
      from,
      to,
      days,
      time,
      seats,
      fee,
      make,
      model,
      year
    };

    const allRides = JSON.parse(localStorage.getItem("rides")) || [];
    allRides.push(newRide);
    localStorage.setItem("rides", JSON.stringify(allRides));

    window.location.href = "RidesR.html";
  });

  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.trim().toLowerCase() === "logout") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");
        alert("You have been logged out.");
        window.location.href = "index.html";
      });
    }
  });
});
