/* dashboard.js */

async function loadDashboard() {
  try {
    const data = await apiFetch(`${API}/dashboard`);

    document.getElementById('statGrid').innerHTML = `
      <div class="stat-card purple">
        <div class="stat-icon">🚗</div>
        <div class="stat-value">${data.total_vehicles}</div>
        <div class="stat-label">Total Vehicles</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${data.available}</div>
        <div class="stat-label">Available Now</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${data.active_rentals}</div>
        <div class="stat-label">Active Rentals</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">👤</div>
        <div class="stat-value">${data.total_customers}</div>
        <div class="stat-label">Customers</div>
      </div>
      <div class="stat-card green" style="--glow-color:rgba(34,197,94,0.3)">
        <div class="stat-icon">💰</div>
        <div class="stat-value" style="font-size:22px;">${formatCurrency(data.total_revenue)}</div>
        <div class="stat-label">Total Revenue</div>
      </div>
    `;

    const tbody = document.getElementById('recentBody');
    if (!data.recent_rentals.length) {
      tbody.innerHTML = emptyState('📋', 'No rentals yet', 'Book your first rental to see it here.');
      return;
    }
    tbody.innerHTML = data.recent_rentals.map(r => `
      <tr>
        <td>#${r.id}</td>
        <td>${r.customer}</td>
        <td>${r.brand} ${r.model}<br/><small style="color:var(--text-secondary)">${r.license_plate}</small></td>
        <td>${formatDate(r.start_date)}</td>
        <td>${formatDate(r.end_date)}</td>
        <td>${formatCurrency(r.total_cost)}</td>
        <td>${badgeHtml(r.status)}</td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

loadDashboard();
