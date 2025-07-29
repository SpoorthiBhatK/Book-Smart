function signUp() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && password) {
    // Save user details to localStorage (or Firebase, if applicable)
    localStorage.setItem("booksmartUser", username);
    localStorage.setItem("booksmartPass", password);
    
    // Redirect to login page after successful signup
    window.location.href = "login.html";  // Redirect to login page
  } else {
    alert("Please fill in both fields.");
  }
}
