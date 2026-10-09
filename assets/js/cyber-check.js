// MACK Technologies — cyber security self-check (based on the ASD Essential Eight, ML1)
(function () {
  var form = document.getElementById('cyber-check');
  if (!form) return;
  var result = document.getElementById('check-result');
  var err = document.getElementById('check-error');
  var qs = Array.prototype.slice.call(form.querySelectorAll('.q'));

  var BANDS = [
    { min: 13, title: 'Strong foundation',
      text: 'You have most of the basics in place. A quick review can confirm the settings are working as intended and close the remaining gaps.' },
    { min: 7, title: 'Some important gaps',
      text: 'Some key protections are missing or only partly in place. These gaps are exactly what attackers look for, and most can be fixed quickly.' },
    { min: 0, title: 'High risk',
      text: 'Several basic protections are missing. A single phishing email or stolen password could cause serious damage. The good news: the fixes below are well understood and affordable.' }
  ];
  var STATUS = { 2: ['In place', 'ok'], 1: ['Partly in place', 'part'], 0: ['Gap', 'gap'] };

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  form.addEventListener('change', function (e) {
    var q = e.target.closest('.q');
    if (q) q.classList.remove('is-missing');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var total = 0, rows = [], summary = [], missing = null;
    qs.forEach(function (q) {
      var picked = q.querySelector('input:checked');
      q.classList.toggle('is-missing', !picked);
      if (!picked) { if (!missing) missing = q; return; }
      var v = parseInt(picked.value, 10);
      total += v;
      var st = STATUS[v];
      summary.push(q.dataset.name + ': ' + st[0] + ' (' + picked.nextElementSibling.textContent + ')');
      rows.push({ v: v, html:
        '<li class="r-' + st[1] + '"><span class="r-status">' + st[0] + '</span>' +
        '<div><strong>' + esc(q.dataset.name) + '</strong>' +
        (v < 2 ? '<p>' + esc(q.dataset.rec) + ' <a href="' + q.dataset.link + '">How we help</a></p>' : '') +
        '</div></li>' });
    });
    if (missing) {
      err.hidden = false;
      missing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var first = missing.querySelector('input');
      if (first) first.focus({ preventScroll: true });
      return;
    }
    err.hidden = true;
    rows.sort(function (a, b) { return a.v - b.v; });
    var band = BANDS.filter(function (b) { return total >= b.min; })[0];
    document.getElementById('score').textContent = total;
    document.getElementById('band-title').textContent = band.title;
    document.getElementById('band-text').textContent = band.text;
    document.getElementById('result-list').innerHTML = rows.map(function (r) { return r.html; }).join('');
    document.getElementById('lead-score').value = total + '/16 (' + band.title + ')';
    document.getElementById('lead-answers').value = summary.join('\n');
    document.getElementById('lead-subject').value = 'Cyber self-check: ' + total + '/16 (' + band.title + ')';
    result.dataset.band = band.title === 'High risk' ? 'high' : band.title === 'Strong foundation' ? 'low' : 'mid';
    form.hidden = true;
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('check-again').addEventListener('click', function () {
    result.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Send results to Formspree without leaving the page; fall back to a normal post if fetch fails
  var lead = document.getElementById('lead-form');
  lead.addEventListener('submit', function (e) {
    if (!window.fetch || !window.FormData) return;
    e.preventDefault();
    if (!lead.checkValidity()) { lead.reportValidity(); return; }
    var btn = lead.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(lead.action, { method: 'POST', body: new FormData(lead), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('send failed');
        lead.hidden = true;
        var done = document.getElementById('lead-done');
        done.hidden = false; done.focus();
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send my results';
        lead.submit();
      });
  });
})();
