function register() {
  let user = {
    name: name.value,
    email: email.value,
    password: password.value
  };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Registration Successful!");
  window.location.href = "login.html";
}

function login() {
  let storedUser = JSON.parse(localStorage.getItem("user"));

  if (
    email.value === storedUser.email &&
    password.value === storedUser.password
  ) {
    localStorage.setItem("loggedIn", true);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}
