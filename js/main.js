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

// ----- DESKTOP SCROLL-LOCK: HERO + FIRST ABOUT SECTION -----
(function () {
  const DESKTOP_BREAKPOINT = 992; // px

  const heroSection = document.querySelector(".hero");
  const aboutTitle = document.querySelector(".about-section-title-container");
  const secondAboutTitle = document.querySelector(
    ".second-about-section-title-container"
  );

  if (!heroSection || !aboutTitle) return;

  // We snap between these two "slides":
  // 1) Hero video
  // 2) First About title + content (we snap to the title)
  const snapSections = [heroSection, aboutTitle];

  let isSnapping = false;
  let currentIndex = 0;

  function getScrollY() {
    return window.scrollY || window.pageYOffset || 0;
  }

  function updateCurrentIndex() {
    const scrollY = getScrollY();
    let closestIndex = 0;
    let minDistance = Infinity;

    snapSections.forEach((section, index) => {
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      const distance = Math.abs(top - scrollY);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    currentIndex = closestIndex;
  }

  function withinSnapZone() {
    const scrollY = getScrollY();

    // End of the lock zone = start of the SECOND About section title
    if (secondAboutTitle) {
      const zoneEnd =
        secondAboutTitle.getBoundingClientRect().top + window.pageYOffset;

      // While the top of the viewport is above the second About title,
      // we are in the snap zone.
      return scrollY + 10 < zoneEnd;
    }

    // Fallback: if second title not found, just allow locking near the top
    return scrollY < window.innerHeight * 1.5;
  }

  function snapTo(index) {
    if (index < 0 || index >= snapSections.length) return;

    isSnapping = true;
    currentIndex = index;

    snapSections[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      isSnapping = false;
    }, 800); // match smooth scroll duration
  }

  function handleWheel(e) {
    // Desktop only
    if (window.innerWidth < DESKTOP_BREAKPOINT) return;

    // Only lock in our defined zone (hero + first About)
    if (!withinSnapZone()) return;

    if (isSnapping) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY;
    if (Math.abs(delta) < 10) return; // ignore tiny jitters

    updateCurrentIndex();

    if (delta > 0 && currentIndex < snapSections.length - 1) {
      // Scroll down to About
      e.preventDefault();
      snapTo(currentIndex + 1);
    } else if (delta < 0 && currentIndex > 0) {
      // Scroll up back to Hero
      e.preventDefault();
      snapTo(currentIndex - 1);
    }
  }

  window.addEventListener("wheel", handleWheel, { passive: false });

  window.addEventListener("scroll", () => {
    if (isSnapping) return;
    if (window.innerWidth < DESKTOP_BREAKPOINT) return;
    if (!withinSnapZone()) return;
    updateCurrentIndex();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      updateCurrentIndex();
    }
  });

  // Initial index
  updateCurrentIndex();
})();

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

// ====== FULLPAGE PANELS + BULLETS (responsive) ======
document.addEventListener("DOMContentLoaded", () => {
  const panels = Array.from(document.querySelectorAll(".recipes-panel"));
  const dots = Array.from(document.querySelectorAll(".recipes-scroll-dot"));

  if (!panels.length || !dots.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = null;
  let fullpageEnabled = false;
  const ANIM_DURATION = 800; // ms

  // ---------- helpers ----------
  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function scrollToPanel(index) {
    if (index < 0 || index >= panels.length) return;
    panels[index].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToPanel(index) {
    if (index < 0 || index >= panels.length) return;
    if (index === currentIndex) return;
    if (isAnimating && fullpageEnabled) return;

    currentIndex = index;
    setActiveDot(currentIndex);

    if (fullpageEnabled) {
      isAnimating = true;
      scrollToPanel(currentIndex);
      setTimeout(() => {
        isAnimating = false;
      }, ANIM_DURATION);
    } else {
      scrollToPanel(currentIndex);
    }
  }

  // ---------- bullet clicks (always allowed) ----------
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToPanel(i);
    });
  });

  // ---------- intersection observer (keeps bullets in sync on normal scroll) ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const index = panels.indexOf(entry.target);
        if (index === -1) return;

        currentIndex = index;
        setActiveDot(currentIndex);
      });
    },
    {
      threshold: 0.55, // > 50% of panel in view
    }
  );

  panels.forEach((panel) => observer.observe(panel));

  // ---------- full-page scroll handlers (desktop only) ----------
  function onWheel(e) {
    if (!fullpageEnabled) return;
    e.preventDefault();
    if (isAnimating) return;

    if (e.deltaY > 0) {
      goToPanel(currentIndex + 1);
    } else if (e.deltaY < 0) {
      goToPanel(currentIndex - 1);
    }
  }

  function onTouchStart(e) {
    if (!fullpageEnabled) return;
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }

  function onTouchMove(e) {
    if (!fullpageEnabled) return;
    if (touchStartY !== null) {
      e.preventDefault(); // block native scroll only in fullpage mode
    }
  }

  function onTouchEnd(e) {
    if (!fullpageEnabled || touchStartY === null || isAnimating) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      goToPanel(currentIndex + 1);
    } else if (diff < -SWIPE_THRESHOLD) {
      goToPanel(currentIndex - 1);
    }

    touchStartY = null;
  }

  function enableFullpage() {
    if (fullpageEnabled) return;
    fullpageEnabled = true;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  function disableFullpage() {
    if (!fullpageEnabled) return;
    fullpageEnabled = false;

    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  }

  function evaluateFullpageMode() {
    const useFullpage = window.innerWidth >= 1400 && window.innerHeight >= 900;

    if (useFullpage) {
      enableFullpage();
    } else {
      disableFullpage();
      // in normal scroll mode, observer will drive currentIndex + bullets
    }
  }

  // initial state
  setActiveDot(currentIndex);
  evaluateFullpageMode();
  window.addEventListener("resize", evaluateFullpageMode);
});

// =======================
// COUNTER-UP ANIMATION
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const awardsSection = document.querySelector(".about-awards");
  if (!awardsSection) return;

  const counters = awardsSection.querySelectorAll(".about-award__value");
  if (!counters.length) return;

  // duration in ms (slower animation)
  const DURATION = 2500;

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    if (Number.isNaN(target)) return;

    const start = counter.dataset.start ? Number(counter.dataset.start) : 0;

    const originalText = counter.textContent.trim();
    const suffix = originalText.replace(/[0-9]/g, ""); // "+", "★", etc.

    let startTime = null;

    function easeOutQuad(t) {
      return t * (2 - t); // nice slow-down at the end
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1); // 0 → 1
      const eased = easeOutQuad(progress);

      const current = Math.round(start + (target - start) * eased);
      counter.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // snap exactly to final value
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // Trigger animation when awards section enters view
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((counter) => animateCounter(counter));
          observerInstance.unobserve(entry.target); // run only once
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(awardsSection);
});

// FOOTER

// Footer: brand + Home link scroll smoothly to top if already on index.html
document.addEventListener("DOMContentLoaded", () => {
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "";

  const toTopElements = document.querySelectorAll(
    ".footer-scroll-top, .footer-home-link"
  );

  if (!toTopElements.length) return;

  toTopElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // if not home, normal navigation to index.html is fine
    });
  });
});
