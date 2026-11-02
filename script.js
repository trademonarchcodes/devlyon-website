(() => {
  const config = window.DEVLYON_CONFIG || {};
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }));
  }
  const filters = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".work-card");
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(item => item.classList.toggle("active", item === button));
    const selected = button.dataset.filter;
    cards.forEach(card => { card.hidden = selected !== "all" && card.dataset.category !== selected; });
  }));
  document.querySelectorAll("[data-contact]").forEach(link => {
    if (link.dataset.contact === "whatsapp" && config.whatsappUrl) link.href = config.whatsappUrl;
    if (link.dataset.contact === "telegram" && config.telegramUrl) link.href = config.telegramUrl;
  });
  document.querySelectorAll("[data-brand-link]").forEach(link => {
    if (config.brandUrl) link.href = config.brandUrl;
    if (config.brandName) link.textContent = config.brandName;
  });
  const credit = document.querySelector(".creator-credit");
  if (credit && config.showCreatorCredit === false) credit.hidden = true;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const reveal = document.querySelectorAll(".service-card,.work-card,.about-copy,.value-list article,.process-track article,.faq-list details");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), {threshold: .12});
    reveal.forEach(item => { item.classList.add("reveal"); observer.observe(item); });
  } else reveal.forEach(item => item.classList.add("is-visible"));
})();