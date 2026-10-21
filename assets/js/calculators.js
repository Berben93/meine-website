// Kernlochrechner (metrische ISO-Gewinde) und Schnittwerte-Rechner (Fräsen/Bohren)
(function () {
  'use strict';
  var EN = document.documentElement.lang === 'en';
  var num = function (el) { return parseFloat(String(el.value).replace(',', '.')); };
  var fmt = function (v, d) {
    var s = v.toFixed(d);
    return EN ? Number(s).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d })
      : Number(s).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  var outs = function (root) {
    return function (name) { return root.querySelector('[data-out="' + name + '"]'); };
  };

  // ---------- Kernlochrechner ----------
  var tap = document.querySelector('[data-tap-calc]');
  if (tap) {
    // ISO-Regelgewinde (ISO 261): Nenndurchmesser → Steigung
    var COARSE = { 1: 0.25, 1.2: 0.25, 1.4: 0.3, 1.6: 0.35, 2: 0.4, 2.5: 0.45, 3: 0.5, 4: 0.7, 5: 0.8, 6: 1, 8: 1.25, 10: 1.5, 12: 1.75,
      14: 2, 16: 2, 18: 2.5, 20: 2.5, 22: 2.5, 24: 3, 27: 3, 30: 3.5, 33: 3.5, 36: 4, 42: 4.5, 48: 5, 56: 5.5, 64: 6 };
    var sel = tap.querySelector('#tap-size');
    var dIn = tap.querySelector('#tap-d');
    var pIn = tap.querySelector('#tap-p');
    var err = document.querySelector('[data-tap-error]');
    var res = document.querySelector('[data-tap-result]');
    var $t = outs(res);
    Object.keys(COARSE).map(Number).sort(function (a, b) { return a - b; }).forEach(function (d) {
      var o = document.createElement('option');
      o.value = String(d);
      o.textContent = 'M' + fmt(d, d % 1 ? 1 : 0) + ' × ' + fmt(COARSE[d], 2);
      sel.insertBefore(o, sel.lastElementChild);
    });
    var calcTap = function () {
      var d = num(dIn), p = num(pIn);
      if (!(d >= 1 && d <= 100 && p >= 0.2 && p <= 6 && p < d / 2)) {
        err.hidden = false; res.style.opacity = '.4'; return;
      }
      err.hidden = true; res.style.opacity = '';
      var name = 'M' + fmt(d, d % 1 ? 1 : 0) + (COARSE[d] === p ? '' : ' × ' + fmt(p, 2));
      $t('title').textContent = name;
      $t('cut').textContent = fmt(d - p, 2) + ' mm';
      $t('form').textContent = fmt(d - 0.5 * p, 2) + ' mm';
      $t('d1').textContent = fmt(d - 1.082532 * p, 3) + ' mm';
      $t('d2').textContent = fmt(d - 0.649519 * p, 3) + ' mm';
      $t('d3').textContent = fmt(d - 1.226869 * p, 3) + ' mm';
      $t('h1').textContent = fmt(0.541266 * p, 3) + ' mm';
      $t('le-steel').textContent = fmt(1.0 * d, 1) + ' mm';
      $t('le-cast').textContent = fmt(1.25 * d, 1) + ' mm';
      $t('le-alu').textContent = fmt(2.0 * d, 1) + ' mm';
    };
    sel.addEventListener('change', function () {
      if (sel.value) { dIn.value = sel.value; pIn.value = COARSE[sel.value]; }
      calcTap();
    });
    [dIn, pIn].forEach(function (el) {
      el.addEventListener('input', function () {
        var d = num(dIn);
        sel.value = COARSE[d] === num(pIn) ? String(d) : '';
        calcTap();
      });
    });
    sel.value = '10'; dIn.value = '10'; pIn.value = '1.5';
    calcTap();
  }

  // ---------- Schnittwerte-Rechner ----------
  var cut = document.querySelector('[data-cut-calc]');
  if (cut) {
    // Richtwerte für VHM-Werkzeuge um Ø 10 mm: Fräsen vc (m/min) / fz (mm), Bohren vc / f (mm/U)
    var MAT = {
      alu: { mill: [400, 0.06], drill: [200, 0.25] },
      steel: { mill: [180, 0.05], drill: [100, 0.2] },
      stainless: { mill: [100, 0.04], drill: [60, 0.12] },
      tool: { mill: [120, 0.04], drill: [70, 0.15] },
      titan: { mill: [55, 0.04], drill: [35, 0.1] },
      brass: { mill: [250, 0.06], drill: [120, 0.2] },
      plastic: { mill: [300, 0.08], drill: [150, 0.2] }
    };
    var f = function (id) { return cut.querySelector('#' + id); };
    var r = document.querySelector('[data-cut-result]');
    var cerr = document.querySelector('[data-cut-error]');
    var $c = outs(r);
    var mode = function () { return cut.querySelector('input[name="cut-mode"]:checked').value; };
    var applyMode = function () {
      var drill = mode() === 'drill';
      cut.querySelectorAll('[data-mill-only]').forEach(function (el) { el.hidden = drill; });
      cut.querySelectorAll('[data-drill-only]').forEach(function (el) { el.hidden = !drill; });
      r.querySelectorAll('[data-mill-only]').forEach(function (el) { el.hidden = drill; });
    };
    var preset = function () {
      var m = MAT[f('cut-mat').value];
      if (!m) return;
      var v = m[mode()];
      f('cut-vc').value = v[0];
      if (mode() === 'drill') f('cut-f').value = v[1]; else f('cut-fz').value = v[1];
    };
    var calcCut = function () {
      var drill = mode() === 'drill';
      var D = num(f('cut-d')), vc = num(f('cut-vc'));
      var z = drill ? 2 : num(f('cut-z'));
      var fz = drill ? num(f('cut-f')) / 2 : num(f('cut-fz'));
      if (!(D > 0 && D <= 200 && vc > 0 && z >= 1 && fz > 0)) { cerr.hidden = false; r.style.opacity = '.4'; return; }
      cerr.hidden = true; r.style.opacity = '';
      var n = vc * 1000 / (Math.PI * D);
      var vf = n * z * fz;
      $c('n').textContent = fmt(n, 0) + ' min⁻¹';
      $c('vf').textContent = fmt(vf, 0) + ' mm/min';
      $c('frev').textContent = fmt(z * fz, 3) + ' mm';
      if (!drill) {
        var ap = num(f('cut-ap')), ae = num(f('cut-ae'));
        $c('q').textContent = ap > 0 && ae > 0 ? fmt(ap * ae * vf / 1000, 1) + ' cm³/min' : '–';
      }
    };
    cut.querySelectorAll('input[name="cut-mode"]').forEach(function (el) {
      el.addEventListener('change', function () { applyMode(); preset(); calcCut(); });
    });
    f('cut-mat').addEventListener('change', function () { preset(); calcCut(); });
    cut.addEventListener('input', function (e) {
      if (e.target.id === 'cut-vc' || e.target.id === 'cut-fz' || e.target.id === 'cut-f') f('cut-mat').value = '';
      calcCut();
    });
    applyMode();
    calcCut();
  }
})();
