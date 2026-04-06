/* rentals.js */

let availableVehicles = [];
let allRentals = [];

async function loadAll() {
  try {
    [allRentals, availableVehicles] = await Promise.all([
      apiFetch(`${API}/rentals`),
      apiFetch(`${API}/vehicles/available`),
    ]);
    const customers = await apiFetch(`${API}/customers`);
    populateSelects(customers);
    renderTables();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function populateSelects(customers) {
  const cSel = document.getElementById('customer_id');
  const vSel = document.getElementById('vehicle_id');
  cSel.innerHTML = '<option value="">Select a customer…</option>' +
    customers.map(c => `<option value="${c.id}">${c.full_name} (${c.phone})</option>`).join('');
  vSel.innerHTML = '<option value="">Select a vehicle…</option>' +
    availableVehicles.map(v =>
      `<option value="${v.id}" data-price="${v.price_per_day}">${v.brand} ${v.model} — ${v.license_plate} (₹${v.price_per_day}/day)</option>`
    ).join('');
}

function renderTables() {
  const active    = allRentals.filter(r => r.status === 'active');
  const history   = allRentals.filter(r => r.status !== 'active');
  const activeEl  = document.getElementById('activeCount');
  activeEl.textContent = `${active.length} active`;

  const activeBody = document.getElementById('activeBody');
  if (!active.length) {
    activeBody.innerHTML = emptyState('📋', 'No active rentals', 'Book a rental to see it here.');
  } else {
    activeBody.innerHTML = active.map(r => {
      const days = getDaysBetween(r.start_date, r.end_date);
      return `<tr>
        <td>#${r.id}</td>
        <td><strong>${r.customer_name}</strong><br/><small style="color:var(--text-secondary)">${r.customer_phone}</small></td>
        <td>${r.brand} ${r.model}<br/><small style="color:var(--text-secondary)">${r.license_plate}</small></td>
        <td>${formatDate(r.start_date)}</td>
        <td>${formatDate(r.end_date)}</td>
        <td>${days} day${days !== 1 ? 's' : ''}</td>
        <td><strong>${formatCurrency(r.total_cost)}</strong></td>
        <td style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn btn-success btn-sm" onclick="returnRental(${r.id})">✅ Return</button>
          <button class="btn btn-danger btn-sm"  onclick="cancelRental(${r.id})">✖ Cancel</button>
        </td>
      </tr>`;
    }).join('');
  }

  const historyBody = document.getElementById('historyBody');
  if (!history.length) {
    historyBody.innerHTML = emptyState('📂', 'No history', 'Completed and cancelled rentals will appear here.');
  } else {
    historyBody.innerHTML = history.map(r => `
      <tr>
        <td>#${r.id}</td>
        <td>${r.customer_name}</td>
        <td>${r.brand} ${r.model}</td>
        <td>${formatDate(r.start_date)}</td>
        <td>${formatDate(r.end_date)}</td>
        <td>${formatCurrency(r.total_cost)}</td>
        <td>${badgeHtml(r.status)}</td>
      </tr>
    `).join('');
  }
}

// Live price preview
function updatePricePreview() {
  const vSel = document.getElementById('vehicle_id');
  const start = document.getElementById('start_date').value;
  const end   = document.getElementById('end_date').value;
  const preview = document.getElementById('costPreview');
  if (!vSel.value || !start || !end) { preview.style.display = 'none'; return; }
  const days = getDaysBetween(start, end);
  if (days <= 0) { preview.style.display = 'none'; return; }
  const price = parseFloat(vSel.selectedOptions[0].dataset.price);
  document.getElementById('costText').textContent = formatCurrency(price * days);
  document.getElementById('daysText').textContent  = `${days} day${days !== 1 ? 's' : ''} × ${formatCurrency(price)}/day`;
  preview.style.display = 'block';
}

// Set today as min date
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('start_date').min = today;
  document.getElementById('end_date').min   = today;
  document.getElementById('start_date').value = today;
}

function openModal() {
  document.getElementById('rentalForm').reset();
  document.getElementById('costPreview').style.display = 'none';
  setMinDates();
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

async function bookRental() {
  const body = {
    vehicle_id:  parseInt(document.getElementById('vehicle_id').value),
    customer_id: parseInt(document.getElementById('customer_id').value),
    start_date:  document.getElementById('start_date').value,
    end_date:    document.getElementById('end_date').value,
    notes:       document.getElementById('notes').value.trim(),
  };
  if (!body.vehicle_id || !body.customer_id || !body.start_date || !body.end_date) {
    return showToast('Please fill all required fields', 'error');
  }
  try {
    const result = await apiFetch(`${API}/rentals`, { method: 'POST', body: JSON.stringify(body) });
    showToast(`Rental booked! Total: ${formatCurrency(result.total_cost)} for ${result.days} days`);
    closeModal();
    loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function returnRental(id) {
  if (!confirm('Mark this vehicle as returned?')) return;
  try {
    await apiFetch(`${API}/rentals/${id}/return`, { method: 'PUT' });
    showToast('Vehicle returned successfully!');
    loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function cancelRental(id) {
  if (!confirm('Cancel this rental? The vehicle will become available again.')) return;
  try {
    await apiFetch(`${API}/rentals/${id}/cancel`, { method: 'PUT' });
    showToast('Rental cancelled.');
    loadAll();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

loadAll();
