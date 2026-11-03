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
  if ("IntersectionObserver" in window && !window.matchMedia("(max-width: 700px), (pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), {threshold: .12});
    reveal.forEach(item => { item.classList.add("reveal"); observer.observe(item); });
  } else reveal.forEach(item => item.classList.add("is-visible"));


  // Accessible project carousel controls; cards remain filterable.
  document.querySelectorAll(".work-slider").forEach(slider => {
    const track = slider.querySelector(".work-grid");
    const prev = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");
    const dots = slider.querySelector(".slider-dots");
    if (!track || !prev || !next || !dots) return;
    const visibleCards = () => [...track.querySelectorAll(".work-card:not([hidden])")];
    const buildDots = () => {
      dots.replaceChildren();
      visibleCards().forEach((card, index) => {
        const dot = document.createElement("button");
        dot.type = "button"; dot.className = "slider-dot";
        dot.setAttribute("aria-label", `Go to project ${index + 1}`);
        dot.addEventListener("click", () => card.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"nearest",inline:"start"}));
        dots.append(dot);
      });
      update();
    };
    const update = () => {
      const cardsNow = visibleCards();
      if (!cardsNow.length) return;
      const current = Math.max(0,cardsNow.findIndex(card => Math.abs(card.getBoundingClientRect().left-track.getBoundingClientRect().left)<Math.max(30,card.getBoundingClientRect().width*.35)));
      [...dots.children].forEach((dot,i)=>dot.setAttribute("aria-current",String(i===current)));
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener("click",()=>track.scrollBy({left:-track.clientWidth*.85,behavior:"smooth"}));
    next.addEventListener("click",()=>track.scrollBy({left:track.clientWidth*.85,behavior:"smooth"}));
    track.addEventListener("scroll",()=>{window.clearTimeout(track._sliderTimer);track._sliderTimer=window.setTimeout(update,70)},{passive:true});
    buildDots();
    slider.addEventListener("click",event=>{if(event.target.closest(".filter-button"))window.setTimeout(buildDots,0)});
    window.addEventListener("resize",update,{passive:true});
  });

})();