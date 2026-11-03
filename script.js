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

    // Automatic slideshow on desktop, tablet and mobile.
    // Hovering with a mouse does not stop the movement.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoplay = null;
    let slideIndex = 0;
    const goToCard = (index, behavior = "smooth") => {
      const items = visibleCards();
      if (!items.length) return;
      slideIndex = (index + items.length) % items.length;
      const target = items[slideIndex];
      const left = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      track.scrollTo({left, behavior: reducedMotion ? "auto" : behavior});
      [...dots.children].forEach((dot,i)=>dot.setAttribute("aria-current",String(i===slideIndex)));
    };
    const syncIndex = () => {
      const items = visibleCards();
      if (!items.length) return;
      const left = track.getBoundingClientRect().left;
      let best = 0, distance = Infinity;
      items.forEach((card,index) => {
        const d = Math.abs(card.getBoundingClientRect().left-left);
        if (d < distance) {distance=d;best=index;}
      });
      slideIndex = best;
      [...dots.children].forEach((dot,i)=>dot.setAttribute("aria-current",String(i===slideIndex)));
    };
    const stopAutoplay = () => { if (autoplay) window.clearInterval(autoplay); autoplay = null; };
    const startAutoplay = () => {
      stopAutoplay();
      if (reducedMotion || visibleCards().length < 2) return;
      autoplay = window.setInterval(() => goToCard(slideIndex+1), 3000);
    };
    prev.addEventListener("click",()=>{goToCard(slideIndex-1);startAutoplay();});
    next.addEventListener("click",()=>{goToCard(slideIndex+1);startAutoplay();});
    dots.addEventListener("click",event=>{
      const dot=event.target.closest(".slider-dot");
      if(dot){const index=[...dots.children].indexOf(dot);goToCard(index);startAutoplay();}
    });
    track.addEventListener("scroll",()=>{window.clearTimeout(track._sliderSync);track._sliderSync=window.setTimeout(syncIndex,100)},{passive:true});
    slider.addEventListener("focusin",stopAutoplay);
    slider.addEventListener("focusout",event=>{
      if(!slider.contains(event.relatedTarget)) startAutoplay();
    });
    document.addEventListener("visibilitychange",()=>{if(document.hidden)stopAutoplay();else startAutoplay();});
    startAutoplay();
  });


  // Click any portfolio concept to open a large, accessible preview.
  document.querySelectorAll(".work-card").forEach(card => {
    card.tabIndex = 0;
    card.setAttribute("role","button");
    const title = card.querySelector(".work-meta h3")?.textContent?.trim() || "Website concept";
    card.setAttribute("aria-label","Open preview: " + title);
  });
  if (document.querySelector(".work-card")) {
    const previewDialog = document.createElement("dialog");
    previewDialog.className = "work-preview-dialog";
    previewDialog.innerHTML = '<div class="work-preview-shell"><div class="work-preview-top"><span class="work-preview-label">DEVLYON / CONCEPT PREVIEW</span><button class="work-preview-close" type="button" aria-label="Close preview">×</button></div><div class="work-preview-stage"></div><div class="work-preview-copy"><div><h3></h3><p></p></div><a class="button button-primary" href="contact.html#contact">Build something like this <b>↗</b></a></div></div>';
    document.body.append(previewDialog);
    const closePreview = () => previewDialog.close();
    previewDialog.querySelector(".work-preview-close").addEventListener("click",closePreview);
    previewDialog.addEventListener("click",event=>{if(event.target===previewDialog)closePreview();});
    document.querySelectorAll(".work-card").forEach(card=>{
      const openPreview=()=>{
        const visual=card.querySelector(".work-visual");
        const stage=previewDialog.querySelector(".work-preview-stage");
        stage.replaceChildren();
        if(visual) stage.append(visual.cloneNode(true));
        previewDialog.querySelector(".work-preview-copy h3").textContent=card.querySelector(".work-meta h3")?.textContent||"Website concept";
        previewDialog.querySelector(".work-preview-copy p").textContent=card.querySelector(".work-meta p")?.textContent||"";
        if(typeof previewDialog.showModal==="function")previewDialog.showModal();
      };
      card.addEventListener("click",event=>{
        if(event.target.closest("button,a"))return;
        openPreview();
      });
      card.addEventListener("keydown",event=>{
        if(event.target!==card)return;
        if(event.key==="Enter"||event.key===" "){event.preventDefault();openPreview();}
      });
    });
  }

  // DEVLYON services pricing, enquiry modal and training-specific fields.
  const currencyButtons = document.querySelectorAll("[data-currency]");
  const priceValues = document.querySelectorAll(".price-value[data-ngn]");
  currencyButtons.forEach(button => button.addEventListener("click", () => {
    const currency = button.dataset.currency;
    currencyButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    priceValues.forEach(price => { price.textContent = price.dataset[currency.toLowerCase()]; });
  }));
  const enquiryDialog = document.getElementById("service-enquiry");
  const enquiryForm = document.getElementById("service-enquiry-form");
  const serviceSelect = document.getElementById("enquiry-service");
  const standardFields = document.getElementById("standard-project-fields");
  const trainingFields = document.getElementById("training-project-fields");
  const projectDescription = document.getElementById("enquiry-description");
  const trainingPhone = document.getElementById("enquiry-phone");
  const trainingLevel = document.getElementById("enquiry-level");
  const trainingGoals = document.getElementById("enquiry-goals");
  const isTrainingEnquiry = () => serviceSelect && serviceSelect.value === "Web Development Training";
  const updateEnquiryFields = () => {
    if (!serviceSelect || !standardFields || !trainingFields) return;
    const training = isTrainingEnquiry();
    standardFields.hidden = training;
    trainingFields.hidden = !training;
    if (projectDescription) projectDescription.required = !training;
    if (trainingPhone) trainingPhone.required = training;
    if (trainingLevel) trainingLevel.required = training;
    if (trainingGoals) trainingGoals.required = training;
  };
  document.querySelectorAll("[data-enquire]").forEach(button => button.addEventListener("click", () => {
    if (!enquiryDialog || !serviceSelect) return;
    serviceSelect.value = button.dataset.enquire;
    updateEnquiryFields();
    if (typeof enquiryDialog.showModal === "function") enquiryDialog.showModal();
    else window.location.href = "contact.html#contact";
  }));
  if (serviceSelect) serviceSelect.addEventListener("change", updateEnquiryFields);
  const closeEnquiry = document.querySelector(".enquiry-close");
  if (closeEnquiry && enquiryDialog) closeEnquiry.addEventListener("click", () => enquiryDialog.close());
  if (enquiryDialog) enquiryDialog.addEventListener("click", event => {
    if (event.target === enquiryDialog) enquiryDialog.close();
  });
  if (enquiryForm) enquiryForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const data = new FormData(enquiryForm);
    const training = isTrainingEnquiry();
    const lines = [
      "Hello DEVLYON, I'd like to make an enquiry.",
      "",
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Service: " + data.get("service")
    ];
    if (training) {
      lines.push("WhatsApp: " + data.get("phone"));
      lines.push("Experience level: " + data.get("level"));
      lines.push("Learning goals: " + data.get("goals"));
    } else {
      lines.push("Project description: " + data.get("description"));
    }
    const destination = config.whatsappUrl || "https://wa.me/2349135424851";
    window.open(destination + (destination.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
    if (enquiryDialog) enquiryDialog.close();
  });
  updateEnquiryFields();
  
})();