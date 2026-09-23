// Horizon Salon & Spa — small, dependency-free site script
(function () {
  var WHATSAPP = '233594671366';
  document.documentElement.classList.remove('no-js');

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    document.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Lightbox
  var box = document.querySelector('.lightbox');
  if (box && typeof box.showModal === 'function') {
    var img = box.querySelector('img');
    var count = box.querySelector('.lb-count');
    var items = [], index = 0;
    var visible = function () {
      return Array.prototype.filter.call(document.querySelectorAll('[data-full]'), function (el) { return !el.hidden; });
    };
    var show = function (i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      img.src = el.dataset.full;
      img.alt = el.querySelector('img') ? el.querySelector('img').alt : '';
      count.textContent = (index + 1) + ' / ' + items.length;
    };
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-full]');
      if (!trigger) return;
      items = visible();
      show(items.indexOf(trigger));
      box.showModal();
    });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'FIGURE') box.close(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    box.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  // Gallery filters
  var filters = document.querySelectorAll('.filters button');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('.gallery [data-cat]').forEach(function (item) {
        item.hidden = f !== 'all' && item.dataset.cat !== f;
      });
    });
  });

  // Booking form -> WhatsApp message
  var form = document.getElementById('booking-form');
  if (form) {
    var date = form.querySelector('#date');
    if (date) date.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var when = v('date') ? new Date(v('date') + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
      var lines = [
        'Hello Horizon Salon & Spa, I would like to book an appointment.',
        '',
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        'Service: ' + v('service'),
        'Date: ' + when + (v('time') ? ' at ' + v('time') : '')
      ];
      if (v('notes')) lines.push('Notes: ' + v('notes'));
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
