// js/recipes-overview.js
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".recipes-category .card[data-recipe-id]");

  cards.forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-recipe-id");
      if (!id) return;
      window.location.href = `recipe.html?id=${encodeURIComponent(id)}`;
    });
  });
});
