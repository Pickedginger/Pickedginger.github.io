document.addEventListener("DOMContentLoaded", function() {
  const acc = document.querySelectorAll(".accordion");
  acc.forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  });
});
