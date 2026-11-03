(() => {
  const config = window.DEVLYON_CONFIG || {};
  const conceptDirections={
          fitness:[["01","PERFORMANCE","High-contrast athletic campaign","#d8ff37","#10150d","SPEED / POWER / FOCUS"],["02","STUDIO CLUB","Premium boutique training","#f2b7a0","#201714","A BETTER KIND OF STRONG"],["03","ATHLETE LAB","Data-led performance platform","#59c8ff","#081522","MEASURE. MOVE. IMPROVE."],["04","RAW ENERGY","Underground training culture","#ff684d","#1b0d0b","NO SHORTCUTS. JUST WORK."],["05","BALANCE","Wellness-led movement studio","#d8c7ff","#171323","MOVE WELL. FEEL MORE."]],
          business:[["01","EDITORIAL","Confident corporate storytelling","#c7d7b9","#17231f","A CLEARER WAY FORWARD"],["02","MONOLITH","Minimal premium consultancy","#d6c4a4","#191713","BUILT ON GOOD THINKING"],["03","SIGNAL","Modern tech-forward platform","#62d9ff","#071923","MAKE COMPLEXITY SIMPLE"],["04","FOUNDATION","Structured enterprise system","#f0bb66","#21190d","STRATEGY INTO ACTION"],["05","HORIZON","Human-centred business studio","#a9c8ff","#101827","PEOPLE. PURPOSE. PROGRESS."]],
          creative:[["01","PLAYGROUND","Expressive art direction","#ffdf6e","#24162b","MAKE ROOM FOR IDEAS"],["02","GALLERY","Quiet editorial portfolio","#e8d8c4","#201c19","A STUDY IN FORM"],["03","FUTURE FOLK","Experimental digital studio","#b7ffdc","#10231d","CREATE WHAT'S NEXT"],["04","TYPE CLUB","Typography-led identity","#ff83ad","#260f1b","WORDS WITH ATTITUDE"],["05","OBJECTS","Sculptural visual showcase","#b6a7ff","#17132a","FORM MEETS FEELING"]],
          hospitality:[["01","CHEF'S TABLE","Intimate fine dining","#d8b77d","#241a13","AN EVENING TO REMEMBER"],["02","MARKET FRESH","Bright seasonal restaurant","#d4e5b1","#182016","FRESH FROM THE SOURCE"],["03","AFTER HOURS","Modern cocktail and dining","#d99aff","#211426","STAY FOR ONE MORE"],["04","COUNTRY HOUSE","Rustic destination dining","#e4c7a2","#282016","GATHER AROUND THE TABLE"],["05","CITY SOCIAL","Contemporary neighbourhood spot","#ff987b","#271512","GOOD TASTE. GOOD COMPANY."]],
          commerce:[["01","OBJECT STUDY","Minimal product catalogue","#d9d4c8","#1c1b18","LESS, BUT BETTER"],["02","COLOR THEORY","Playful lifestyle storefront","#ffb5d0","#281521","EVERYDAY, REIMAGINED"],["03","FORM & FUNCTION","Premium design objects","#b8c8a9","#172019","MADE TO BE KEPT"],["04","DROP CULTURE","Bold limited-edition shop","#b8a5ff","#17132b","THE NEXT GOOD THING"],["05","SLOW GOODS","Warm conscious commerce","#e9c28f","#241b13","BUY FEWER. LOVE LONGER."]],
          property:[["01","THE RESIDENCE","Luxury property editorial","#d7c3a2","#211b16","A PLACE ABOVE ORDINARY"],["02","URBAN LIVING","Modern city developments","#9fc8d7","#101d24","LIVE CLOSER TO EVERYTHING"],["03","LANDMARK","Architectural property showcase","#d5d9c9","#1b211d","SPACE WITH A POINT OF VIEW"],["04","OPEN HOUSE","Welcoming family homes","#e9bd9d","#261a14","FIND YOUR NEXT CHAPTER"],["05","INVEST","Data-led property platform","#9ed8b5","#102019","SEE THE BIGGER PICTURE"]],
          wellness:[["01","CLINICAL","Calm modern healthcare","#9edbd0","#10201f","CARE, MADE CLEAR"],["02","WHOLE YOU","Warm holistic wellbeing","#e7c3a9","#251a16","FEEL SEEN. FEEL BETTER."],["03","NEXTCARE","Digital-first health platform","#8fc6ff","#0d1928","YOUR HEALTH, IN REACH"],["04","FAMILY FIRST","Friendly community clinic","#e6d9a0","#222016","HERE FOR EVERY GENERATION"],["05","SPECIALIST","Premium specialist practice","#c8b8ff","#1b1628","EXPERTISE WITH EMPATHY"]]
        }

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


  
  // Public on-page design direction library: five routes for each of the seven concepts.
  const library = document.querySelector(".direction-library");
  if (library) {
    const tabs = [...library.querySelectorAll(".direction-tab")];
    const grid = library.querySelector(".direction-library-grid");
    const names = {fitness:"ELEVATE",business:"NORTHSTAR",creative:"UNFOLD",hospitality:"MAISON TABLE",commerce:"FORME",property:"FORMA ESTATES",wellness:"KINWELL"};
    const renderLibrary = key => {
      const items = conceptDirections[key] || conceptDirections.business;
      grid.replaceChildren();
      tabs.forEach(tab => {
        const active = tab.dataset.directionCategory === key;
        tab.classList.toggle("is-active",active);
        tab.setAttribute("aria-pressed",String(active));
      });
      items.forEach(([number,name,desc,accent,bg,phrase],i) => {
        const card = document.createElement("article");
        card.className = "library-direction-card direction-art-"+(i+1);
        card.style.setProperty("--direction-accent",accent);
        card.style.setProperty("--direction-bg",bg);
        card.innerHTML = '<div class="library-art"><span class="library-art-index">'+number+'</span><span class="library-art-mark">'+(i===0?'✳':i===1?'◒':i===2?'＋':i===3?'↗':'✦')+'</span><div class="library-art-lines"><i></i><i></i><i></i></div><b>'+name+'</b><small>'+phrase+'</small></div><div class="library-card-copy"><div><span>'+names[key]+' / DIRECTION '+number+'</span><h3>'+name+'</h3></div><p>'+desc+'</p></div>';
        grid.append(card);
      });
      library.querySelector(".direction-library-foot span").textContent = "05 / 35";
    };
    tabs.forEach(tab=>tab.addEventListener("click",()=>renderLibrary(tab.dataset.directionCategory)));
    renderLibrary("fitness");
  }

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
    previewDialog.innerHTML = '<div class="work-preview-shell"><div class="work-preview-top"><span class="work-preview-label">DEVLYON / CONCEPT PREVIEW</span><button class="work-preview-close" type="button" aria-label="Close preview">×</button></div><div class="work-preview-stage"></div><section class="concept-directions" aria-label="More design directions"><div class="directions-heading"><div><span>EXPLORE THE SYSTEM</span><h4>More ways to <em>make it yours.</em></h4></div><p>Five additional design directions for this concept.</p></div><div class="direction-grid"></div></section><div class="work-preview-copy"><div><h3></h3><p></p></div><a class="button button-primary" href="contact.html#contact">Build something like this <b>↗</b></a></div></div>';
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
        const directionGrid=previewDialog.querySelector(".direction-grid");
        directionGrid.replaceChildren();
        const conceptKey=card.dataset.category||"business";
;
        (directions[conceptKey]||directions.business).forEach(([number,name,desc,accent,bg,phrase],i)=>{
          const item=document.createElement("button");
          item.type="button";item.className="direction-card";
          item.style.setProperty("--direction-accent",accent);item.style.setProperty("--direction-bg",bg);
          item.innerHTML='<span class="direction-top"><b>'+number+'</b><i>↗</i></span><span class="direction-art direction-art-'+(i+1)+'"><i></i><i></i><i></i><b>'+name+'</b></span><span class="direction-info"><strong>'+name+'</strong><small>'+desc+'</small><em>'+phrase+'</em></span>';
          item.addEventListener("click",()=>{directionGrid.querySelectorAll(".direction-card").forEach(el=>el.classList.remove("is-selected"));item.classList.add("is-selected");});
          directionGrid.append(item);
        });
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