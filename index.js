document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.getElementById("signupbutton");
  const signinButton = document.getElementById("signinbutton");
  const signupForm = document.getElementById("signup");
  const signinForm = document.getElementById("signin");

  // Show login by default
  signinForm.style.display = "block";
  signupForm.style.display = "none";

  // Switch to Register form
  signupButton.addEventListener("click", () => {
    signupForm.style.display = "block";
    signinForm.style.display = "none";
  });

  // Switch to Login form
  signinButton.addEventListener("click", () => {
    signupForm.style.display = "none";
    signinForm.style.display = "block";
  });
});






















