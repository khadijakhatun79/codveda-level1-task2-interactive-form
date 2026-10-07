const form = document.getElementById("signupForm");
const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  password: document.getElementById("password"),
};
const terms = document.getElementById("terms");
const formStatus = document.getElementById("formStatus");
const togglePassword = document.getElementById("togglePassword");
const strengthBar = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");

function showError(input, message) {
  const error = document.getElementById(`${input.id}Error`);
  if (error) error.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message && input.value.trim().length > 0);
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateName() {
  const value = fields.fullName.value.trim();
  const message = value.length < 2 ? "Please enter your full name (at least 2 characters)." : "";
  showError(fields.fullName, message);
  return !message;
}

function validateEmail() {
  const value = fields.email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const message = !value ? "Email address is required." : !valid ? "Enter a valid email address." : "";
  showError(fields.email, message);
  return !message;
}

function validatePhone() {
  const value = fields.phone.value.trim();
  const digits = value.replace(/[\s()+-]/g, "");
  const valid = /^\d{10,15}$/.test(digits);
  const message = !value ? "Phone number is required." : !valid ? "Enter 10–15 digits; you may include +, spaces, or hyphens." : "";
  showError(fields.phone, message);
  return !message;
}

function passwordStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

function validatePassword() {
  const value = fields.password.value;
  const score = passwordStrength(value);
  const valid = value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
  const message = !value ? "Password is required." : !valid ? "Use at least 8 characters with uppercase, lowercase, and a number." : "";
  showError(fields.password, message);
  const labels = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#d1d5db", "#ef4444", "#f97316", "#eab308", "#22c55e", "#15803d"];
  strengthBar.style.width = value ? `${score * 20}%` : "0";
  strengthBar.style.background = colors[score];
  strengthLabel.textContent = value ? `Password strength: ${labels[score]}` : "";
  return !message;
}

function validateTerms() {
  const message = terms.checked ? "" : "Please accept the terms to continue.";
  document.getElementById("termsError").textContent = message;
  terms.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

fields.fullName.addEventListener("input", validateName);
fields.email.addEventListener("input", validateEmail);
fields.phone.addEventListener("input", validatePhone);
fields.password.addEventListener("input", validatePassword);
terms.addEventListener("change", validateTerms);

Object.values(fields).forEach((input) => {
  input.addEventListener("blur", () => {
    if (!input.value.trim()) return;
    if (input === fields.fullName) validateName();
    if (input === fields.email) validateEmail();
    if (input === fields.phone) validatePhone();
    if (input === fields.password) validatePassword();
  });
});

togglePassword.addEventListener("click", () => {
  const shouldShow = fields.password.type === "password";
  fields.password.type = shouldShow ? "text" : "password";
  togglePassword.textContent = shouldShow ? "Hide" : "Show";
  togglePassword.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("fail");

  const isValid = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validatePassword(),
    validateTerms(),
  ].every(Boolean);

  if (!isValid) {
    formStatus.textContent = "Please fix the highlighted fields and try again.";
    formStatus.classList.add("fail");
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formStatus.textContent = `Success! Your form is valid, ${fields.fullName.value.trim()}. (Demo only — no data was sent.)`;
  form.reset();
  Object.values(fields).forEach((input) => {
    input.classList.remove("valid", "invalid");
    input.setAttribute("aria-invalid", "false");
  });
  strengthBar.style.width = "0";
  strengthLabel.textContent = "";
  document.getElementById("termsError").textContent = "";
});
