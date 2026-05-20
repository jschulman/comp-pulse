// Comp Pulse — dashboard renderer
// Reads data/latest.json and renders:
//   1. Index value + phase label
//   2. Three delta cards (WoW, MoM, 90d)
//   3. Index time series chart
//   4. Disclosure rate table (today + 7d/30d averages)

'use strict';

const PHASES = [
  { delta: -0.05, label: 'Contracting',  desc: 'Crypto-native comp budgets pulling back versus the trailing average.' },
  { delta: -0.01, label: 'Soft',         desc: 'Slight downward drift — early signal of cooling, not a crash.' },
  { delta:  0.01, label: 'Steady',       desc: 'Compensation moving sideways. Neither hot nor cold.' },
  { delta:  0.05, label: 'Rising',       desc: 'Real upward pressure on crypto-native comp.' },
  { delta:  1.00, label: 'Heating',      desc: 'Strong upward drift — talent premium widening.' },
];

function phaseFor(delta30d) {
  if (delta30d == null || !isFinite(delta30d)) return { label: 'Insufficient history', desc: 'Need at least 30 days of data before this label is meaningful.' };
  for (const p of PHASES) {
    if (delta30d <= p.delta) return p;
  }
  return PHASES[PHASES.length - 1];
}

function formatPct(x, digits) {
  if (x == null || !isFinite(x)) return '—';
  const d = (typeof digits === 'number') ? digits : 1;
  const sign = x > 0 ? '+' : '';
  return sign + (x * 100).toFixed(d) + '%';
}

function formatIndex(x) {
  if (x == null || !isFinite(x)) return '—';
  return x.toFixed(1);
}

function deltaClass(x) {
  if (x == null || !isFinite(x)) return 'neutral';
  if (x >= 0.01) return 'up';
  if (x <= -0.01) return 'down';
  return 'flat';
}

async function loadLatest() {
  const res = await fetch('data/latest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load data/latest.json');
  return res.json();
}

function renderHeadline(data) {
  const idx = data.headline.index;
  const d30 = data.headline.delta_30d;
  const phase = phaseFor(d30);
  document.getElementById('hero-score').textContent = formatIndex(idx);
  document.getElementById('hero-phase').textContent = phase.label;
  document.getElementById('hero-description').textContent = phase.desc;

  const last = data.metadata.last_updated;
  const baseline = data.metadata.baseline_date;
  document.getElementById('last-updated').textContent =
    `Last updated: ${last} · Index anchored at 100 on ${baseline}`;
}

function renderDeltas(data) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    el.textContent = formatPct(val);
    el.className = 'delta-value ' + deltaClass(val);
  };
  set('delta-7d',  data.headline.delta_7d);
  set('delta-30d', data.headline.delta_30d);
  set('delta-90d', data.headline.delta_90d);
}

function renderTimeline(data) {
  const series = data.timeseries || [];
  const labels = series.map(p => p.date);
  const values = series.map(p => Number(p.index.toFixed(2)));

  const ctx = document.getElementById('timeline-chart').getContext('2d');
  // eslint-disable-next-line no-new
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Comp Index (100 = 2026-05-20)',
          data: values,
          borderColor: '#f6c440',
          backgroundColor: 'rgba(246, 196, 64, 0.12)',
          fill: true,
          tension: 0.25,
          pointRadius: series.length > 30 ? 0 : 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Baseline (100)',
          data: values.map(() => 100),
          borderColor: 'rgba(139,148,158,0.5)',
          borderDash: [4, 4],
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `Index ${item.parsed.y.toFixed(1)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#8b949e', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
        y: {
          ticks: { color: '#8b949e' },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
      },
    },
  });
}

function renderDisclosureTable(data) {
  const tbody = document.getElementById('disclosure-tbody');
  const rows = data.disclosure_history || [];
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);padding:1.5rem;">Insufficient history.</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(r => {
    const ratePct = (r.rate * 100).toFixed(1) + '%';
    return `
      <tr>
        <td class="subsector-name">${escapeHtml(r.period)}</td>
        <td class="subsector-numeric">${r.n_with_comp} of ${r.n_open}</td>
        <td class="subsector-numeric">${ratePct}</td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

(async function init() {
  try {
    const data = await loadLatest();
    renderHeadline(data);
    renderDeltas(data);
    renderTimeline(data);
    renderDisclosureTable(data);
  } catch (err) {
    document.getElementById('hero-score').textContent = '—';
    document.getElementById('hero-phase').textContent = 'Data unavailable';
    document.getElementById('hero-description').textContent = String(err && err.message ? err.message : err);
    console.error(err);
  }
})();
