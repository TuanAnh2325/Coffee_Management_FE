import React from 'react';
import { X, CheckCircle, Printer, Coffee } from 'lucide-react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(36, 20, 13, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: 440,
        width: '100%',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-light)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <X size={18} />
        </button>

        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10
          }}>
            <CheckCircle size={30} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>
            Thanh toán thành công!
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Mã hóa đơn: <strong style={{ color: 'var(--caramel)' }}>{order.orderCode}</strong>
          </p>
        </div>

        {/* Receipt Box */}
        <div style={{
          backgroundColor: '#FCFAF7',
          border: '1px dashed var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 16px',
          fontSize: 13,
          color: 'var(--text-main)',
          marginBottom: 20
        }}>
          <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-light)', paddingBottom: 12, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary-roast)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Coffee size={18} color="var(--caramel)" /> AROMA COFFEE SHOP
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              123 Đường Cà Phê, Quận 1, TP. Hồ Chí Minh
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Hotline: 1900 6868 • Wifi: AromaCoffee / Pass: 88888888
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>Thời gian:</span>
            <span>{order.createdAt || new Date().toLocaleString('vi-VN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>Hình thức:</span>
            <span style={{ fontWeight: 600 }}>{order.orderType === 'TAKE_AWAY' ? 'Mang về' : `Tại bàn (${order.tableName || 'Bàn ' + (order.tableId || '01')})`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Thanh toán:</span>
            <span style={{ fontWeight: 600 }}>{order.paymentMethod === 'BANKING' ? 'Chuyển khoản QR' : 'Tiền mặt'}</span>
          </div>

          {/* Items */}
          <div style={{ borderTop: '1px dashed var(--border-light)', borderBottom: '1px dashed var(--border-light)', padding: '10px 0', margin: '8px 0' }}>
            {order.items && order.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{it.productName || it.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Size {it.sizeName || it.size || 'M'} x {it.quantity} {it.itemNote ? `(${it.itemNote})` : ''}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  {formatMoney(it.subtotal || ((it.unitPrice || it.price || 0) * (it.quantity || 1)))}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-roast)' }}>TỔNG TIỀN:</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--caramel)' }}>
              {formatMoney(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--primary-roast)',
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid var(--border-light)'
            }}
          >
            <Printer size={18} /> In hóa đơn
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--caramel)',
              color: 'var(--text-white)',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(198, 124, 78, 0.3)'
            }}
          >
            Đóng & Tạo đơn mới
          </button>
        </div>
      </div>
    </div>
  );
}
