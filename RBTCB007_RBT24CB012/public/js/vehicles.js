/* vehicles.js */

let allVehicles = [];

async function loadVehicles() {
  try {
    allVehicles = await apiFetch(`${API}/vehicles`);
    renderTable(allVehicles);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderTable(vehicles) {
  const tbody = document.getElementById('vehicleBody');
  if (!vehicles.length) {
    tbody.innerHTML = emptyState('🚗', 'No vehicles found', 'Add your first vehicle to get started.');
    return;
  }
  tbody.innerHTML = vehicles.map(v => `
    <tr>
      <td>#${v.id}</td>
      <td>
        <strong>${v.brand} ${v.model}</strong><br/>
        <small style="color:var(--text-secondary)">${v.color || ''} · ${v.fuel_type}</small>
      </td>
      <td>${v.category}</td>
      <td>${v.year}</td>
      <td>${v.license_plate}</td>
      <td><strong>${formatCurrency(v.price_per_day)}</strong></td>
      <td>${badgeHtml(v.status)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editVehicle(${v.id})">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteVehicle(${v.id}, '${v.brand} ${v.model}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderTable(allVehicles.filter(v =>
    `${v.brand} ${v.model} ${v.license_plate} ${v.category} ${v.status}`.toLowerCase().includes(q)
  ));
}

// Modal
function openModal() {
  document.getElementById('modalTitle').textContent = 'Add Vehicle';
  document.getElementById('vehicleId').value = '';
  document.getElementById('vehicleForm').reset();
  document.getElementById('statusGroup').style.display = 'none';
  document.getElementById('year').value = new Date().getFullYear();
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function editVehicle(id) {
  const v = allVehicles.find(x => x.id === id);
  if (!v) return;
  document.getElementById('modalTitle').textContent = 'Edit Vehicle';
  document.getElementById('vehicleId').value = v.id;
  document.getElementById('brand').value = v.brand;
  document.getElementById('model').value = v.model;
  document.getElementById('category').value = v.category;
  document.getElementById('year').value = v.year;
  document.getElementById('license_plate').value = v.license_plate;
  document.getElementById('price_per_day').value = v.price_per_day;
  document.getElementById('color').value = v.color || '';
  document.getElementById('fuel_type').value = v.fuel_type;
  document.getElementById('seats').value = v.seats;
  document.getElementById('status').value = v.status;
  document.getElementById('statusGroup').style.display = 'flex';
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveVehicle() {
  const id = document.getElementById('vehicleId').value;
  const body = {
    brand:         document.getElementById('brand').value.trim(),
    model:         document.getElementById('model').value.trim(),
    category:      document.getElementById('category').value,
    year:          parseInt(document.getElementById('year').value),
    license_plate: document.getElementById('license_plate').value.trim().toUpperCase(),
    price_per_day: parseFloat(document.getElementById('price_per_day').value),
    color:         document.getElementById('color').value.trim(),
    fuel_type:     document.getElementById('fuel_type').value,
    seats:         parseInt(document.getElementById('seats').value),
    status:        document.getElementById('status').value || 'available',
  };
  if (!body.brand || !body.model || !body.license_plate || !body.price_per_day) {
    return showToast('Please fill all required fields', 'error');
  }
  try {
    if (id) {
      await apiFetch(`${API}/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Vehicle updated successfully!');
    } else {
      await apiFetch(`${API}/vehicles`, { method: 'POST', body: JSON.stringify(body) });
      showToast('Vehicle added successfully!');
    }
    closeModal();
    loadVehicles();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteVehicle(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    await apiFetch(`${API}/vehicles/${id}`, { method: 'DELETE' });
    showToast('Vehicle deleted.');
    loadVehicles();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Close on outside click
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

loadVehicles();
