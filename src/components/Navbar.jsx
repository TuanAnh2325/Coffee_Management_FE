import React from 'react';
import { Store, LayoutGrid, Receipt, BarChart3, Boxes, Coffee, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount }) {
  const navItems = [
    { id: 'pos', label: 'Bán hàng (POS)', icon: Store },
    { id: 'tables', label: 'Sơ đồ bàn', icon: LayoutGrid },
    { id: 'orders', label: 'Lịch sử đơn', icon: Receipt },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'inventory', label: 'Kho hàng', icon: Boxes },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-roast)',
            color: 'var(--latte)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Coffee size={24} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--primary-roast)',
              letterSpacing: '-0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              Aroma Coffee <Sparkles size={16} color="var(--caramel)" />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              Hệ thống bán hàng & Quản lý quầy POS
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-app)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-white)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-roast)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  position: 'relative'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--latte)' : 'currentColor'} />
                {item.label}
                {item.id === 'pos' && cartCount > 0 && (
                  <span style={{
                    backgroundColor: 'var(--caramel)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    marginLeft: 4
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cashier Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--caramel-light)',
            border: '1px solid rgba(198, 124, 78, 0.2)'
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--success)'
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--caramel)' }}>
              Đang mở ca • Ca sáng
            </span>
          </div>

          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            Thu ngân: <span style={{ color: 'var(--caramel)' }}>Nguyễn Văn Thu Ngân</span>
          </div>
        </div>
      </div>
    </header>
  );
}
