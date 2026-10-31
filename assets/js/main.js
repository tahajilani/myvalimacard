(function () {
  'use strict';

  /* ---- Countdown ---- */
  var EVENT_DATE = new Date('2026-11-29T15:00:00+05:00').getTime();
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

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Active nav link on scroll ---- */
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (sec) { navObserver.observe(sec); });
  }
})();
