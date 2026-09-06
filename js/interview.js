const chat = document.getElementById("chat");
const answerBox = document.getElementById("answer");
const micBtn = document.getElementById("micBtn");
const confidenceBar = document.getElementById("confidenceBar");
const avatar = document.getElementById("avatar");
const camera = document.getElementById("camera");

// ---------------- QUESTIONS ----------------
const roleQuestions = {
  hr: [
    "Tell me about yourself",
    "What are your strengths?",
    "Where do you see yourself in five years?"
  ],
  java: [
    "What is Object Oriented Programming in Java?",
    "Difference between ArrayList and LinkedList?",
    "What is JVM?"
  ],
  android: [
    "Explain Activity lifecycle",
    "What is RecyclerView?",
    "Difference between Fragment and Activity?"
  ],
  web: [
    "Difference between HTML and HTML5?",
    "Explain CSS Flexbox",
    "What is JavaScript closure?"
  ]
};

// ---------------- CORRECT ANSWERS ----------------
const correctAnswers = {
  hr: {
    "Tell me about yourself":
      "A brief introduction including education, skills, experience, and career goals.",
    "What are your strengths?":
      "Strengths like problem-solving, communication, teamwork, adaptability with examples.",
    "Where do you see yourself in five years?":
      "Career growth, learning, leadership, and contributing to the organization."
  },

  java: {
    "What is Object Oriented Programming in Java?":
      "OOP is a programming paradigm based on objects and classes using encapsulation, inheritance, polymorphism, and abstraction.",
    "Difference between ArrayList and LinkedList?":
      "ArrayList uses a dynamic array and allows fast access, while LinkedList allows faster insertion and deletion.",
    "What is JVM?":
      "JVM executes Java bytecode and provides platform independence."
  },

  android: {
    "Explain Activity lifecycle":
      "Activity lifecycle includes onCreate, onStart, onResume, onPause, onStop, onDestroy.",
    "What is RecyclerView?":
      "RecyclerView efficiently displays large data sets using the ViewHolder pattern.",
    "Difference between Fragment and Activity?":
      "Activity is a full screen UI, Fragment is a reusable component inside an Activity."
  },

  web: {
    "Difference between HTML and HTML5?":
      "HTML5 supports semantic tags, multimedia, APIs, and local storage.",
    "Explain CSS Flexbox":
      "Flexbox is a layout system for aligning and distributing elements responsively.",
    "What is JavaScript closure?":
      "A closure is a function that remembers variables from its outer scope."
  }
};

const role = localStorage.getItem("role") || "hr";
const questions = roleQuestions[role];

let index = 0;
let feedbacks = [];
let totalScore = 0;
let confidenceData = [];
let speechStartTime = 0;

// ---------------- ADD MESSAGE ----------------
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ---------------- TEXT TO SPEECH ----------------
function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 0.95;

  if (avatar) avatar.classList.add("talking");
  msg.onend = () => avatar && avatar.classList.remove("talking");

  speechSynthesis.speak(msg);
}

// ---------------- AI EVALUATION ----------------
function evaluateAnswer(answer) {
  if (answer.length > 120)
    return { score: 10, strength: "Confident & detailed", weakness: "Slightly long" };
  if (answer.length > 60)
    return { score: 7, strength: "Good clarity", weakness: "Needs examples" };
  return { score: 4, strength: "Answered", weakness: "Too short" };
}

// ---------------- FIXED ANSWER CORRECTNESS CHECK ----------------
function checkCorrectness(userAnswer, correctAnswer) {
  const cleanUser = userAnswer
    .toLowerCase()
    .replace(/[^\w\s]/g, "");

  const cleanCorrect = correctAnswer
    .toLowerCase()
    .replace(/[^\w\s]/g, "");

  // extract meaningful points (ideas)
  const keyPoints = cleanCorrect
    .split(" ")
    .filter(word => word.length > 5);

  let matched = 0;

  keyPoints.forEach(point => {
    if (cleanUser.includes(point)) {
      matched++;
    }
  });

  // relaxed & realistic thresholds
  if (matched >= 2) return "✅ Correct";
  if (matched >= 1) return "⚠️ Partially Correct";
  return "❌ Incorrect";
}

// ---------------- SHOW QUESTION ----------------
function showQuestion() {
  if (index >= questions.length) {
    endInterview();
    return;
  }

  const q = questions[index];
  addMessage(q, "ai");
  speak(q);
}

showQuestion();

// ---------------- SPEECH RECOGNITION ----------------
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let listening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;


  recognition.onstart = () => {
    listening = true;
    speechStartTime = Date.now();
    micBtn.innerText = "Listening...";
  };

  recognition.onend = () => {
    listening = false;
    micBtn.innerText = "🎤";
  };

  recognition.onerror = (event) => {
  console.error("Mic error:", event.error);
  micBtn.innerText = "🎤";
  listening = false;
  alert("Microphone error: " + event.error + "\nPlease allow mic access & try again.");
};


  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    answerBox.value = transcript;

    let timeTaken = (Date.now() - speechStartTime) / 1000;
    let words = transcript.trim().split(/\s+/).length;
    let speed = words / Math.max(timeTaken, 1);

    let confidence = Math.min(100, Math.round(speed * 15));
    confidenceBar.style.width = confidence + "%";
    confidenceData.push(confidence);
  };
}

// ---------------- MIC BUTTON ----------------
micBtn.addEventListener("click", () => {
  if (!recognition || listening) return;
  recognition.start();
});


// ---------------- SUBMIT ANSWER ----------------
function submitAnswer() {
  if (listening) recognition.stop();

  const answer = answerBox.value.trim();
  if (!answer) return;

  addMessage(answer, "user");

  const currentQuestion = questions[index];
  const correctAnswer = correctAnswers[role][currentQuestion];

  const feedback = evaluateAnswer(answer);
  const correctness = checkCorrectness(answer, correctAnswer);

  feedback.correctness = correctness;
  feedback.correctAnswer = correctAnswer;

  feedbacks.push(feedback);
  totalScore += feedback.score;

  addMessage(
    `${correctness}\n\n📌 Expected Answer:\n${correctAnswer}`,
    "ai"
  );

  answerBox.value = "";
  confidenceBar.style.width = "0%";
  index++;

  setTimeout(showQuestion, 1200);
}

// ---------------- FINAL AI FEEDBACK ----------------
function generateAIFeedback() {
  if (totalScore >= 25) return "Excellent performance with strong clarity and confidence.";
  if (totalScore >= 18) return "Good performance but needs more examples.";
  return "Needs improvement in clarity and confidence.";
}

// ---------------- END INTERVIEW ----------------
function endInterview() {
  addMessage("Interview completed ✅ Generating report...", "ai");

  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  localStorage.setItem("lastScore", totalScore);
  localStorage.setItem("aiFinalFeedback", generateAIFeedback());
  localStorage.setItem("confidenceGraph", JSON.stringify(confidenceData));

  setTimeout(() => {
    window.location.href = "report.html";
  }, 1400);
}

// ---------------- WEBCAM ----------------
if (camera && navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => camera.srcObject = stream)
    .catch(() => console.log("Camera access denied"));
}
