// MACK Technologies — navigation and small helpers
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.matchMedia('(max-width: 1100px)').matches) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var menus = document.querySelectorAll('.has-menu');
  menus.forEach(function (item) {
    var btn = item.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', function (e) {
    menus.forEach(function (item) {
      if (!item.contains(e.target)) {
        item.setAttribute('data-open', 'false');
        item.querySelector('button').setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (item) {
      if (item.getAttribute('data-open') === 'true') {
        item.setAttribute('data-open', 'false');
        var b = item.querySelector('button');
        b.setAttribute('aria-expanded', 'false');
        b.focus();
      }
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Hero technology spotlight: rotates every 7s, pauses on hover/focus, manual controls
(function () {
  var root = document.querySelector('[data-spotlight]');
  if (!root) return;
  var slides = root.querySelectorAll('.slide');
  var dots = root.querySelectorAll('.spot-dots button');
  var i = 0, timer = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
    dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
  }
  function start() { if (!reduce && !timer) timer = setInterval(function () { show(i + 1); }, 7000); }
  function stop() { clearInterval(timer); timer = null; }
  root.querySelector('[data-prev]').addEventListener('click', function () { stop(); show(i - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { stop(); show(i + 1); });
  dots.forEach(function (d, k) { d.addEventListener('click', function () { stop(); show(k); }); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  show(0); start();
})();

// Business size tabs (WAI-ARIA tabs pattern)
(function () {
  var list = document.querySelector('[role="tablist"]');
  if (!list) return;
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  function select(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(k + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(k - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); select(n); n.focus(); }
    });
  });
})();

// Enquiry type: adjust the message prompt and make it optional for callbacks
(function () {
  var radios = document.querySelectorAll('input[name="enquiry_type"]');
  var msg = document.getElementById('message');
  var req = document.getElementById('message-req');
  if (!radios.length || !msg) return;
  var prompts = {
    'Quick question': 'What would you like to know?',
    'Request a callback': 'Best time to call, and what it is about (optional)',
    'Get a quote': 'What you need, number of staff or sites, and any timing'
  };
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      msg.placeholder = prompts[r.value] || '';
      var optional = r.value === 'Request a callback';
      msg.required = !optional;
      if (req) req.textContent = optional ? '(optional)' : '(required)';
    });
  });
})();
