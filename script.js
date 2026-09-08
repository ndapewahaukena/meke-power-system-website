const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();


// ===============================
// LOAN APPLICATION
// ===============================

const loanForm = document.getElementById("loanForm");

loanForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = loanForm.querySelector("button[type='submit']");

  // Change button while submitting
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    // Collect all form fields AND uploaded documents
    const formData = new FormData(loanForm);

    // Send application to backend
    const response = await fetch(
      "http://localhost:5000/api/applications",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {

      alert(
        "Application submitted successfully! " +
        "Meke Financial Services has received your application."
      );

      // Clear the form
      loanForm.reset();

    } else {

      alert(
        "Application could not be submitted.\n\n" +
        (result.message || "Please try again.")
      );
    }

  } catch (error) {

    console.error("Submission error:", error);

    alert(
      "Could not connect to the Meke server.\n\n" +
      "Please make sure the backend server is running."
    );

  } finally {

    // Restore button
    submitButton.disabled = false;
    submitButton.textContent = "Submit Loan Application";
  }
});
