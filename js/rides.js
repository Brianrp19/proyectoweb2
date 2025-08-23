document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    window.location.href = "index.html";
    return;
  }

  const tbody = document.getElementById("rides-body");
  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const userRides = allRides.filter(ride => ride.userId === currentUser.email);

  if (!tbody) return;
  if (userRides.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No rides found</td></tr>`;
  } else {
    tbody.innerHTML = "";
    userRides.forEach(ride => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="link-text">${ride.from}</td>
        <td>${ride.to}</td>
        <td>${ride.seats}</td>
        <td>${ride.make} ${ride.model} ${ride.year}</td>
        <td>$${ride.fee}</td>
        <td>
          <a href="EditRides.html?id=${ride.id}" class="link-text">Edit</a> |
          <a href="#" class="link-text btn-delete" data-id="${ride.id}">Delete</a>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      const id = button.getAttribute("data-id");
      deleteRide(id);
    });
  });

  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.trim().toLowerCase() === "logout") {
      link.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");
        window.location.href = "index.html";
      });
    }
  });
});

function deleteRide(id) {
  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const updatedRides = allRides.filter(ride => ride.id !== id);
  localStorage.setItem("rides", JSON.stringify(updatedRides));
  location.reload();
}
