import React from 'react';
import { Store, LayoutGrid, Receipt, UtensilsCrossed, FolderTree, BarChart3, Boxes, Coffee, LogOut } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, cartCount, currentUser, onLogout }) {
  const navItems = [
    { id: 'pos', label: 'Bán hàng (POS)', icon: Store },
    { id: 'tables', label: 'Sơ đồ bàn', icon: LayoutGrid },
    { id: 'orders', label: 'Lịch sử đơn', icon: Receipt },
    { id: 'menu', label: 'Quản lý thực đơn', icon: UtensilsCrossed },
    { id: 'categories', label: 'Quản lý danh mục', icon: FolderTree },
    { id: 'reports', label: 'Báo cáo doanh thu', icon: BarChart3 },
    { id: 'inventory', label: 'Quản lý kho hàng', icon: Boxes },
  ];

  return (
    <aside style={{
      width: 250,
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      boxShadow: 'var(--shadow-sm)',
      zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--primary-roast)',
          color: 'var(--latte)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Coffee size={22} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--primary-roast)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2
          }}>
            Aroma Coffee
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>
            Hệ thống quản lý quán
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          padding: '4px 10px 8px'
        }}>
          Menu quản lý
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-white)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-roast)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} color={isActive ? 'var(--latte)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>

              {item.id === 'pos' && cartCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--caramel)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Profile & Logout */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#fff',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Quản trị viên
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
            {currentUser?.fullName || currentUser?.username}
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
