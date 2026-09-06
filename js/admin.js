// =======================
// ADD QUESTION
// =======================
function addQuestion() {
  const role = document.getElementById("adminRole").value;
  const questionInput = document.getElementById("newQuestion");
  const questionText = questionInput.value.trim();

  if (!questionText) {
    alert("Please enter a question!");
    return;
  }

  // Fetch existing questions
  const data = JSON.parse(localStorage.getItem("customQuestions")) || {};
  if (!data[role]) data[role] = [];

  // Add new question
  data[role].push(questionText);
  localStorage.setItem("customQuestions", JSON.stringify(data));

  // Clear input
  questionInput.value = "";

  // Refresh question list
  displayQuestions(role);
}

// =======================
// DISPLAY QUESTIONS
// =======================
function displayQuestions(role) {
  const data = JSON.parse(localStorage.getItem("customQuestions")) || {};
  const listDiv = document.getElementById("questionList");
  listDiv.innerHTML = `<h2>Questions for ${role}:</h2>`;

  if (data[role] && data[role].length) {
    data[role].forEach((q, index) => {
      const item = document.createElement("div");
      item.className = "question-item";
      item.innerHTML = `
        <span>${q}</span>
        <div>
          <button class="edit-btn" onclick="editQuestion('${role}', ${index})">Edit</button>
          <button onclick="deleteQuestion('${role}', ${index})">Delete</button>
        </div>
      `;
      listDiv.appendChild(item);
    });
  } else {
    listDiv.innerHTML += "<p>No questions added yet.</p>";
  }
}

// =======================
// EDIT QUESTION
// =======================
function editQuestion(role, index) {
  const data = JSON.parse(localStorage.getItem("customQuestions")) || {};
  const newQ = prompt("Edit question:", data[role][index]);
  if (newQ !== null && newQ.trim() !== "") {
    data[role][index] = newQ.trim();
    localStorage.setItem("customQuestions", JSON.stringify(data));
    displayQuestions(role);
  }
}

// =======================
// DELETE QUESTION
// =======================
function deleteQuestion(role, index) {
  const data = JSON.parse(localStorage.getItem("customQuestions")) || {};
  if (confirm("Are you sure you want to delete this question?")) {
    data[role].splice(index, 1);
    localStorage.setItem("customQuestions", JSON.stringify(data));
    displayQuestions(role);
  }
}

// =======================
// INITIAL LOAD
// =======================
document.getElementById("adminRole").addEventListener("change", (e) => {
  displayQuestions(e.target.value);
});

// Display default role questions on page load
displayQuestions(document.getElementById("adminRole").value);
