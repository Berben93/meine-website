// Berben Engineering – Website-Skripte (ohne externe Abhängigkeiten)
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // Texte je nach Seitensprache
  var EN = root.lang === 'en';
  var TXT = EN ? {
    darkOn: 'Enable dark mode', lightOn: 'Enable light mode', menuOpen: 'Open menu', menuClose: 'Close menu',
    project: 'project', projects: 'projects', showing: 'Showing ',
    sending: 'Sending …', ok: 'Thank you! Your message has been received. We will get back to you within one working day.',
    fail: 'Sorry, something went wrong. Please try again or email us directly at info@berben-engineering.de.',
    service: 'Service', material: 'Material', quantity: 'Quantity', date: 'Desired date', size: 'Dimensions', extras: 'Requirements'
  } : {
    darkOn: 'Dunkles Design aktivieren', lightOn: 'Helles Design aktivieren', menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    project: 'Projekt', projects: 'Projekte', showing: '',
    sending: 'Wird gesendet …', ok: 'Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns innerhalb eines Werktags.',
    fail: 'Leider ist beim Senden ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@berben-engineering.de.',
    service: 'Leistung', material: 'Werkstoff', quantity: 'Stückzahl', date: 'Wunschtermin', size: 'Abmessungen', extras: 'Anforderungen'
  };

  // Aktuelles Jahr im Footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Hell/Dunkel-Umschalter (Standard: Einstellung des Geräts)
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var stored = function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } };
  var applyTheme = function (dark) {
    root.classList.toggle('dark', dark);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? TXT.lightOn : TXT.darkOn);
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
      toggle.setAttribute('aria-label', open ? TXT.menuClose : TXT.menuOpen);
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
    window.matchMedia('(min-width: 1280px)').addEventListener('change', function (e) {
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
        if (status) status.textContent = TXT.showing + shown + ' ' + (shown === 1 ? TXT.project : TXT.projects) + (EN ? '' : ' angezeigt');
      });
    });
  }

  // Anfrage-Assistent: Schritt für Schritt (ohne JavaScript sind alle Schritte sichtbar)
  var wizard = document.querySelector('[data-wizard]');
  if (wizard) {
    var steps = wizard.querySelectorAll('[data-step]');
    var indicators = document.querySelectorAll('[data-step-indicator]');
    var prev = wizard.querySelector('[data-prev]');
    var next = wizard.querySelector('[data-next]');
    var send = wizard.querySelector('[data-submit]');
    var current = 0;
    var go = function (i, focus) {
      current = i;
      steps.forEach(function (s, n) { s.hidden = n !== i; });
      indicators.forEach(function (el, n) {
        if (n === i) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
        el.classList.toggle('text-emerald-600', n < i);
      });
      prev.classList.toggle('hidden', i === 0);
      next.classList.toggle('hidden', i === steps.length - 1);
      send.classList.toggle('hidden', i !== steps.length - 1);
      if (i === steps.length - 1) summarize();
      if (focus) steps[i].querySelector('legend').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    var valid = function (step) {
      var fields = step.querySelectorAll('input, select, textarea');
      for (var n = 0; n < fields.length; n++) {
        if (!fields[n].checkValidity()) { fields[n].reportValidity(); return false; }
      }
      return true;
    };
    var summarize = function () {
      var box = wizard.querySelector('[data-summary]');
      var list = wizard.querySelector('[data-summary-list]');
      var checked = wizard.querySelector('input[name="leistung"]:checked');
      var extras = Array.prototype.map.call(wizard.querySelectorAll('[data-step="2"] input[type="checkbox"]:checked'), function (c) {
        return c.parentElement.textContent.trim();
      }).join(', ');
      var rows = [
        [TXT.service, checked ? checked.parentElement.querySelector('.font-semibold').textContent : ''],
        [TXT.material, wizard.querySelector('#werkstoff').value],
        [TXT.quantity, wizard.querySelector('#stueckzahl').value],
        [TXT.date, wizard.querySelector('#termin').value],
        [TXT.size, wizard.querySelector('#abmessungen').value],
        [TXT.extras, extras]
      ];
      list.textContent = '';
      rows.forEach(function (r) {
        if (!r[1]) return;
        var dt = document.createElement('dt'); dt.className = 'text-slate-500 dark:text-slate-400'; dt.textContent = r[0];
        var dd = document.createElement('dd'); dd.className = 'font-medium text-slate-900 dark:text-white'; dd.textContent = r[1];
        var wrap = document.createElement('div'); wrap.appendChild(dt); wrap.appendChild(dd);
        list.appendChild(wrap);
      });
      box.hidden = !list.children.length;
    };
    next.addEventListener('click', function () { if (valid(steps[current])) go(current + 1, true); });
    prev.addEventListener('click', function () { go(current - 1, true); });
    wizard.addEventListener('keydown', function (e) {
      // Enter springt zum nächsten Schritt statt das Formular vorzeitig abzusenden
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < steps.length - 1) {
        e.preventDefault();
        next.click();
      }
    });
    go(0, false);
  }

  // Formulare per Fetch absenden (ohne JavaScript: normaler Formularversand)
  document.querySelectorAll('[data-ajax-form]').forEach(function (form) {
    if (!window.fetch) return;
    var result = form.querySelector('[data-form-result]');
    var submit = form.querySelector('button[type="submit"]');
    var label = submit.innerHTML;
    var show = function (ok, text) {
      result.hidden = false;
      result.className = 'rounded-lg p-4 text-sm ' + (ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200');
      result.textContent = text;
      result.focus();
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      submit.textContent = TXT.sending;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        show(true, TXT.ok);
      }).catch(function () {
        show(false, TXT.fail);
      }).finally(function () {
        submit.disabled = false;
        submit.innerHTML = label;
      });
    });
  });
})();
