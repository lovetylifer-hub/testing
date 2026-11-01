/* DEJA BREW — script.js
   Mobile menu · page transitions · menu filters · gallery lightbox · contact form */
(function () {
  'use strict';

  // Put the café's email here to make the contact form open the visitor's mail app.
  var CONTACT_EMAIL = '';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* Page transitions: a pink veil with the teapot fades in before leaving */
  var veil = document.createElement('div');
  veil.className = 'veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = '<img src="assets/images/teapot.png" alt="">';
  document.body.appendChild(veil);
  document.body.classList.add('enter');
  window.addEventListener('pageshow', function () { veil.classList.remove('on'); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || reduce) return;
    var href = a.getAttribute('href');
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' ||
        /^(#|mailto:|tel:|https?:)/.test(href) || !/\.html(#.*)?$/.test(href)) return;
    e.preventDefault();
    veil.classList.add('on');
    setTimeout(function () { window.location.href = href; }, 360);
  });

  /* Menu category filters */
  var filters = document.querySelectorAll('.filters button');
  if (filters.length) {
    var cats = document.querySelectorAll('.menu-cat');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
        cats.forEach(function (c) { c.hidden = want !== 'all' && c.dataset.cat !== want; });
      });
    });
  }

  /* Gallery lightbox */
  var items = document.querySelectorAll('.scrap .polaroid');
  if (items.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged photo');
    box.innerHTML = '<button type="button">Close</button><figure class="polaroid"><div class="ph"><img alt=""></div><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var bImg = box.querySelector('img'), bCap = box.querySelector('figcaption'), bBtn = box.querySelector('button');
    var last = null;
    var close = function () { box.classList.remove('open'); if (last) last.focus(); };
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        last = it;
        var img = it.querySelector('img');
        bImg.src = img.src; bImg.alt = img.alt;
        bCap.textContent = it.querySelector('figcaption').textContent;
        box.classList.add('open'); bBtn.focus();
      });
    });
    bBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* Contact form */
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      var d = new FormData(form);
      if (CONTACT_EMAIL) {
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent('Hello from ' + d.get('name')) +
          '&body=' + encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')');
      }
      msg.textContent = 'Thank you, ' + d.get('name') + '! Your note is on its way.';
      form.reset();
    });
  }
})();
