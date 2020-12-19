const form = document.querySelector("#form"),
  username = document.querySelector("#username"),
  email = document.querySelector("#email"),
  password = document.querySelector("#password"),
  confirmedPassword = document.querySelector("#confirmed-password");

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

function validateEmail(input) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(input.value.toLowerCase().trim())) {
    showError(input, `${getInputFieldName(input)} is invalid`);
  } else {
    showSuccess(input);
  }
}

function isRequired(inputFields) {
  inputFields.forEach(input => {
    if (input.value.trim() === "") {
      showError(input, `${getInputFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// capitalize the word's 1st char, slice the rest of its chars & then concat them back to the 1st one
const getInputFieldName = input => input.id.charAt(0).toUpperCase().concat(input.id.slice(1));

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${getInputFieldName(input)} must be at least ${min} characters`);
  } else if (input.value.length > max) {
    showError(input, `${getInputFieldName(input)} must be below ${max} characters`);
  } else {
    showSuccess(input);
  }
}

function confirmPassword(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
  }
}

// event handlers
form.addEventListener("submit", e => {
  e.preventDefault();

  isRequired([username, email, password, confirmedPassword]);

  checkLength(username, 3, 15);
  checkLength(password, 6, 25);

  validateEmail(email);

  confirmPassword(password, confirmedPassword);
});
