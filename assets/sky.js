// Hero animation (twinkling stars, shooting stars, word-by-word headline)
// and fade-up of sections as they scroll into view.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Headline: split plain words into animated spans (the <em> animates as a whole)
  var title = document.querySelector(".hero-title");
  if (title && !reduceMotion) {
    var i = 0;
    Array.prototype.slice.call(title.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;               // only plain text nodes
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var span = document.createElement("span");
        span.className = "word";
        span.style.setProperty("--i", i++);
        span.textContent = part;
        frag.appendChild(span);
      });
      title.replaceChild(frag, node);
    });
  }

  var hero = document.querySelector(".hero");
  if (hero) window.setTimeout(function () { hero.classList.add("hero-done"); }, 3000);

  // --- Starfield
  var canvas = document.querySelector(".hero .stars");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [], shooting = null, w = 0, h = 0, running = false;

    var resize = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(260, Math.round((w * h) / 4500));
      stars = [];
      for (var n = 0; n < count; n++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.2 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          gold: Math.random() < 0.18,
        });
      }
      if (!running) draw(0);
    };

    var draw = function (t) {
      ctx.clearRect(0, 0, w, h);
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        var a = reduceMotion ? 0.8 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.phase + (t / 1000) * s.speed));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.gold ? "#f5c542" : "#ffffff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion) {
        if (!shooting && Math.random() < 0.006) {
          shooting = { x: w * (0.35 + Math.random() * 0.65), y: Math.random() * h * 0.45,
                       vx: -(7 + Math.random() * 5), vy: 2.5 + Math.random() * 2.5, life: 1 };
        }
        if (shooting) {
          var tail = 14;
          var g = ctx.createLinearGradient(shooting.x, shooting.y,
                                           shooting.x - shooting.vx * tail, shooting.y - shooting.vy * tail);
          g.addColorStop(0, "rgba(255, 244, 204," + shooting.life + ")");
          g.addColorStop(1, "rgba(255, 244, 204, 0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(shooting.x, shooting.y);
          ctx.lineTo(shooting.x - shooting.vx * tail, shooting.y - shooting.vy * tail);
          ctx.stroke();
          shooting.x += shooting.vx; shooting.y += shooting.vy; shooting.life -= 0.018;
          if (shooting.life <= 0 || shooting.x < -50 || shooting.y > h + 50) shooting = null;
        }
      }
    };

    var loop = function (t) {
      if (!running) return;
      draw(t);
      window.requestAnimationFrame(loop);
    };
    var start = function () { if (!running && !reduceMotion) { running = true; window.requestAnimationFrame(loop); } };
    var stop = function () { running = false; };

    resize();
    window.addEventListener("resize", resize);
    // Only animate while the hero is on screen (saves battery on phones).
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(canvas);
    } else {
      start();
    }
  }

  // --- Fade-up sections as they scroll into view
  if (!reduceMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      "section:not(.hero) h2, section:not(.hero) .lead, .photo, .post, .steps li, .week, " +
      ".note-card, .price-card, .pay-card, .faq details"
    );
    document.documentElement.classList.add("js-anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(targets, function (el) {
      // Stagger siblings slightly so groups ripple in.
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = (idx % 4) * 90 + "ms";
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
