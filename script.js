/* ============================================================
   BadAAAS AI Systems — site interactions
   Vanilla JS. No dependencies, no network calls, no tracking.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Sticky header state + scroll progress ---------- */
  var header = document.getElementById('header');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);

    if (progressBar) {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - window.innerHeight) || 1;
      var pct = Math.min(100, Math.max(0, (y / max) * 100));
      progressBar.style.width = pct + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!burger || !mobileMenu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      mobileMenu.hidden = false;
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setMenu(false);
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  // Stagger siblings inside animated groups so lists cascade.
  ['.steps', '.doors', '.modules__list', '.results__grid', '.process__steps', '.timeline__list', '.addons__grid', '.services__grid'].forEach(function (sel) {
    var group = document.querySelector(sel);
    if (!group) return;
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      if (child.hasAttribute('data-reveal')) child.style.setProperty('--i', String(i));
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 4. Animated metrics ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1100;
    var start = null;

    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- 5. Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- 6. FAQ: one open at a time ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.qa'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ---------- 7. Request-a-call form (client-side only) ---------- */
  var form = document.getElementById('requestForm');
  var done = document.getElementById('formDone');
  var editBtn = document.getElementById('editRequest');
  var BOOKING_URL = 'https://www.badaaas.com/book/';

  function fieldWrap(input) {
    return input.closest('.field');
  }

  function setError(input, hasError) {
    var wrap = fieldWrap(input);
    if (wrap) wrap.classList.toggle('field--error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
  }

  function validate(input) {
    var value = (input.value || '').trim();
    var ok;
    if (input.type === 'email') ok = isEmail(value);
    else ok = value.length > 1;
    setError(input, !ok);
    return ok;
  }

  if (form && done) {
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select'));

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldWrap(input) && fieldWrap(input).classList.contains('field--error')) validate(input);
      });
      input.addEventListener('change', function () { validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = null;
      inputs.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }

      // No backend: summarise locally, then hand off to the real booking calendar.
      var values = {};
      inputs.forEach(function (input) { values[input.name] = (input.value || '').trim(); });

      Array.prototype.slice.call(done.querySelectorAll('[data-summary]')).forEach(function (node) {
        var key = node.getAttribute('data-summary');
        node.textContent = values[key] || '—';
      });

      var bookingLink = document.getElementById('bookingLink');
      if (bookingLink) bookingLink.setAttribute('href', BOOKING_URL);

      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    if (editBtn) {
      editBtn.addEventListener('click', function () {
        done.hidden = true;
        form.hidden = false;
        var nameField = document.getElementById('fName');
        if (nameField) nameField.focus();
      });
    }
  }

  /* ---------- 8. Current year (footer already states 2026) ---------- */
  // Kept static in markup: © 2026 BadAAAS AI Systems operating.
})();
