const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const projectGrid = document.querySelector(".project-grid");
const prevProject = document.querySelector("[data-carousel-prev]");
const nextProject = document.querySelector("[data-carousel-next]");
const contactForm = document.querySelector("#contact-form");

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

if (contactForm) {
  const statusMessage = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      nombre: String(formData.get("nombre") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      mensaje: String(formData.get("mensaje") || "").trim(),
    };

    if (statusMessage) {
      statusMessage.textContent = "Enviando mensaje...";
      statusMessage.classList.remove("is-error", "is-success");
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/joseaguilera1709@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: payload.nombre,
          email: payload.email,
          message: payload.mensaje,
          _subject: `Nuevo contacto desde joseaguilera.live - ${payload.nombre}`,
          _template: "table",
          _captcha: "false",
          _replyto: payload.email,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === "false") {
        throw new Error(data.message || data.error || "No se pudo enviar el mensaje.");
      }

      contactForm.reset();

      if (statusMessage) {
        statusMessage.textContent = "Mensaje enviado. Te voy a responder al correo indicado.";
        statusMessage.classList.add("is-success");
      }
    } catch (error) {
      if (statusMessage) {
        statusMessage.textContent = error.message || "No se pudo enviar. Probá por WhatsApp o email directo.";
        statusMessage.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar mensaje";
      }
    }
  });
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
