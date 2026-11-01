(function () {
  'use strict';

  /* ---- Countdown ---- */
  var EVENT_DATE = new Date('2026-11-29T13:00:00+05:00').getTime();
  var els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
  };
  var countdownEl = document.getElementById('countdown');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    var diff = EVENT_DATE - Date.now();

    if (diff <= 0) {
      if (countdownEl) {
        countdownEl.innerHTML = '<p class="countdown-today">Today is the day! &#127881;</p>';
      }
      clearInterval(timer);
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);
  }

  var timer = setInterval(tickCountdown, 1000);
  tickCountdown();

  /* ---- Scroll-reveal ---- */
  function startReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      revealEls.forEach(function (el) {
        // reveal what is already on screen right away; watch the rest
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---- Intro: open the gatefold card, then reveal the invitation ---- */
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var openBtn = document.getElementById('introOpen');
  var AUTO_OPEN_MS = 5200;

  if (!intro || !root.classList.contains('intro-on')) {
    startReveal();
    return;
  }

  var opened = false;
  var main = document.querySelector('main');
  var SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'];

  // Until the card is opened, only the landing card exists: always start at the
  // top (ignore #details / #venue links and restored scroll positions), and keep
  // the invitation behind it out of reach of scrolling and keyboard focus.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  if (main) main.setAttribute('inert', '');

  function blockScroll(e) {
    if (!opened) e.preventDefault();
  }
  window.addEventListener('wheel', blockScroll, { passive: false });
  window.addEventListener('touchmove', blockScroll, { passive: false });

  function openCard() {
    if (opened) return;
    opened = true;
    clearTimeout(autoOpen);
    intro.classList.add('is-opening');

    // let the invitation fade in while the doors are swinging open
    setTimeout(startReveal, 700);
    setTimeout(function () {
      root.classList.remove('intro-on');
      intro.setAttribute('hidden', '');
      if (main) main.removeAttribute('inert');
      window.scrollTo(0, 0);
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
    }, 1700);
  }

  var autoOpen = setTimeout(openCard, AUTO_OPEN_MS);
  intro.addEventListener('click', openCard);
  if (openBtn) openBtn.addEventListener('click', openCard);
  document.addEventListener('keydown', function (e) {
    if (opened) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      openCard();
    } else if (SCROLL_KEYS.indexOf(e.key) !== -1 && e.target !== openBtn) {
      e.preventDefault();
    }
  });
})();
