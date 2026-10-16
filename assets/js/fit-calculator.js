// ISO-286-Passungsrechner (Bohrungen F, G, H, JS · Wellen f, g, h, js, k, m, n, p · IT5–IT11 · bis 500 mm)
(function () {
  'use strict';
  var form = document.querySelector('[data-fit-calc]');
  if (!form) return;

  var EN = document.documentElement.lang === 'en';
  var TXT = EN ? {
    hole: 'Hole', shaft: 'Shaft', clearance: 'Clearance fit', transition: 'Transition fit', interference: 'Interference fit',
    maxC: 'Max. clearance', minC: 'Min. clearance', maxI: 'Max. interference', minI: 'Min. interference', maxCt: 'Max. clearance', maxIt: 'Max. interference',
    range: 'Please enter a nominal size above 0 and up to 500 mm.', it: 'Tolerance grades', zero: 'Zero line', dec: '.'
  } : {
    hole: 'Bohrung', shaft: 'Welle', clearance: 'Spielpassung', transition: 'Übergangspassung', interference: 'Übermaßpassung',
    maxC: 'Höchstspiel', minC: 'Mindestspiel', maxI: 'Höchstübermaß', minI: 'Mindestübermaß', maxCt: 'Höchstspiel', maxIt: 'Höchstübermaß',
    range: 'Bitte ein Nennmaß über 0 bis einschließlich 500 mm eingeben.', it: 'Toleranzgrade', zero: 'Nulllinie', dec: ','
  };

  // Nennmaßbereiche (über … bis einschließlich)
  var RANGES = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500];
  // Grundtoleranzen in µm (ISO 286-1)
  var IT = {
    5: [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    6: [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7: [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8: [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9: [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
    10: [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
    11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400]
  };
  // Grundabmaße Wellen in µm: es (oberes) für f, g, h – ei (unteres) für k, m, n, p
  var ES = {
    f: [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
    g: [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
    h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
  var EI = {
    k: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5], // gilt für IT4–IT7, sonst 0
    m: [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
    n: [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
    p: [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68]
  };

  function rangeIndex(d) {
    if (!(d > 0) || d > 500) return -1;
    for (var i = 0; i < RANGES.length; i++) if (d <= RANGES[i]) return i;
    return -1;
  }
  function jsHalf(it, grade) {
    // ISO 286: bei ungeraden Werten in IT7–IT11 auf gerade Zahl abrunden
    if (grade >= 7 && it % 2 === 1) it -= 1;
    return it / 2;
  }
  function shaft(letter, grade, i) {
    var it = IT[grade][i];
    if (letter === 'js') { var h = jsHalf(it, grade); return { up: h, lo: -h }; }
    if (ES[letter]) { var es = ES[letter][i]; return { up: es, lo: es - it }; }
    var ei = EI[letter][i];
    if (letter === 'k' && (grade < 4 || grade > 7)) ei = 0;
    return { up: ei + it, lo: ei };
  }
  function hole(letter, grade, i) {
    var it = IT[grade][i];
    if (letter === 'JS') { var h = jsHalf(it, grade); return { up: h, lo: -h }; }
    // F, G, H: EI = -es der entsprechenden Welle (allgemeine Regel)
    var ei = -ES[letter.toLowerCase()][i];
    return { up: ei + it, lo: ei };
  }

  function fmtUm(v) {
    var s = (Math.round(v * 10) / 10).toString().replace('.', TXT.dec);
    return (v > 0 ? '+' : v < 0 ? '−' : '±') + s.replace('-', '') + ' µm';
  }
  function fmtMm(v) {
    var s = v.toFixed(4);
    if (s.slice(-1) === '0') s = s.slice(0, -1); // 3 Nachkommastellen, 4 nur bei halben µm
    return s.replace('.', TXT.dec) + ' mm';
  }
  function plain(v) { return (Math.round(Math.abs(v) * 10) / 10).toString().replace('.', TXT.dec) + ' µm'; }
  function $(n) { return form.parentElement.querySelector('[data-out="' + n + '"]'); }

  var els = {
    d: document.getElementById('fit-d'), hl: document.getElementById('fit-hl'), hg: document.getElementById('fit-hg'),
    sl: document.getElementById('fit-sl'), sg: document.getElementById('fit-sg')
  };
  var result = document.querySelector('[data-fit-result]');
  var error = document.querySelector('[data-fit-error]');

  function diagram(H, W) {
    var vals = [H.up, H.lo, W.up, W.lo, 0];
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var pad = Math.max(5, (max - min) * 0.15);
    max += pad; min -= pad;
    var h = 220, w = 360, y = function (v) { return 10 + (max - v) / (max - min) * (h - 20); };
    var zone = function (x, z, cls, label) {
      var top = y(z.up), bot = y(z.lo);
      return '<rect x="' + x + '" y="' + top.toFixed(1) + '" width="90" height="' + Math.max(2, bot - top).toFixed(1) + '" rx="4" class="' + cls + '"/>' +
        '<text x="' + (x + 45) + '" y="' + ((top + bot) / 2 + 5).toFixed(1) + '" text-anchor="middle" class="fill-white text-[13px] font-semibold">' + label + '</text>';
    };
    var y0 = y(0).toFixed(1);
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="w-full max-w-md" role="img" aria-label="' + TXT.zero + '">' +
      '<line x1="10" x2="' + (w - 10) + '" y1="' + y0 + '" y2="' + y0 + '" class="stroke-slate-400" stroke-dasharray="6 4"/>' +
      '<text x="' + (w - 10) + '" y="' + (y0 - 6) + '" text-anchor="end" class="fill-slate-500 text-[11px]">' + TXT.zero + '</text>' +
      zone(70, H, 'fill-brand-700', TXT.hole) + zone(200, W, 'fill-accent-500', TXT.shaft) + '</svg>';
  }

  function calc() {
    var d = parseFloat(String(els.d.value).replace(',', '.'));
    var i = rangeIndex(d);
    if (i < 0) { error.textContent = TXT.range; error.hidden = false; result.style.opacity = '.4'; return; }
    error.hidden = true; result.style.opacity = '';
    var hg = +els.hg.value, sg = +els.sg.value;
    var H = hole(els.hl.value, hg, i), W = shaft(els.sl.value, sg, i);
    var maxClear = H.up - W.lo;   // größte Bohrung – kleinste Welle
    var minClear = H.lo - W.up;   // kleinste Bohrung – größte Welle
    var type, maxL, minL, maxV, minV;
    if (minClear >= 0) {
      type = TXT.clearance; maxL = TXT.maxC; minL = TXT.minC; maxV = plain(maxClear); minV = plain(minClear);
    } else if (maxClear <= 0) {
      type = TXT.interference; maxL = TXT.maxI; minL = TXT.minI; maxV = plain(minClear); minV = plain(maxClear);
    } else {
      type = TXT.transition; maxL = TXT.maxCt; minL = TXT.maxIt; maxV = plain(maxClear); minV = plain(minClear);
    }
    var name = 'Ø ' + String(d).replace('.', TXT.dec) + ' ' + els.hl.value + hg + '/' + els.sl.value + sg;
    $('title').textContent = name;
    $('type').textContent = type;
    $('maxLabel').textContent = maxL; $('max').textContent = maxV;
    $('minLabel').textContent = minL; $('min').textContent = minV;
    $('hName').textContent = TXT.hole + ' ' + els.hl.value + hg;
    $('sName').textContent = TXT.shaft + ' ' + els.sl.value + sg;
    $('hUp').textContent = fmtUm(H.up); $('hLo').textContent = fmtUm(H.lo);
    $('sUp').textContent = fmtUm(W.up); $('sLo').textContent = fmtUm(W.lo);
    $('hMax').textContent = fmtMm(d + H.up / 1000); $('hMin').textContent = fmtMm(d + H.lo / 1000);
    $('sMax').textContent = fmtMm(d + W.up / 1000); $('sMin').textContent = fmtMm(d + W.lo / 1000);
    $('it').textContent = TXT.it + ': IT' + hg + ' = ' + IT[hg][i] + ' µm · IT' + sg + ' = ' + IT[sg][i] + ' µm';
    $('diagram').innerHTML = diagram(H, W);
  }

  form.addEventListener('input', calc);
  form.addEventListener('change', calc);
  form.querySelectorAll('[data-preset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-preset').match(/^([A-Z]+)(\d+)\/([a-z]+)(\d+)$/);
      els.hl.value = m[1]; els.hg.value = m[2]; els.sl.value = m[3]; els.sg.value = m[4];
      calc();
    });
  });
  calc();
})();
