import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Banknote, QrCode, TrendingUp, Calendar, RefreshCw, BarChart2 } from 'lucide-react';
import api from '../services/api';

export default function ReportsView({ report: initialTodayReport, onRefresh }) {
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'month'

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const [todayReport, setTodayReport] = useState(initialTodayReport);
  const [monthReport, setMonthReport] = useState(null);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTodayReport(initialTodayReport);
  }, [initialTodayReport]);

  const loadMonthReport = async (y = selectedYear, m = selectedMonth) => {
    try {
      setLoadingMonth(true);
      const data = await api.getMonthReport(y, m);
      setMonthReport(data);
    } catch (err) {
      console.error('Failed to load month report:', err);
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'month') {
      loadMonthReport(selectedYear, selectedMonth);
    }
  }, [viewMode, selectedYear, selectedMonth]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (viewMode === 'today') {
      if (onRefresh) await onRefresh();
    } else {
      await loadMonthReport(selectedYear, selectedMonth);
    }
    setRefreshing(false);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const activeReport = viewMode === 'today' ? todayReport : monthReport;

  // Max daily revenue in month for relative bar calculation
  const maxDailyRevenue = monthReport?.dailyStats?.reduce((max, d) => {
    const rev = Number(d.revenue) || 0;
    return rev > max ? rev : max;
  }, 0) || 1;

  const statCards = activeReport ? [
    {
      title: viewMode === 'today' ? 'Tổng doanh thu hôm nay' : `Tổng doanh thu ${activeReport.monthLabel || ''}`,
      value: formatMoney(activeReport.totalRevenue),
      subtitle: `${activeReport.totalOrders || 0} đơn hàng phát sinh`,
      icon: DollarSign,
      color: 'var(--caramel)',
      bg: 'var(--caramel-light)'
    },
    {
      title: 'Đơn hàng hoàn tất',
      value: `${activeReport.completedOrders || activeReport.totalOrders || 0} đơn`,
      subtitle: `${activeReport.cancelledOrders || 0} đơn đã hủy`,
      icon: ShoppingBag,
      color: 'var(--success)',
      bg: 'var(--success-bg)'
    },
    {
      title: 'Doanh thu Tiền mặt',
      value: formatMoney(activeReport.cashRevenue),
      subtitle: 'Thanh toán trực tiếp tại quầy',
      icon: Banknote,
      color: '#15803D',
      bg: '#DCFCE7'
    },
    {
      title: 'Doanh thu Chuyển khoản QR',
      value: formatMoney(activeReport.bankingRevenue),
      subtitle: 'Thanh toán qua quét mã ngân hàng',
      icon: QrCode,
      color: 'var(--info)',
      bg: 'var(--info-bg)'
    }
  ] : [];

  return (
    <div className="page-container">
      {/* Top Header & Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--primary-roast)', margin: '0 0 4px' }}>
            Báo cáo doanh thu & Hiệu suất bán hàng
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {viewMode === 'today'
              ? 'Số liệu thống kê tự động cập nhật theo ca làm việc trong ngày'
              : `Thống kê chi tiết doanh số bán hàng trong ${activeReport?.monthLabel || 'tháng'}`}
          </p>
        </div>

        {/* View Mode Toggle & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Switch Today / Month */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 4,
            border: '1px solid var(--border-light)'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('today')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'today' ? 'var(--primary-roast)' : 'transparent',
                color: viewMode === 'today' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'month' ? 'var(--primary-roast)' : 'transparent',
                color: viewMode === 'month' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Theo tháng
            </button>
          </div>

          {/* Month Selectors (shown when in month mode) */}
          {viewMode === 'month' && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map((y) => (
                  <option key={y} value={y}>Năm {y}</option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loadingMonth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff',
              border: '1px solid var(--border-light)',
              color: 'var(--primary-roast)',
              fontSize: 13,
              fontWeight: 600,
              cursor: (refreshing || loadingMonth) ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={refreshing || loadingMonth ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {loadingMonth && viewMode === 'month' ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 15 }}>
          Đang tải dữ liệu báo cáo tháng...
        </div>
      ) : !activeReport ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 15 }}>
          Không có dữ liệu báo cáo
        </div>
      ) : (
        <>
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

          {/* Daily Revenue Breakdown (only in Month mode) */}
          {viewMode === 'month' && activeReport.dailyStats && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              padding: '24px',
              marginBottom: 28
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <BarChart2 size={20} color="var(--caramel)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--primary-roast)', margin: 0 }}>
                  Doanh số theo từng ngày trong {activeReport.monthLabel}
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 12
              }}>
                {activeReport.dailyStats.map((d) => {
                  const hasSales = Number(d.revenue) > 0;
                  const percent = maxDailyRevenue > 0 ? Math.round((Number(d.revenue) / maxDailyRevenue) * 100) : 0;

                  return (
                    <div
                      key={d.day}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: hasSales ? '#FFFDF9' : 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 8,
                        transition: 'transform 0.15s ease',
                        borderLeft: hasSales ? '3px solid var(--caramel)' : '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary-roast)' }}>
                          Ngày {d.day}
                        </span>
                        {hasSales && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--caramel)', backgroundColor: 'var(--caramel-light)', padding: '1px 6px', borderRadius: 4 }}>
                            {d.orderCount} đơn
                          </span>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: hasSales ? 'var(--primary-roast)' : 'var(--text-muted)' }}>
                          {formatMoney(d.revenue)}
                        </div>
                        {hasSales && (
                          <div style={{
                            width: '100%',
                            height: 4,
                            backgroundColor: 'var(--border-light)',
                            borderRadius: 2,
                            marginTop: 6,
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percent}%`,
                              height: '100%',
                              backgroundColor: 'var(--caramel)',
                              borderRadius: 2
                            }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--primary-roast)', margin: 0 }}>
                {viewMode === 'today' ? 'Top đồ uống bán chạy nhất hôm nay' : `Top đồ uống bán chạy nhất ${activeReport.monthLabel || 'trong tháng'}`}
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
                  {(!activeReport.topSellingProducts || activeReport.topSellingProducts.length === 0) ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                        Chưa có sản phẩm nào bán ra trong kỳ báo cáo này
                      </td>
                    </tr>
                  ) : (
                    activeReport.topSellingProducts.map((p, idx) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
