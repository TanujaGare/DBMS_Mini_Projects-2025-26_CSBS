export default function Modal({ id, isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-bg open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
