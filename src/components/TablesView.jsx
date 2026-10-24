import React, { useState } from 'react';
import { Users, CheckCircle2, Coffee, Clock } from 'lucide-react';

export default function TablesView({ tables, onUpdateStatus }) {
  const [areaFilter, setAreaFilter] = useState('ALL');

  const areas = ['ALL', 'Tầng 1 (Trong nhà)', 'Tầng 2 (Máy lạnh)', 'Sân vườn ngoài trời'];

  const filteredTables = tables.filter(t => {
    if (areaFilter === 'ALL') return true;
    return t.area.includes(areaFilter) || t.area === areaFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SERVING':
        return { label: 'Đang có khách', bg: 'var(--caramel-light)', color: 'var(--caramel)', icon: Coffee };
      case 'RESERVED':
        return { label: 'Đã đặt trước', bg: 'var(--info-bg)', color: 'var(--info)', icon: Clock };
      default:
        return { label: 'Bàn trống', bg: 'var(--success-bg)', color: 'var(--success)', icon: CheckCircle2 };
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* Header & Area Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--primary-roast)' }}>
            Sơ đồ bàn phục vụ
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Theo dõi trạng thái và phân bổ chỗ ngồi cho khách tại quán
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{
          display: 'flex',
          gap: 8,
          backgroundColor: 'var(--bg-surface)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          {areas.map(a => (
            <button
              key={a}
              onClick={() => setAreaFilter(a)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: areaFilter === a ? 'var(--primary-roast)' : 'transparent',
                color: areaFilter === a ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {a === 'ALL' ? 'Tất cả khu vực' : a}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tables */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20
      }}>
        {filteredTables.map(t => {
          const badge = getStatusBadge(t.status);
          const Icon = badge.icon;

          return (
            <div
              key={t.id}
              className="animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-roast)' }}>
                    {t.tableNumber}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {t.area}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  backgroundColor: badge.bg,
                  color: badge.color
                }}>
                  <Icon size={13} />
                  {badge.label}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-app)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)'
              }}>
                <Users size={16} color="var(--caramel)" />
                Sức chứa tối đa: <strong>{t.capacity} khách</strong>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                <button
                  onClick={() => onUpdateStatus(t.id, 'EMPTY')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    backgroundColor: t.status === 'EMPTY' ? 'var(--success)' : 'var(--bg-app)',
                    color: t.status === 'EMPTY' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  Bàn trống
                </button>
                <button
                  onClick={() => onUpdateStatus(t.id, 'SERVING')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    backgroundColor: t.status === 'SERVING' ? 'var(--caramel)' : 'var(--bg-app)',
                    color: t.status === 'SERVING' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  Có khách
                </button>
                <button
                  onClick={() => onUpdateStatus(t.id, 'RESERVED')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    backgroundColor: t.status === 'RESERVED' ? 'var(--info)' : 'var(--bg-app)',
                    color: t.status === 'RESERVED' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  Đặt trước
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
