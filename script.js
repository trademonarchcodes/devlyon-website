(() => {\n  // Intro must never block the site: dismiss quickly and remember within this tab.\n  const intro = document.getElementById("devlyon-intro");\n  if (intro) {\n    const dismiss = () => { intro.classList.add("is-leaving"); window.setTimeout(()=>intro.remove(),550); try { sessionStorage.setItem("devlyon-intro-seen","1"); } catch(_) {} };\n    const skip = intro.querySelector(".intro-skip");\n    if (skip) skip.addEventListener("click",dismiss);\n    let seen=false; try { seen=sessionStorage.getItem("devlyon-intro-seen")==="1"; } catch(_) {}\n    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) dismiss();\n    else window.setTimeout(dismiss,1250);\n  }
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
    let slideIndex = 0, autoplay = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const goToCard = (index) => {
      const cards = visibleCards();
      if (!cards.length) return;
      slideIndex = (index + cards.length) % cards.length;
      const target = cards[slideIndex];
      const destination = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;\n      track.scrollTo({left: destination, behavior: reducedMotion ? "auto" : "smooth"});
      [...dots.children].forEach((dot, i) => dot.setAttribute("aria-current", String(i === slideIndex)));
    };
    const update = () => {
      const cards = visibleCards();
      if (!cards.length) return;
      const left = track.getBoundingClientRect().left;
      let closest = 0, distance = Infinity;
      cards.forEach((card, i) => { const d = Math.abs(card.getBoundingClientRect().left-left); if(d<distance){distance=d;closest=i;} });
      slideIndex = closest;
      [...dots.children].forEach((dot, i) => dot.setAttribute("aria-current", String(i === closest)));
    };
    const buildDots = () => {
      dots.replaceChildren();
      visibleCards().forEach((card, i) => {
        const dot = document.createElement("button");
        dot.type = "button"; dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Go to project " + (i + 1));
        dot.addEventListener("click", () => { goToCard(i); startAutoplay(); });
        dots.append(dot);
      });
      update();
    };
    const stopAutoplay = () => { if (autoplay) window.clearInterval(autoplay); autoplay = null; };
    const startAutoplay = () => {
      stopAutoplay();
      if (visibleCards().length < 2 || document.hidden) return;
      autoplay = window.setInterval(() => goToCard(slideIndex + 1), 3500);
    };
    prev.addEventListener("click", () => { goToCard(slideIndex - 1); startAutoplay(); });
    next.addEventListener("click", () => { goToCard(slideIndex + 1); startAutoplay(); });
    track.addEventListener("scroll", () => { window.clearTimeout(track._sliderSync); track._sliderSync = window.setTimeout(update, 100); }, {passive:true});
    document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { window.setTimeout(() => { slideIndex = 0; buildDots(); goToCard(0); startAutoplay(); }, 30); }));
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", event => { if(!slider.contains(event.relatedTarget)) startAutoplay(); });
    document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());
    window.addEventListener("resize", update, {passive:true});
    buildDots(); startAutoplay();
  });

  // Real website screenshots let visitors inspect each project before opening it.
  // The designed project artwork remains underneath as a fast fallback.
  document.querySelectorAll(".work-card[data-site-url]").forEach(card => {
    const thumb = card.querySelector(".live-site-thumb");
    if (!thumb) return;
    const title = card.querySelector(".work-meta h3")?.textContent || "DEVLYON project";
    const image = document.createElement("img");
    image.className = "live-site-screenshot";
    image.alt = title + " website preview";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = "https://image.thum.io/get/width/1200/crop/700/noanimate/" + card.dataset.siteUrl;
    image.addEventListener("error", () => image.classList.add("preview-image-failed"), {once:true});
    thumb.append(image);
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "Open live website: " + title);
    const openSite = () => window.open(card.dataset.siteUrl, "_blank", "noopener,noreferrer");
    card.addEventListener("click", event => { if(!event.target.closest("a,button")) openSite(); });
    card.addEventListener("keydown", event => {
      if(event.target !== card) return;
      if(event.key === "Enter" || event.key === " ") { event.preventDefault(); openSite(); }
    });
  });

  // DEVLYON services pricing, enquiry modal and training-specific fields.
  const currencyButtons = document.querySelectorAll("[data-currency]");
  const priceValues = document.querySelectorAll(".price-value[data-usd-amount]");
  const internationalPriceValues = document.querySelectorAll(".international-amount[data-price-ngn][data-price-usd]");
  const USD_TO_NGN_RATE = 1500;
  const formatPrice = (amount, currency) => currency === "NGN"
    ? "₦" + Math.round(amount).toLocaleString("en-NG")
    : "$" + Math.round(amount).toLocaleString("en-US");
  const renderPrices = currency => {
    internationalPriceValues.forEach(price => {
      price.textContent = currency === "NGN" ? price.dataset.priceNgn : price.dataset.priceUsd;
    });
    priceValues.forEach(price => {
      const amount = Number(price.dataset.usdAmount);
      const suffix = price.dataset.priceSuffix || "";
      const fixedNaira = price.dataset.ngnFixed ? Number(price.dataset.ngnFixed) : null;
      const display = currency === "NGN" && fixedNaira !== null
        ? formatPrice(fixedNaira, "NGN")
        : formatPrice(currency === "NGN" ? amount * USD_TO_NGN_RATE : amount, currency);
      price.textContent = display + suffix;
    });
  };
  currencyButtons.forEach(button => button.addEventListener("click", () => {
    const currency = button.dataset.currency;
    currencyButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderPrices(currency);
  }));
  renderPrices(document.querySelector("[data-currency].is-active")?.dataset.currency || "NGN");
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
    const destination = config.whatsappUrl || "https://wa.me/639552904890";
    window.open(destination + (destination.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
    if (enquiryDialog) enquiryDialog.close();
  });
  updateEnquiryFields();

  // Public DEVLYON reviews. The endpoint is configured after the Google Sheet web app is deployed.
  const reviewApi = config.reviewsApiUrl || "";
  const reviewList = document.getElementById("review-list");
  const reviewForm = document.getElementById("public-review-form");
  const reviewStatus = document.getElementById("review-status");
  const reviewSubmit = document.getElementById("review-submit");
  const ratingInput = document.getElementById("review-rating");
  const ratingPicker = document.getElementById("rating-picker");
  const ratingHint = document.getElementById("rating-hint");
  const ratingWords = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  const setRating = value => {
    if (!ratingInput || !ratingPicker) return;
    const rating = Math.max(0, Math.min(5, Number(value) || 0));
    ratingInput.value = rating ? String(rating) : "";
    ratingPicker.querySelectorAll(".rating-star").forEach(item => {
      const itemValue = Number(item.dataset.rating);
      item.classList.toggle("is-selected", rating > 0 && itemValue <= rating);
      item.setAttribute("aria-pressed", String(itemValue === rating));
      item.setAttribute("aria-label", itemValue + (itemValue === 1 ? " star" : " stars") + (itemValue === rating ? ", selected" : ""));
    });
    if (ratingHint) ratingHint.textContent = rating ? rating + " out of 5 — " + ratingWords[rating] : "Tap a star to rate your experience.";
  };
  if (ratingPicker && ratingInput) {
    ratingPicker.querySelectorAll(".rating-star").forEach(star => {
      star.addEventListener("click", () => setRating(star.dataset.rating));
    });
  }
  const renderReviews = reviews => {
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const count = safeReviews.length;
    const average = count ? safeReviews.reduce((sum,item)=>sum + Number(item.rating || 0),0) / count : 0;
    const reputationBadge = document.getElementById("shared-rating-badge");
    if (reputationBadge) { reputationBadge.querySelector(".shared-rating-stars").textContent = "★".repeat(Math.round(average)) + "☆".repeat(5-Math.round(average)); reputationBadge.querySelector(".shared-rating-score").textContent = count ? average.toFixed(1) + "/5" : "—"; reputationBadge.querySelector(".shared-rating-meta").textContent = count + " shared reviews"; }
    const countNode = document.getElementById("review-count");
    const averageNode = document.getElementById("review-average");
    const starsNode = document.getElementById("review-summary-stars");
    const inviteCount = document.getElementById("review-invite-count");
    const inviteAverage = document.getElementById("review-invite-average");
    const inviteStars = document.getElementById("review-invite-stars");
    if (countNode) countNode.textContent = String(count);
    if (averageNode) averageNode.textContent = count ? average.toFixed(1) + " / 5" : "—";
    if (starsNode) starsNode.textContent = "★".repeat(Math.round(average)) + "☆".repeat(5-Math.round(average));
    if (inviteCount) inviteCount.textContent = String(count);
    if (inviteAverage) inviteAverage.textContent = count ? average.toFixed(1) + " / 5" : "—";
    if (inviteStars) inviteStars.textContent = "★".repeat(Math.round(average)) + "☆".repeat(5-Math.round(average));
    if (!reviewList) return;
    reviewList.replaceChildren();
    if (!count) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = "No reviews yet. If you've worked with DEVLYON, be the first to share your experience.";
      reviewList.append(empty);
      return;
    }
    safeReviews.slice().reverse().forEach(item => {
      const card = document.createElement("article");
      card.className = "review-card";
      const top = document.createElement("div"); top.className = "review-card-top";
      const name = document.createElement("strong"); name.textContent = item.name || "Client";
      const stars = document.createElement("span"); stars.className = "review-card-stars"; stars.textContent = "★".repeat(Number(item.rating)) + "☆".repeat(5-Number(item.rating));
      const body = document.createElement("p"); body.textContent = item.review || "";
      const date = document.createElement("small"); date.textContent = item.date || "";
      top.append(name,stars); card.append(top,body,date); reviewList.append(card);
    });
  };
  const reviewCacheKey = "devlyon-public-reviews-v1";
  const starterReviews = [
    {date:"Nov 7, 2026",name:"Prince Adams",rating:5,review:"You're work is amazing, I love it."},
    {date:"Nov 7, 2026",name:"Prisca Oluebube",rating:5,review:"I had the best experience \\r\\nThe landing page they made me was amazing 😍"},
    {date:"Nov 7, 2026",name:"Musky",rating:5,review:"Your are the best"},
    {date:"Nov 8, 2026",name:"Pascal  Echelon",rating:5,review:"Too perfect and reliable"},
    {date:"Nov 8, 2026",name:"Kenneth lucky",rating:5,review:"They are very reliable and they deliver on time without any disappointment"},
    {date:"Nov 8, 2026",name:"Adeyemi",rating:5,review:"I really love this"}
  ];
  let reviewLoadTimer = null;
  let reviewLoadId = 0;
  const loadReviews = () => {
    if (!reviewApi || (!reviewList && !document.getElementById("review-invite-count"))) return;
    let cachedReviews = null;
    try {
      const saved = localStorage.getItem(reviewCacheKey);
      if (saved) cachedReviews = JSON.parse(saved);
    } catch (_) {}
    renderReviews(Array.isArray(cachedReviews) && cachedReviews.length ? cachedReviews : starterReviews);
    const callback = "devlyonReviewsLoaded";
    const requestId = ++reviewLoadId;
    window[callback] = data => {
      if (requestId !== reviewLoadId) return;
      if (reviewLoadTimer) window.clearTimeout(reviewLoadTimer);
      const freshReviews = data && Array.isArray(data.reviews) ? data.reviews : [];
      renderReviews(freshReviews);
      try { localStorage.setItem(reviewCacheKey, JSON.stringify(freshReviews)); } catch (_) {}
      if (reviewStatus) reviewStatus.textContent = "";
      delete window[callback];
    };
    const old = document.getElementById("devlyon-reviews-feed");
    if (old) old.remove();
    const feed = document.createElement("script");
    feed.id = "devlyon-reviews-feed";
    feed.async = true;
    feed.src = reviewApi + (reviewApi.includes("?") ? "&" : "?") + "action=list&callback=" + callback + "&_=" + Date.now();
    feed.onerror = () => {
      if (reviewLoadTimer) window.clearTimeout(reviewLoadTimer);
      if (reviewStatus) reviewStatus.textContent = "We couldn't load reviews right now. Please refresh and try again.";
      delete window[callback];
    };
    if (reviewLoadTimer) window.clearTimeout(reviewLoadTimer);
    reviewLoadTimer = window.setTimeout(() => {
      if (requestId !== reviewLoadId) return;
      if (reviewStatus) reviewStatus.textContent = "Reviews are taking longer than expected to load. Please refresh the page.";
      delete window[callback];
    }, 12000);
    document.head.append(feed);
  };
  if (reviewForm && reviewApi) {
    reviewSubmit.disabled = false;
    reviewStatus.textContent = "Reviews appear publicly as soon as they are submitted.";
    reviewForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!ratingInput || !ratingInput.value) { if (reviewStatus) reviewStatus.textContent = "Please choose a star rating before submitting."; if (ratingPicker) ratingPicker.querySelector(".rating-star")?.focus(); return; }
      if (!reviewForm.reportValidity()) return;
      const data = new FormData(reviewForm);
      if (String(data.get("website") || "").trim()) return;
      const frame = document.getElementById("review-submit-frame");
      const target = frame || (() => {
        const iframe = document.createElement("iframe");
        iframe.name = "review-submit-frame"; iframe.id = "review-submit-frame";
        iframe.hidden = true; document.body.append(iframe); return iframe;
      })();
      const post = document.createElement("form");
      post.method = "POST"; post.action = reviewApi; post.target = target.name;
      post.hidden = true;
      [["action","add"],["name",data.get("name")],["rating",data.get("rating")],["review",data.get("review")],["website",""]].forEach(([key,value])=>{
        const input = document.createElement("input"); input.type = "hidden"; input.name = key; input.value = String(value || ""); post.append(input);
      });
      document.body.append(post);
      reviewSubmit.disabled = true; reviewSubmit.textContent = "Submitting...";
      reviewStatus.textContent = "Sending your review...";
      const onReviewResult = event => {
        if (!event.data || event.data.type !== "devlyon-review-submitted") return;
        window.removeEventListener("message", onReviewResult);
        reviewStatus.textContent = event.data.ok ? "Thanks! Your review has been submitted and is now public." : "We couldn't submit that review. Please try again.";
        if (event.data.ok) { reviewForm.reset(); setRating(0); window.setTimeout(loadReviews, 900); }
        reviewSubmit.disabled = false; reviewSubmit.innerHTML = 'Submit review <b>↗</b>';
        post.remove();
      };
      window.addEventListener("message", onReviewResult);
      post.submit();
      window.setTimeout(()=>{if(reviewSubmit.disabled){reviewStatus.textContent="Submission may still be processing. Refresh the page shortly to check.";reviewSubmit.disabled=false;reviewSubmit.innerHTML='Submit review <b>↗</b>';post.remove();}},10000);
    });
  } else if (reviewForm) {
    reviewSubmit.disabled = true;
    reviewStatus.textContent = "Review submissions will be enabled after the review book is connected.";
  }
  loadReviews();

  // Shared DEVLYON + DEVPAGES reputation badge and visitor review prompt.
  const sharedReviewApi = config.reviewsApiUrl || "https://script.google.com/macros/s/AKfycbxDZFklxGHXDh-kNwVO10IeIMMLLLz99H_5K5dTsgVnuaO5Xd_OLJGX-w0Deryliy5nYA/exec";
  const reputationHeader = document.querySelector(".site-header");
  if (reputationHeader && !document.getElementById("shared-rating-badge")) {
    const ratingRow = document.createElement("div");
    ratingRow.className = "shared-rating-row";
    const badge = document.createElement("button");
    badge.type = "button"; badge.id = "shared-rating-badge"; badge.className = "shared-rating-badge";
    badge.innerHTML = '<span class="shared-rating-stars">★★★★★</span><span class="shared-rating-score">Loading…</span><span class="shared-rating-meta">Shared customer rating</span>';
    ratingRow.append(badge);
    reputationHeader.insertAdjacentElement("afterend", ratingRow);
    badge.addEventListener("click", () => document.getElementById("shared-review-dialog")?.showModal());
  }
  const reputationDialog = document.createElement("dialog");
  reputationDialog.id = "shared-review-dialog"; reputationDialog.className = "shared-review-dialog";
  reputationDialog.innerHTML = '<div class="shared-review-shell"><button type="button" class="shared-review-close" aria-label="Close">×</button><p class="eyebrow">DEVLYON × DEVPAGES / SHARED REVIEWS</p><h2>How was your experience?</h2><p class="shared-review-copy">Your review appears on both DEVLYON and DEVPAGES.</p><form id="shared-review-form"><label for="shared-review-name">Your name</label><input id="shared-review-name" name="name" maxlength="60" required placeholder="Your name"><label>Your rating</label><div class="shared-review-stars" role="group" aria-label="Choose a star rating"><button type="button" data-star="1">★</button><button type="button" data-star="2">★</button><button type="button" data-star="3">★</button><button type="button" data-star="4">★</button><button type="button" data-star="5">★</button></div><input type="hidden" id="shared-review-rating" required><label for="shared-review-text">Your review</label><textarea id="shared-review-text" name="review" rows="4" maxlength="800" required placeholder="Tell us about your experience..."></textarea><input name="website" class="shared-review-honeypot" tabindex="-1" autocomplete="off"><button class="button button-primary" id="shared-review-submit" type="submit">Submit review ↗</button><p id="shared-review-status" role="status">One review is shared across both websites.</p></form></div>';
  document.body.append(reputationDialog);
  reputationDialog.querySelector(".shared-review-close").addEventListener("click",()=>reputationDialog.close());
  reputationDialog.addEventListener("click",e=>{if(e.target===reputationDialog)reputationDialog.close();});
  let sharedRating=0;
  reputationDialog.querySelectorAll("[data-star]").forEach(btn=>btn.addEventListener("click",()=>{
    sharedRating=Number(btn.dataset.star);reputationDialog.querySelectorAll("[data-star]").forEach(s=>s.classList.toggle("selected",Number(s.dataset.star)<=sharedRating));
    document.getElementById("shared-review-rating").value=String(sharedRating);
  }));
  const refreshSharedRating=()=>{
    const cacheKey="devlyon-shared-rating-v1",badge=document.getElementById("shared-rating-badge");
    const paint=data=>{
      const reviews=Array.isArray(data?.reviews)?data.reviews:[];
      const count=reviews.length,avg=count?reviews.reduce((sum,r)=>sum+Number(r.rating||0),0)/count:0;
      if(badge){badge.querySelector(".shared-rating-stars").textContent="★".repeat(Math.round(avg))+"☆".repeat(5-Math.round(avg));badge.querySelector(".shared-rating-score").textContent=count?avg.toFixed(1)+"/5":"—";badge.querySelector(".shared-rating-meta").textContent=count?count+" shared reviews":"Be the first to review";}
    };
    try{const cached=JSON.parse(localStorage.getItem(cacheKey)||"null");if(cached?.savedAt&&Date.now()-cached.savedAt<15*60*1000)paint(cached.data);}catch(_){}
    const callback="devlyonSharedRatingLoaded";
    window[callback]=data=>{paint(data);try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),data}));}catch(_){}delete window[callback];};
    const script=document.createElement("script");script.async=true;script.src=sharedReviewApi+"?action=list&callback="+callback;script.onerror=()=>{const m=document.querySelector(".shared-rating-meta");if(m)m.textContent="Shared customer rating";};document.head.append(script);
  };
  refreshSharedRating();
  const sharedForm=document.getElementById("shared-review-form");
  sharedForm.addEventListener("submit",e=>{
    e.preventDefault();const status=document.getElementById("shared-review-status"),submit=document.getElementById("shared-review-submit");
    if(!sharedRating){status.textContent="Please choose a star rating.";return;}
    if(!sharedForm.reportValidity())return;
    const data=new FormData(sharedForm);if(String(data.get("website")||"").trim())return;
    const frame=document.createElement("iframe");frame.name="shared-review-post-frame";frame.hidden=true;document.body.append(frame);
    const post=document.createElement("form");post.method="POST";post.action=sharedReviewApi;post.target=frame.name;post.hidden=true;
    [["action","add"],["name",data.get("name")],["rating",sharedRating],["review",data.get("review")],["website",""]].forEach(([k,v])=>{const x=document.createElement("input");x.name=k;x.value=String(v||"");post.append(x);});
    document.body.append(post);submit.disabled=true;status.textContent="Submitting your review...";
    const done=event=>{
      if(event.data?.type!=="devlyon-review-submitted")return;
      window.removeEventListener("message",done);submit.disabled=false;
      status.textContent=event.data.ok?"Thank you! Your review is now shared on both websites.":"We couldn't submit your review. Please try again.";
      if(event.data.ok){sharedForm.reset();sharedRating=0;reputationDialog.close();refreshSharedRating();}
      post.remove();frame.remove();
    };
    window.addEventListener("message",done);post.submit();
    window.setTimeout(()=>{if(submit.disabled){submit.disabled=false;status.textContent="Submission may still be processing. Please check the reviews page shortly.";post.remove();frame.remove();}},12000);
  });
  try{
    const key="shared-review-prompt-dismissed-until";
    if(Number(localStorage.getItem(key)||0)<Date.now()){
      window.setTimeout(()=>{if(!reputationDialog.open){reputationDialog.showModal();localStorage.setItem(key,String(Date.now()+7*24*60*60*1000));}},18000);
    }
  }catch(_){}

})();