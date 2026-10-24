import React from 'react';
import { DollarSign, ShoppingBag, Banknote, QrCode, TrendingUp, Award, RefreshCw } from 'lucide-react';

export default function ReportsView({ report, onRefresh }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (!report) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải báo cáo...</div>;
  }

  const statCards = [
    {
      title: 'Tổng doanh thu hôm nay',
      value: formatMoney(report.totalRevenue),
      subtitle: `${report.totalOrders} đơn hàng phát sinh`,
      icon: DollarSign,
      color: 'var(--caramel)',
      bg: 'var(--caramel-light)'
    },
    {
      title: 'Đơn hàng hoàn tất',
      value: `${report.completedOrders || report.totalOrders} đơn`,
      subtitle: `${report.cancelledOrders || 0} đơn đã hủy`,
      icon: ShoppingBag,
      color: 'var(--success)',
      bg: 'var(--success-bg)'
    },
    {
      title: 'Doanh thu Tiền mặt',
      value: formatMoney(report.cashRevenue),
      subtitle: 'Thanh toán trực tiếp tại quầy',
      icon: Banknote,
      color: '#15803D',
      bg: '#DCFCE7'
    },
    {
      title: 'Doanh thu Chuyển khoản QR',
      value: formatMoney(report.bankingRevenue),
      subtitle: 'Thanh toán qua quét mã ngân hàng',
      icon: QrCode,
      color: 'var(--info)',
      bg: 'var(--info-bg)'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--primary-roast)', margin: '0 0 4px' }}>
            Báo cáo doanh thu & Hiệu suất bán hàng
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Số liệu thống kê tự động cập nhật theo ca làm việc trong ngày
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff',
              border: '1px solid var(--border-light)',
              color: 'var(--primary-roast)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Làm mới số liệu
          </button>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 18,
        marginBottom: 28
      }}>
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '22px 20px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {c.title}
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-roast)', marginTop: 6 }}>
                  {c.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {c.subtitle}
                </div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: c.bg,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Selling Products Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <TrendingUp size={20} color="var(--caramel)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--primary-roast)' }}>
            Top đồ uống bán chạy nhất hôm nay
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, width: 80 }}>Thứ hạng</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Tên đồ uống</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>Số ly đã bán</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Doanh số</th>
              </tr>
            </thead>
            <tbody>
              {report.topSellingProducts && report.topSellingProducts.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#FEF08A' : idx === 1 ? '#E2E8F0' : idx === 2 ? '#FED7AA' : 'var(--bg-app)',
                      color: idx === 0 ? '#854D0E' : idx === 1 ? '#475569' : idx === 2 ? '#9A3412' : 'var(--text-secondary)',
                      fontSize: 12
                    }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {p.productName}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-app)',
                      fontWeight: 700,
                      color: 'var(--caramel)'
                    }}>
                      {p.quantitySold} ly
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--primary-roast)', fontSize: 15 }}>
                    {formatMoney(p.revenue)}
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
