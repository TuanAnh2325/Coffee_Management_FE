import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 200,
        backgroundColor: isSuccess ? 'var(--primary-roast)' : 'var(--danger)',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 400
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} color="var(--latte)" /> : <AlertCircle size={18} />}
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{ color: '#fff', opacity: 0.7, marginLeft: 8, padding: 2 }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
