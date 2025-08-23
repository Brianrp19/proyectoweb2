function getRideIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadRideData(id) {
  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const ride = allRides.find(r => r.id === id);

  if (!ride) {
    window.location.href = "RidesR.html";
    return null;
  }

  document.getElementById("from").value = ride.from || "";
  document.getElementById("to").value = ride.to || "";
  document.getElementById("time").value = ride.time || "";
  document.getElementById("seats").value = ride.seats || "";
  document.getElementById("fee").value = ride.fee || "";
  document.getElementById("make").value = ride.make || "";
  document.getElementById("model").value = ride.model || "";
  document.getElementById("year").value = ride.year || "";

  if (ride.days && Array.isArray(ride.days)) {
    ride.days.forEach(day => {
      const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }

  return ride;
}

function saveRideChanges(id) {
  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const rideIndex = allRides.findIndex(r => r.id === id);

  if (rideIndex === -1) return;

  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const time = document.getElementById("time").value;
  const seats = parseInt(document.getElementById("seats").value);
  const fee = parseFloat(document.getElementById("fee").value);
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value.trim();
  const year = document.getElementById("year").value;
  const days = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);

  allRides[rideIndex] = {
    ...allRides[rideIndex],
    from,
    to,
    time,
    seats,
    fee,
    make,
    model,
    year,
    days
  };

  localStorage.setItem("rides", JSON.stringify(allRides));
  window.location.href = "RidesR.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const drivers = JSON.parse(localStorage.getItem("drivers")) || [];

  const isDriver = currentUser && drivers.some(driver => driver.email === currentUser.email);

  if (!isDriver) {
    window.location.href = "RidesR.html";
    return;
  }

  const rideId = getRideIdFromURL();
  if (!rideId) {
    window.location.href = "RidesR.html";
    return;
  }

  loadRideData(rideId);

  document.querySelector(".btn-save").addEventListener("click", () => saveRideChanges(rideId));

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
