// js/recipe-detail.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("recipe-detail");
  const recipes = window.RECIPES || [];

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    container.innerHTML = `
      <section class="recipe-not-found">
        <h1>Recipe not found</h1>
        <p>The recipe you’re looking for may have moved or doesn’t exist.</p>
        <a href="recipes.html" class="back-link">Back to recipes</a>
      </section>
    `;
    return;
  }

  // Helpers for display text
  const capitalize = (str) =>
    typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const categoryLabel = capitalize(recipe.category); // starters -> Starters
  const meatLabel =
    recipe.meat && recipe.meat !== "none" ? capitalize(recipe.meat) : "No meat";
  const difficultyLabel = capitalize(recipe.difficulty);

  // Simple duration bucket for one of the chips
  let durationLabel = `${recipe.duration} min`;
  if (recipe.duration < 30) durationLabel = "< 30 min";
  else if (recipe.duration <= 60) durationLabel = "30–60 min";
  else durationLabel = "> 60 min";

  // Classification chips – tweak as you like
  const classificationChips = [
    categoryLabel,
    meatLabel,
    difficultyLabel,
    durationLabel,
  ];

  container.innerHTML = `
    <!-- HERO BAND -->
    <section class="recipe-detail-hero">
      <div class="recipe-detail-hero__inner">
        <div class="recipe-detail-hero__image">
          <img src="${recipe.image}" alt="${recipe.title}">
        </div>

        <div class="recipe-detail-hero__content">
          <p class="recipe-detail-hero__eyebrow">
            ${categoryLabel}${recipe.meat ? " · " + meatLabel : ""}
          </p>

          <h1 class="recipe-detail-hero__title">
            ${recipe.title}
          </h1>

          <p class="recipe-detail-hero__meta">
            <span>${recipe.duration} min</span>
            ${recipe.serves ? `<span>Serves ${recipe.serves}</span>` : ""}
            ${recipe.difficulty ? `<span>${difficultyLabel}</span>` : ""}
          </p>

          <p class="recipe-detail-hero__description">
            ${recipe.description || ""}
          </p>

          <p class="recipe-detail-hero__tags-label">Classification</p>
          <p class="recipe-detail-hero__tags">
            ${classificationChips
              .map((chip) => `<span>${chip}</span>`)
              .join("")}
          </p>
        </div>
      </div>
    </section>

    <!-- INGREDIENTS + METHOD -->
    <section class="recipe-detail-body">
      <article class="recipe-detail-body__panel">
        <h2 class="recipe-detail-body__title">Ingredients</h2>
        <ul class="recipe-detail-body__ingredients-list">
          ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </article>

      <article class="recipe-detail-body__panel">
        <h2 class="recipe-detail-body__title">Method</h2>
        <ol class="recipe-detail-body__steps-list">
          ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </article>
    </section>
  `;
});
