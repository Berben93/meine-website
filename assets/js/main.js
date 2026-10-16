// Berben Engineering – Website-Skripte (ohne externe Abhängigkeiten)
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Aktuelles Jahr im Footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Hell/Dunkel-Umschalter (Standard: Einstellung des Geräts)
  var root = document.documentElement;
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var stored = function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } };
  var applyTheme = function (dark) {
    root.classList.toggle('dark', dark);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
    }
  };
  applyTheme(root.classList.contains('dark'));
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = !root.classList.contains('dark');
      applyTheme(dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* privater Modus */ }
    });
  }
  media.addEventListener('change', function (e) {
    if (!stored()) applyTheme(e.matches);
  });

  // Header: Schatten beim Scrollen
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('shadow-md', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobiles Menü
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.classList.toggle('hidden', !open);
      toggle.querySelector('[data-icon-open]').classList.toggle('hidden', open);
      toggle.querySelector('[data-icon-close]').classList.toggle('hidden', !open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  // Einblenden beim Scrollen
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Referenzen nach Branche filtern
  var filterButtons = document.querySelectorAll('[data-filter]');
  if (filterButtons.length) {
    var items = document.querySelectorAll('[data-branche]');
    var status = document.querySelector('[data-filter-status]');
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter');
        var shown = 0;
        filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        items.forEach(function (item) {
          var match = value === 'alle' || item.getAttribute('data-branche') === value;
          item.hidden = !match;
          if (match) shown++;
        });
        if (status) status.textContent = shown + (shown === 1 ? ' Projekt' : ' Projekte') + ' angezeigt';
      });
    });
  }

  // Kontaktformular per Fetch absenden (ohne JavaScript: normaler Formularversand)
  var form = document.querySelector('[data-contact-form]');
  if (form && window.fetch) {
    var result = form.querySelector('[data-form-result]');
    var submit = form.querySelector('button[type="submit"]');
    var show = function (ok, text) {
      result.hidden = false;
      result.className = 'rounded-lg p-4 text-sm ' + (ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200');
      result.textContent = text;
      result.focus();
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      submit.textContent = 'Wird gesendet …';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        show(true, 'Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns innerhalb eines Werktags.');
      }).catch(function () {
        show(false, 'Leider ist beim Senden ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@berben-engineering.de.');
      }).finally(function () {
        submit.disabled = false;
        submit.textContent = 'Anfrage senden';
      });
    });
  }
})();
