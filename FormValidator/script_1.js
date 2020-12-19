const form = document.querySelector("#form"),
  username = document.querySelector("#username"),
  email = document.querySelector("#email"),
  password1 = document.querySelector("#password"),
  password2 = document.querySelector("#confirmed-password");

function showError(input, message) {
  const formControl = input.parentElement;

  formControl.className = "form-control error";

  const msg = formControl.querySelector("small");

  msg.innerText = message;
}

function showSuccess(input) {
  const formControl = input.parentElement;

  formControl.className = "form-control success";
}

function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
}

// event handlers
form.addEventListener("submit", e => {
  e.preventDefault();

  username.value === "" ? showError(username, "username is required") : showSuccess(username);

  if (email.value === "") {
    showError(email, "Email is required");
  } else if (!validateEmail(email.value)) {
    showError(email, "Email is invalid");
  } else {
    showSuccess(email);
  }

  password1.value === "" ? showError(password1, "password is required") : showSuccess(password1);

  password2.value === "" ? showError(password2, "password is required") : showSuccess(password2);
});
