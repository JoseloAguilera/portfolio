const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const projectGrid = document.querySelector(".project-grid");
const prevProject = document.querySelector("[data-carousel-prev]");
const nextProject = document.querySelector("[data-carousel-next]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a") : null;

    if (link instanceof HTMLAnchorElement) {
      const href = link.getAttribute("href");
      const target = href && href.startsWith("#") ? document.querySelector(href) : null;

      if (target) {
        event.preventDefault();
      }

      closeMenu();

      if (target) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const headerHeight = menuToggle.offsetParent !== null ? 76 : 84;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
              top: targetTop,
              behavior: "auto",
            });

            history.pushState(null, "", href);
          });
        });
      }
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (projectGrid && prevProject && nextProject) {
  const getProjectStep = () => {
    const firstCard = projectGrid.querySelector(".project-card");
    if (!firstCard) {
      return projectGrid.clientWidth;
    }

    const gridStyles = window.getComputedStyle(projectGrid);
    const gap = parseFloat(gridStyles.columnGap || gridStyles.gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  prevProject.addEventListener("click", () => {
    projectGrid.scrollBy({ left: -getProjectStep(), behavior: "smooth" });
  });

  nextProject.addEventListener("click", () => {
    projectGrid.scrollBy({ left: getProjectStep(), behavior: "smooth" });
  });
}
