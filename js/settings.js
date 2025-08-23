document.addEventListener("DOMContentLoaded", () => {
  const role = (localStorage.getItem("role") || "").trim();
  const currentUserJSON = localStorage.getItem("currentUser");

  if (!currentUserJSON) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = JSON.parse(currentUserJSON);
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
  const settings = JSON.parse(localStorage.getItem("settings")) || {};

  const navRides = document.getElementById("nav-rides");
  if (role !== "driver") {
    if (navRides) navRides.style.display = "none";
  } else {
    if (navRides) navRides.style.display = "inline-block";
  }

  let fullUserData;
  if (role === "driver") {
    fullUserData = drivers.find(d => d.email === currentUser.email);
  } else {
    fullUserData = users.find(u => u.email === currentUser.email);
  }
  if (!fullUserData) fullUserData = currentUser;

  const publicNameInput = document.getElementById("publicName");
  if (publicNameInput) {
    publicNameInput.value = `${fullUserData.firstName || ""} ${fullUserData.lastName || ""}`.trim();
    publicNameInput.readOnly = true;
  }

  const settingsKey = `${role}_${currentUser.email}`;
  const publicBioTextarea = document.getElementById("publicBio");
  if (publicBioTextarea && settings[settingsKey]) {
    publicBioTextarea.value = settings[settingsKey].publicBio || "";
  }

  const form = document.querySelector(".config-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newBio = publicBioTextarea.value.trim();

      settings[settingsKey] = { publicBio: newBio };
      localStorage.setItem("settings", JSON.stringify(settings));

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
