function toggleSidebar() {
  const nav = document.querySelector(".navbar");
  const icon = document.querySelector(".menu-button i");
  const isOpen = nav.classList.toggle("nav-open");

  if (isOpen) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
}

function hideSidebar() {
  const nav = document.querySelector(".navbar");
  const icon = document.querySelector(".menu-button i");

  nav.classList.remove("nav-open");
  icon.classList.remove("fa-xmark");
  icon.classList.add("fa-bars");
}

// ABOUT SECTION
document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
});
