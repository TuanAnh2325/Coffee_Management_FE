import React, { useState } from 'react';
import { Receipt, Coffee, ShoppingBag, Eye, Calendar, CreditCard, Banknote, QrCode, Search, Filter } from 'lucide-react';

export default function OrdersView({ orders = [], onViewReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDateTime = (timeStr) => {
    if (!timeStr) return '--:--';
    try {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {}
    return timeStr;
  };

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    const matchSearch =
      (ord.orderCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.tableName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchType =
      orderTypeFilter === 'ALL' || ord.orderType === orderTypeFilter;

    const matchPayment =
      paymentFilter === 'ALL' || ord.paymentMethod === paymentFilter;

    return matchSearch && matchType && matchPayment;
  });

  // Calculate summary stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
  const dineInCount = orders.filter(ord => ord.orderType === 'DINE_IN').length;
  const takeAwayCount = orders.filter(ord => ord.orderType === 'TAKE_AWAY').length;

  return (
    <div className="page-container">
      {/* Page Title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--primary-roast)',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <Receipt size={26} color="var(--caramel)" /> Lịch sử hóa đơn bán hàng
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Danh sách các đơn hàng đã tạo và thanh toán trong ca
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Tổng số hóa đơn
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-roast)', marginTop: 4 }}>
            {totalOrders} đơn
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Tổng tiền thu được
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--caramel)', marginTop: 4 }}>
            {formatMoney(totalRevenue)}
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Phục vụ tại bàn
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-roast)', marginTop: 4 }}>
            {dineInCount} đơn
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Mang về (Take-away)
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-roast)', marginTop: 4 }}>
            {takeAwayCount} đơn
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        border: '1px solid var(--border-light)',
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn, tên bàn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: 13.5,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <select
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: 13,
              backgroundColor: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="DINE_IN">Tại bàn</option>
            <option value="TAKE_AWAY">Mang về</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: 13,
              backgroundColor: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value="CASH">Tiền mặt</option>
            <option value="BANKING">Chuyển khoản QR</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div className="responsive-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-app)',
                borderBottom: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: 12.5,
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                <th style={{ padding: '14px 18px' }}>Mã hóa đơn</th>
                <th style={{ padding: '14px 18px' }}>Thời gian tạo</th>
                <th style={{ padding: '14px 18px' }}>Hình thức / Bàn</th>
                <th style={{ padding: '14px 18px' }}>Thanh toán</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Tổng tiền</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    Không có đơn hàng nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <code style={{
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: 'var(--caramel)'
                      }}>
                        {ord.orderCode}
                      </code>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {formatDateTime(ord.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: ord.orderType === 'TAKE_AWAY' ? '#F3F4F6' : 'var(--caramel-light)',
                        color: ord.orderType === 'TAKE_AWAY' ? '#4B5563' : 'var(--caramel)'
                      }}>
                        {ord.orderType === 'TAKE_AWAY' ? <ShoppingBag size={13} /> : <Coffee size={13} />}
                        {ord.orderType === 'TAKE_AWAY' ? 'Mang về' : (ord.tableName || `Bàn ${ord.tableId || '01'}`)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        {ord.paymentMethod === 'BANKING' ? (
                          <span style={{
                            color: '#1D4ED8',
                            backgroundColor: '#DBEAFE',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12
                          }}>
                            <QrCode size={13} /> Chuyển khoản QR
                          </span>
                        ) : (
                          <span style={{
                            color: '#15803D',
                            backgroundColor: '#DCFCE7',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12
                          }}>
                            <Banknote size={13} /> Tiền mặt
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
                        type="button"
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#fff',
                          color: 'var(--primary-roast)',
                          fontSize: 12.5,
                          fontWeight: 600,
                          border: '1px solid var(--border-light)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={14} color="var(--caramel)" /> Xem bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
