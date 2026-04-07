import { statusBadge } from '../utils';

export default function Dashboard({ orders, reservations, inventory, tables }) {
  const revenue = orders.filter(o => o.status === 'served').reduce((a, b) => a + b.total, 0) + 24680;
  const active = orders.filter(o => o.status !== 'served').length;
  const occ = tables.filter(t => t.status === 'occupied').length;

  const hours = ['6p', '7p', '8p', '9p', '10p', '11p'];
  const vals = [8400, 15200, 22800, 18600, 12400, 6200];
  const max = Math.max(...vals);

  const low = inventory.filter(i => i.qty <= i.min);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">₹{(revenue + active * 200).toLocaleString('en-IN')}</div>
          <div className="stat-sub">↑ 12% vs yesterday</div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Orders</div>
          <div className="stat-value">{active}</div>
          <div className="stat-sub">{orders.filter(o => o.status === 'new').length} pending</div>
          <div className="stat-icon">🧾</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Covers Today</div>
          <div className="stat-value">{84 + active * 2}</div>
          <div className="stat-sub">guests served</div>
          <div className="stat-icon">🍽️</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tables Occupied</div>
          <div className="stat-value">{occ} / 18</div>
          <div className="stat-sub">{Math.round(occ / 18 * 100)}% occupancy</div>
          <div className="stat-icon">◫</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Hourly Revenue</h3>
          <div className="mini-chart">
            {vals.map((v, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{
                  height: `${(v / max * 100)}%`,
                  background: 'linear-gradient(180deg,var(--gold),var(--gold-dim))',
                  opacity: i === 2 ? 1 : 0.5,
                }}
              />
            ))}
          </div>
          <div className="chart-labels">
            {hours.map(h => <div key={h} className="chart-label">{h}</div>)}
          </div>
        </div>
        <div className="card">
          <h3>Recent Orders</h3>
          <table style={{ margin: -4 }}>
            <thead><tr><th>Table</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map((o, i) => (
                <tr key={i}>
                  <td>#T{o.table}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 11 }}>
                    {o.items.slice(0, 2).join(', ')}{o.items.length > 2 ? '…' : ''}
                  </td>
                  <td>₹{o.total}</td>
                  <td dangerouslySetInnerHTML={{ __html: statusBadge(o.status) }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-col mt-24">
        <div className="card">
          <h3>Today's Reservations</h3>
          <div>
            {reservations.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span>{r.name}</span>
                <span style={{ color: 'var(--muted)' }}>{r.time} · {r.guests} guests</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Low Stock Alerts</h3>
          <div>
            {low.length === 0 ? (
              <p style={{ color: 'var(--success)', fontSize: 12 }}>✓ All stock levels adequate</p>
            ) : (
              low.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                  <span style={{ color: '#e57373' }}>⚠ {item.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{item.qty} {item.unit} (min {item.min})</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
