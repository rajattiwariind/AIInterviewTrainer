// =======================
// SAFE DATA FETCH
// =======================
const score = Number(localStorage.getItem("lastScore")) || 0;
const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
const confidenceData =
  JSON.parse(localStorage.getItem("confidenceGraph")) || [];
const aiFinalFeedback =
  localStorage.getItem("aiFinalFeedback") ||
  "You showed consistent effort throughout the interview. Focus on improving clarity, confidence, and structured answers.";

const maxScore = feedbacks.length * 10;
const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;

// =======================
// RATING LOGIC
// =======================
let rating = "Beginner";
if (percentage >= 80) rating = "Pro";
else if (percentage >= 50) rating = "Intermediate";

// =======================
// SCORE COUNTER ANIMATION
// =======================
const scoreText = document.getElementById("scoreText");
let current = 0;

const counter = setInterval(() => {
  if (current >= score) {
    clearInterval(counter);
    scoreText.innerText = `${score} / ${maxScore}`;
  } else {
    current++;
    scoreText.innerText = `${current} / ${maxScore}`;
  }
}, 15);

// =======================
// SUMMARY TEXT
// =======================
document.getElementById("percentage").innerText = percentage + "%";
document.getElementById("rating").innerText = rating;

// =======================
// EMOTION DETECTION
// =======================
let avgConfidence = confidenceData.length
  ? confidenceData.reduce((a, b) => a + b, 0) / confidenceData.length
  : 0;

let emotionText = "Neutral 😐";
let emotionClass = "neutral";

if (avgConfidence >= 65) {
  emotionText = "Confident 🙂";
  emotionClass = "confident";
} else if (avgConfidence <= 35) {
  emotionText = "Nervous 😟";
  emotionClass = "nervous";
}

const emotionLabel = document.getElementById("emotionLabel");
if (emotionLabel) {
  emotionLabel.innerText = emotionText;
  emotionLabel.classList.add(emotionClass);
}

// =======================
// AI FINAL FEEDBACK
// =======================
const aiFeedbackEl = document.getElementById("aiFeedback");
if (aiFeedbackEl) {
  aiFeedbackEl.innerText = aiFinalFeedback;
}

// =======================
// DOUGHNUT CHART
// =======================
new Chart(document.getElementById("scoreChart"), {
  type: "doughnut",
  data: {
    labels: ["Score", "Remaining"],
    datasets: [{
      data: [score, Math.max(maxScore - score, 0)],
      backgroundColor: ["#6c63ff", "#1b1f3b"],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { labels: { color: "#fff" } }
    }
  }
});

// =======================
// BAR CHART
// =======================
new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: feedbacks.map((_, i) => `Q${i + 1}`),
    datasets: [{
      label: "Score",
      data: feedbacks.map(f => f.score),
      backgroundColor: "#6c63ff",
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: "#fff" }, grid: { display: false } },
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { color: "#fff" },
        grid: { color: "#222" }
      }
    },
    plugins: {
      legend: { labels: { color: "#fff" } }
    }
  }
});

// =======================
// CONFIDENCE GRAPH
// =======================
const confidenceCanvas = document.getElementById("confidenceChart");

if (confidenceCanvas && confidenceData.length) {
  new Chart(confidenceCanvas, {
    type: "line",
    data: {
      labels: confidenceData.map((_, i) => `T${i + 1}`),
      datasets: [{
        label: "Confidence Level",
        data: confidenceData,
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.25)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100, ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" } }
      },
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });
}

// =======================
// FEEDBACK SECTION (CORRECTNESS ENABLED)
// =======================
const details = document.getElementById("details");

if (!feedbacks.length) {
  details.innerHTML = "<p>No feedback available.</p>";
} else {
  feedbacks.forEach((f, i) => {

    let statusText = "❌ Incorrect";
    let cardClass = "incorrect";

    if (f.correctness && f.correctness.includes("Correct")) {
      statusText = "✅ Correct";
      cardClass = "correct";
    } else if (f.correctness && f.correctness.includes("Partially")) {
      statusText = "Partially Correct";
      cardClass = "partial";
    }

    details.innerHTML += `
      <div class="feedback-card ${cardClass}">
        <h3>Question ${i + 1}</h3>
        <p><b>Status:</b> ${statusText}</p>
        <p><b>Strength:</b> ${f.strength}</p>
        <p><b>Weakness:</b> ${f.weakness}</p>

        ${
          cardClass !== "correct"
            ? `<p><b>Expected Answer:</b><br>${f.correctAnswer || "Not available"}</p>`
            : ""
        }
      </div>
    `;
  });
}

// =======================
// PDF DOWNLOAD
// =======================
function downloadPDF() {
  const report = document.getElementById("report");

  html2pdf().set({
    margin: [0.6, 0.5],
    filename: "AI_Interview_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css"] }
  }).from(report).save();
}
