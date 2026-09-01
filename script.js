
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

document.getElementById("year").textContent = new Date().getFullYear();

const loanForm = document.getElementById("loanForm");
loanForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const income = document.getElementById("income").value;
  const message = document.getElementById("message").value.trim();

  const text =
`Hello Meke Financial Services. I would like to apply for a cash loan.

Full name: ${name}
Phone: ${phone}
Loan amount requested: N$${amount}
Income status: ${income}
Message: ${message || "None"}

Please advise me on the next steps and required documents.`;

  const url = "https://wa.me/264813027355?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
});
