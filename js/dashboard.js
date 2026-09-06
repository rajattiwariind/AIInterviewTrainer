// ---------- LOAD DASHBOARD STATS ----------
function loadStats() {
  // Get all interviews safely
  let interviews = JSON.parse(localStorage.getItem("interviews")) || [];
  document.getElementById("count").innerText = interviews.length;

  // Get last score safely
  let lastScore = localStorage.getItem("lastScore");
  document.getElementById("score").innerText = lastScore !== null ? lastScore : "-";
}

// Call on page load
loadStats();

// ---------- START INTERVIEW ----------
function startInterview() {
  const role = document.getElementById("role").value;

  // Save selected role for interview
  localStorage.setItem("role", role);

  // Redirect to interview page
  window.location.href = "interview.html";
}

// ---------- OPTIONAL: Update stats when returning from interview ----------
window.addEventListener("focus", loadStats); 

