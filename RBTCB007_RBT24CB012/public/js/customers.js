/* customers.js */

let allCustomers = [];

async function loadCustomers() {
  try {
    allCustomers = await apiFetch(`${API}/customers`);
    renderTable(allCustomers);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderTable(customers) {
  const tbody = document.getElementById('customerBody');
  if (!customers.length) {
    tbody.innerHTML = emptyState('👤', 'No customers yet', 'Add your first customer to get started.');
    return;
  }
  tbody.innerHTML = customers.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${c.full_name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><code style="background:var(--bg-secondary);padding:3px 8px;border-radius:4px;">${c.license_number}</code></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.address || '—'}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editCustomer(${c.id})">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id}, '${c.full_name.replace(/'/g,"\\'")}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderTable(allCustomers.filter(c =>
    `${c.full_name} ${c.email} ${c.phone} ${c.license_number}`.toLowerCase().includes(q)
  ));
}

function openModal() {
  document.getElementById('modalTitle').textContent = 'Add Customer';
  document.getElementById('customerId').value = '';
  document.getElementById('customerForm').reset();
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function editCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modalTitle').textContent = 'Edit Customer';
  document.getElementById('customerId').value = c.id;
  document.getElementById('full_name').value = c.full_name;
  document.getElementById('email').value = c.email;
  document.getElementById('phone').value = c.phone;
  document.getElementById('license_number').value = c.license_number;
  document.getElementById('address').value = c.address || '';
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveCustomer() {
  const id = document.getElementById('customerId').value;
  const body = {
    full_name:      document.getElementById('full_name').value.trim(),
    email:          document.getElementById('email').value.trim(),
    phone:          document.getElementById('phone').value.trim(),
    license_number: document.getElementById('license_number').value.trim().toUpperCase(),
    address:        document.getElementById('address').value.trim(),
  };
  if (!body.full_name || !body.email || !body.phone || !body.license_number) {
    return showToast('Please fill all required fields', 'error');
  }
  try {
    if (id) {
      await apiFetch(`${API}/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Customer updated successfully!');
    } else {
      await apiFetch(`${API}/customers`, { method: 'POST', body: JSON.stringify(body) });
      showToast('Customer added successfully!');
    }
    closeModal();
    loadCustomers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteCustomer(id, name) {
  if (!confirm(`Delete customer "${name}"?`)) return;
  try {
    await apiFetch(`${API}/customers/${id}`, { method: 'DELETE' });
    showToast('Customer deleted.');
    loadCustomers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

loadCustomers();
