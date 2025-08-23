document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  const navRides = document.getElementById("nav-rides");
  const footerRides = document.getElementById("footer-rides");

  if (role !== "driver") {
    if (navRides) navRides.classList.add("hidden-by-role");
    if (footerRides) footerRides.classList.add("hidden-by-role");
  }

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

  const tbody = document.querySelector(".rides-table tbody");
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  bookings.forEach(b => {
    if (!b.status) b.status = "pending";
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  function renderBookings() {
    tbody.innerHTML = "";

    if (bookings.length === 0) {
      const trEmpty = document.createElement("tr");
      const tdEmpty = document.createElement("td");
      tdEmpty.colSpan = 3;
      tdEmpty.textContent = "No hay bookings disponibles.";
      trEmpty.appendChild(tdEmpty);
      tbody.appendChild(trEmpty);
      return;
    }

    bookings.forEach((booking, index) => {
      const tr = document.createElement("tr");

      const tdUser = document.createElement("td");
      const img = document.createElement("img");
      img.src = "Imagenes/LogoPersona.png";
      img.alt = "User";
      img.classList.add("user-avatar", "me-2");
      tdUser.appendChild(img);
      tdUser.appendChild(document.createTextNode(booking.user));
      tr.appendChild(tdUser);

      const tdRide = document.createElement("td");
      tdRide.textContent = `${booking.departure} - ${booking.arrival}`;
      tr.appendChild(tdRide);

      const tdActions = document.createElement("td");

      if (role === "driver") {
        if (booking.status === "pending") {
          const acceptLink = document.createElement("a");
          acceptLink.href = "#";
          acceptLink.textContent = "Accept";
          acceptLink.classList.add("link-accept", "me-2");
          acceptLink.style.cursor = "pointer";
          acceptLink.addEventListener("click", (e) => {
            e.preventDefault();
            updateBookingStatus(index, "accepted");
          });

          const rejectLink = document.createElement("a");
          rejectLink.href = "#";
          rejectLink.textContent = "Reject";
          rejectLink.classList.add("link-reject");
          rejectLink.style.cursor = "pointer";
          rejectLink.addEventListener("click", (e) => {
            e.preventDefault();
            updateBookingStatus(index, "rejected");
          });

          tdActions.appendChild(acceptLink);
          tdActions.appendChild(document.createTextNode(" | "));
          tdActions.appendChild(rejectLink);
        } else {
          tdActions.textContent = booking.status === "accepted" ? "Accepted" : "Rejected";
        }
      } else {
        tdActions.textContent =
          booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
      }

      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
  }

  function updateBookingStatus(index, status) {
    bookings[index].status = status;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
  }

  renderBookings();
});
