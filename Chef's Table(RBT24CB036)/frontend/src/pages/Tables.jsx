import { useToast } from '../context/ToastContext';

export default function Tables({ tables, setTables }) {
  const toast = useToast();

  function toggleTable(i) {
    const cycle = ['vacant', 'occupied', 'reserved', 'dirty'];
    const updated = [...tables];
    const t = { ...updated[i] };
    t.status = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
    updated[i] = t;
    setTables(updated);
    const labels = { occupied: 'Occupied', vacant: 'Vacant', reserved: 'Reserved', dirty: 'Needs Cleaning' };
    toast(`Table ${t.id} → ${labels[t.status]}`);
  }

  const statusColors = {
    vacant: 'var(--muted)',
    occupied: 'var(--gold)',
    reserved: 'var(--info)',
    dirty: 'var(--danger)',
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Floor <span>Plan</span></div>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--surface3)' }}></div>Vacant</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(201,168,76,0.4)' }}></div>Occupied</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(91,155,213,0.4)' }}></div>Reserved</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(192,57,43,0.3)' }}></div>Needs Cleaning</div>
        </div>
      </div>
      <div className="card">
        <h3>Main Dining Room — 18 Tables</h3>
        <div className="floor-grid">
          {tables.map((t, i) => (
            <div
              key={t.id}
              className={`table-tile ${t.status}`}
              onClick={() => toggleTable(i)}
            >
              <div className="tnum">{t.id}</div>
              <div className="tcap">{t.cap} pax</div>
              <div className="table-dot" style={{ background: statusColors[t.status] }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
