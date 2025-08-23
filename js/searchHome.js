document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  console.log("Role from localStorage:", role);

  const navRides = document.getElementById("nav-rides");
  const footerRides = document.getElementById("footer-rides");
  if (role !== "driver") {
    if (navRides) navRides.style.setProperty("display", "none", "important");
    if (footerRides) footerRides.style.setProperty("display", "none", "important");
  }

  const selectFrom = document.getElementById("from");
  const selectTo = document.getElementById("to");
  const btnFind = document.getElementById("btnFindRides");
  const ridesWrapper = document.querySelector(".rides-table-wrapper");
  const ridesTableBody = document.getElementById("rides-tbody");
  const resultTitle = document.getElementById("result-title");
  const fromResult = document.getElementById("from-result");
  const toResult = document.getElementById("to-result");
  const mapIframe = document.querySelector('.map-iframe');

  const allRides = JSON.parse(localStorage.getItem("rides")) || [];
  const allDrivers = JSON.parse(localStorage.getItem("drivers")) || [];

  function getDriverNameByEmail(email) {
    if (!email) return "Unknown";
    const driver = allDrivers.find(d => d.email === email);
    return driver ? `${driver.firstName} ${driver.lastName}` : "Unknown";
  }

  const uniqueFroms = [...new Set(allRides.map(r => r.from))];
  const uniqueTos = [...new Set(allRides.map(r => r.to))];

  function fillSelectOptions(select, options) {
    select.innerHTML = '<option disabled selected>--Select--</option>';
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
  }

  fillSelectOptions(selectFrom, uniqueFroms);
  fillSelectOptions(selectTo, uniqueTos);

  if (ridesWrapper) ridesWrapper.style.display = "none";
  if (resultTitle) resultTitle.style.display = "none";

  if (btnFind) {
    btnFind.addEventListener("click", () => {
      const allRidesUpdated = JSON.parse(localStorage.getItem("rides")) || [];
      const from = selectFrom.value;
      const to = selectTo.value;
      const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);

      if (!from || !to) {
        alert("Please select both From and To.");
        return;
      }

      if (mapIframe) {
        const origin = encodeURIComponent(from);
        const destination = encodeURIComponent(to);
        mapIframe.src = `https://www.google.com/maps?q=${origin}+to+${destination}&output=embed`;
      }

      const filteredRides = allRidesUpdated.filter(ride => {
        if (ride.from !== from) return false;
        if (ride.to !== to) return false;
        if (selectedDays.length === 0) return true;
        if (!ride.days || !Array.isArray(ride.days)) return false;
        return ride.days.some(day => selectedDays.includes(day));
      });

      if (fromResult) fromResult.textContent = from;
      if (toResult) toResult.textContent = to;
      if (ridesTableBody) ridesTableBody.innerHTML = "";

      if (filteredRides.length === 0) {
        if (ridesWrapper) ridesWrapper.style.display = "none";
        if (resultTitle) resultTitle.style.display = "none";
        if (ridesTableBody) ridesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#777;">No rides found from ${from} to ${to}.</td></tr>`;
        return;
      }

      if (ridesWrapper) ridesWrapper.style.display = "block";
      if (resultTitle) resultTitle.style.display = "block";

      filteredRides.forEach(ride => {
        const daysText = (ride.days && Array.isArray(ride.days) && ride.days.length > 0) ? ride.days.join(", ") : "-";
        const driverName = getDriverNameByEmail(ride.userId);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${driverName}</td>
          <td>${ride.from || "-"}</td>
          <td>${ride.to || "-"}</td>
          <td>${ride.seats || "-"}</td>
          <td>${(ride.make || "")} ${(ride.model || "")} ${(ride.year || "")}</td>
          <td>${ride.fee !== undefined ? `$${ride.fee}` : "-"}</td>
          <td>${daysText}</td>
          <td><a href="VerRide.html?id=${encodeURIComponent(ride.id)}" class="request-link">Request</a></td>
        `;
        ridesTableBody.appendChild(row);
      });
    });
  }

  document.querySelectorAll('a[href="index.html"]').forEach(link => {
    if (link.textContent.trim().toLowerCase() === "logout") {
      link.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");
        alert("You have been logged out.");
        window.location.href = "index.html";
      });
    }
  });
});
