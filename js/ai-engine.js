function evaluateAnswer(answer) {
  // Default feedback structure
  let feedback = {
    score: 0,
    strength: "",
    weakness: "",
    tip: ""
  };

  // Role-based sample questions (can be expanded)
  const custom = JSON.parse(localStorage.getItem("customQuestions")) || {};
if (custom[role]) {
  questions.push(...custom[role]);
}



  const roleQuestions = {
    hr: [
      "Tell me about yourself",
      "What are your strengths?",
      "Where do you see yourself in 5 years?"
    ],
    java: [
      "What is OOP in Java?",
      "Difference between ArrayList and LinkedList?",
      "What is JVM?"
    ],
    android: [
      "What is Activity lifecycle?",
      "What is RecyclerView?",
      "Difference between Fragment and Activity?"
    ],
    web: [
      "Difference between HTML and HTML5?",
      "What is CSS Flexbox?",
      "Explain JavaScript closures"
    ]
  };

  // Get role from localStorage (default HR)
  const role = localStorage.getItem("role") || "hr";
  const questions = roleQuestions[role];

  // Simple scoring based on answer length
  if (!answer || answer.trim().length === 0) {
    feedback.score = 0;
    feedback.strength = "No answer provided";
    feedback.weakness = "Skipped question";
    feedback.tip = "Always attempt every question";
  } else if (answer.length > 120) {
    feedback.score = 10;
    feedback.strength = "Good explanation, confident and detailed";
    feedback.weakness = "Minor clarity improvements";
    feedback.tip = "Structure answers with examples for better impact";
  } else if (answer.length > 60) {
    feedback.score = 6;
    feedback.strength = "Clear basic understanding";
    feedback.weakness = "Lack of depth or examples";
    feedback.tip = "Add relevant examples or elaboration";
  } else {
    feedback.score = 3;
    feedback.strength = "Answered the question";
    feedback.weakness = "Very short and lacks clarity";
    feedback.tip = "Expand your thoughts confidently and clearly";
  }

  // Optional: Add role-specific tips
  switch (role) {
    case "hr":
      feedback.tip += " HR interviews value personality and communication.";
      break;
    case "java":
      feedback.tip += " Include code examples and technical terms where possible.";
      break;
    case "android":
      feedback.tip += " Mention lifecycle events and Android-specific components.";
      break;
    case "web":
      feedback.tip += " Include HTML, CSS, or JS concepts clearly with examples.";
      break;
  }

  return feedback;
}



