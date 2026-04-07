export default function Kitchen({ orders }) {
  const cols = {
    new: { title: '🔴 New / Queued', id: 'new' },
    cooking: { title: '🟡 In Progress', id: 'cooking' },
    ready: { title: '🟢 Ready to Serve', id: 'ready' },
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Kitchen <span>Display</span></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Auto-refresh every 30s</span>
          <div className="status-dot"></div>
        </div>
      </div>
      <div className="kitchen-cols">
        {Object.entries(cols).map(([status, { title }]) => {
          const filtered = orders.filter(o => o.status === status);
          return (
            <div className="kitchen-col" key={status}>
              <h4>{title}</h4>
              {filtered.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: 20 }}>No tickets</div>
              ) : (
                filtered.map((o, i) => (
                  <div className={`ticket ${status === 'new' ? 'urgent' : ''}`} key={i}>
                    <div className="ticket-top">
                      <span className="ticket-table">Table {o.table}</span>
                      <span className="ticket-time">{o.time}</span>
                    </div>
                    <div className="ticket-items">
                      {o.items.map((it, j) => <span key={j}>• {it}<br /></span>)}
                    </div>
                    {o.notes && <div style={{ fontSize: 9, color: '#e57373', marginTop: 6 }}>⚠ {o.notes}</div>}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
