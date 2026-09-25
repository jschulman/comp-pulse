// comp-pulse — observable demand and explicit missing data.
'use strict';

const known = value => typeof value === 'number' && Number.isFinite(value);
const count = value => known(value) ? Math.round(value).toLocaleString('en-US') : '—';
const rate = (numerator, denominator) => known(numerator) && known(denominator) && denominator > 0 && numerator >= 0 && numerator <= denominator ? numerator / denominator : null;
const pct = (value, digits = 1) => known(value) ? (value * 100).toFixed(digits) + '%' : '—';
const text = (id, value) => { document.getElementById(id).textContent = value; };
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function observationDate(data) {
  return data.metadata.as_of_date || data.timeseries?.at(-1)?.date || data.metadata.last_updated;
}
function freshness(data, detail) {
  const date = observationDate(data);
  const age = date ? Math.floor((Date.now() - Date.parse(date)) / 86400000) : null;
  const status = known(age) && age > 2 ? ` · ${age} days old` : '';
  text('last-updated', `Observation: ${date || 'unknown'}${status} · ${detail}`);
  text('method-note', `Method: ${data.metadata.methodology_version || data.metadata.version || 'unversioned'}. Historical gaps are unknown, not zero. Changes in coverage or definitions can affect comparisons.`);
}
async function loadLatest() {
  const res = await fetch('data/latest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Unable to load the latest observations.');
  return res.json();
}
// Daily observations are authoritative within the same exported document.
// Missing calendar dates are inserted so a line cannot bridge an unobserved day.
function dailySeries(points) {
  const sorted = points.slice().sort((a, b) => a.date.localeCompare(b.date));
  const result = [];
  for (const point of sorted) {
    const previous = result.at(-1);
    if (previous) {
      let next = Date.parse(previous.date) + 86400000;
      const end = Date.parse(point.date);
      while (Number.isFinite(next) && next < end) {
        result.push({ date: new Date(next).toISOString().slice(0, 10) });
        next += 86400000;
      }
    }
    result.push(point);
  }
  return result;
}
function lineChart(id, series, values, label, percentage = false) {
  new Chart(document.getElementById(id).getContext('2d'), {
    type: 'line',
    data: { labels: series.map(p => p.date), datasets: [{
      label, data: values, spanGaps: false,
      borderColor: '#f6c440', backgroundColor: 'rgba(246,196,64,0.12)',
      fill: true, tension: 0.2,
      pointRadius: values.map((value, index) => known(value) && (series.length <= 30 || (!known(values[index - 1]) && !known(values[index + 1]))) ? 3 : 0),
      pointHoverRadius: 5,
    }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: {
        label: item => known(item.parsed.y) ? `${item.parsed.y.toFixed(1)}${percentage ? '%' : ''} ${label}` : 'Unknown',
      } } },
      scales: {
        x: { ticks: { color: '#8b949e', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }, grid: { color: 'rgba(139,148,158,0.08)' } },
        y: { min: 0, ...(percentage ? { max: 100 } : {}), ticks: { color: '#8b949e', callback: v => v + (percentage ? '%' : '') }, grid: { color: 'rgba(139,148,158,0.08)' } },
      },
    },
  });
}
function demandTable(id, rows, field, denominator, companies = false) {
  const cells = companies ? 4 : 3;
  document.getElementById(id).innerHTML = rows.length ? rows.slice().sort((a, b) => b.n - a.n).map(row => {
    const share = rate(row.n, denominator);
    return `<tr><td class="subsector-name">${escapeHtml(row[field])}</td><td class="subsector-numeric">${count(row.n)}</td><td class="subsector-numeric">${pct(share)}</td>${companies ? `<td class="subsector-numeric">${count(row.n_companies)}</td>` : ''}</tr>`;
  }).join('') : `<tr><td colspan="${cells}" style="text-align:center;padding:1.5rem;">No observations available</td></tr>`;
}
function unavailable(error) {
  text('hero-score', '—'); text('hero-phase', 'Data unavailable');
  text('hero-description', 'The latest observations could not be loaded. Please try again later.');
  text('last-updated', 'Observation date unavailable');
  console.error(error);
}

function formatDelta(value) { return known(value) ? (value > 0 ? '+' : '') + pct(value) : '—'; }
function render(data) {
  const h = data.headline;
  const series = dailySeries(data.timeseries || []);
  text('hero-score', known(h.index) ? h.index.toFixed(1) : '—');
  text('hero-phase', known(h.index) ? 'Advertised salary-range index' : 'No eligible observations');
  text('hero-description', 'Tracks the median advertised salary-range maximum across roles. Changes can reflect the mix of jobs, locations, and employers; this does not measure pay received or a blockchain talent premium.');
  freshness(data, `baseline 100 on ${data.metadata.baseline_date || 'unknown date'} · all roles in the crypto-native baseline`);
  const calendarWindows = Number.parseInt(data.metadata.version, 10) >= 2;
  for (const days of [7, 30, 90]) {
    text(`delta-${days}d`, formatDelta(h[`delta_${days}d`]));
    text(`delta-label-${days}d`, calendarWindows ? `Versus prior ${days}-day mean` : `Versus prior ${days} observations`);
  }
  const today = (data.disclosure_history || []).find(row => row.period === 'latest observation' || row.period === 'today');
  const sample = data.sample;
  text('sample-note', `${count(sample?.n_with_comp ?? today?.n_with_comp)} listings with extracted salary ranges of ${count(sample?.n_open ?? today?.n_open)} open listings. ${sample && known(sample.n_companies) ? `${count(sample.n_companies)} companies represented.` : 'Company breadth is unavailable in this snapshot.'} Role and location mix are not held constant.`);
  text('chart-caption', `100 = the first usable baseline observation (${data.metadata.baseline_date || 'date unavailable'}). ${calendarWindows ? 'Deltas require a complete prior calendar-day window; incomplete windows are unknown.' : 'Legacy deltas use prior recorded observations, which may span more calendar days when collection is interrupted.'} Gaps are unknown.`);
  lineChart('timeline-chart', series, series.map(point => known(point.index) ? point.index : null), 'salary-range maximum index');
  document.getElementById('disclosure-tbody').innerHTML = (data.disclosure_history || []).map(row => `<tr><td class="subsector-name">${escapeHtml(row.period)}</td><td class="subsector-numeric">${count(row.n_with_comp)} of ${count(row.n_open)}</td><td class="subsector-numeric">${pct(row.n_open > 0 && known(row.rate) ? row.rate : null)}</td></tr>`).join('') || '<tr><td colspan="3">No disclosure observations available</td></tr>';
}

loadLatest().then(render).catch(unavailable);
