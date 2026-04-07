export function statusBadge(s) {
  const map = {
    new: ['badge-blue', 'New'],
    cooking: ['badge-gold', 'Cooking'],
    ready: ['badge-green', 'Ready'],
    served: ['badge-muted', 'Served'],
  };
  const [cls, label] = map[s] || ['badge-muted', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

export function StatusBadge({ status }) {
  const map = {
    new: ['badge-blue', 'New'],
    cooking: ['badge-gold', 'Cooking'],
    ready: ['badge-green', 'Ready'],
    served: ['badge-muted', 'Served'],
  };
  const [cls, label] = map[status] || ['badge-muted', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
