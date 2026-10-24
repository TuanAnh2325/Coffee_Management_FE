import React from 'react';
import { Receipt, Coffee, ShoppingBag, Eye, Calendar, CreditCard, Banknote, QrCode } from 'lucide-react';

export default function OrdersView({ orders, onViewReceipt }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--primary-roast)' }}>
          Lịch sử hóa đơn bán hàng
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Danh sách các đơn hàng đã tạo và thanh toán trong ca
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)' }}>Mã hóa đơn</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)' }}>Thời gian</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)' }}>Hình thức / Bàn</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)' }}>Thanh toán</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)', textAlign: 'right' }}>Tổng tiền</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary-roast)', textAlign: 'center' }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr
                  key={ord.id}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--caramel)' }}>
                    {ord.orderCode}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {ord.createdAt}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: ord.orderType === 'TAKE_AWAY' ? 'var(--bg-app)' : 'var(--caramel-light)',
                      color: ord.orderType === 'TAKE_AWAY' ? 'var(--text-secondary)' : 'var(--caramel)'
                    }}>
                      {ord.orderType === 'TAKE_AWAY' ? <ShoppingBag size={12} /> : <Coffee size={12} />}
                      {ord.orderType === 'TAKE_AWAY' ? 'Mang về' : (ord.tableName || `Bàn ${ord.tableId || '01'}`)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      {ord.paymentMethod === 'BANKING' ? (
                        <span style={{ color: 'var(--info)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <QrCode size={15} /> Chuyển khoản
                        </span>
                      ) : (
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Banknote size={15} /> Tiền mặt
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, fontSize: 15, color: 'var(--primary-roast)' }}>
                    {formatMoney(ord.totalAmount)}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <button
                      onClick={() => onViewReceipt(ord)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--caramel)',
                        fontSize: 12.5,
                        fontWeight: 600,
                        border: '1px solid var(--border-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Eye size={14} /> Xem bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
