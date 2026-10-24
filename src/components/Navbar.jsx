import React from 'react';
import { Store, LayoutGrid, Receipt, BarChart3, Boxes, Coffee, UtensilsCrossed, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, currentUser, onLogout }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Dinh nghia danh sach menu theo phan quyen
  // Neu la Staff: chi hien POS, So do ban, Lich su don. An hoan toan Bao cao, Kho hang, Quan ly mon.
  // Neu la Admin: hien toan bo menu bao gom Quan ly mon, Bao cao, Kho hang.
  const allNavItems = [
    { id: 'pos', label: 'Bán hàng (POS)', icon: Store, adminOnly: false },
    { id: 'tables', label: 'Sơ đồ bàn', icon: LayoutGrid, adminOnly: false },
    { id: 'orders', label: 'Lịch sử đơn', icon: Receipt, adminOnly: false },
    { id: 'menu', label: 'Quản lý món', icon: UtensilsCrossed, adminOnly: true },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, adminOnly: true },
    { id: 'inventory', label: 'Kho hàng', icon: Boxes, adminOnly: true },
  ];

  // Loc menu theo quyen thuc te
  const visibleNavItems = allNavItems.filter(item => !item.adminOnly || isAdmin);

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
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-roast)',
            color: 'var(--latte)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Coffee size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--primary-roast)',
              letterSpacing: '-0.3px'
            }}>
              Aroma Coffee
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>
              Hệ thống bán hàng & Quản lý quầy POS
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Chi hien nhung menu ma role co quyen xem */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-app)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          gap: 4
        }}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-white)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-roast)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={17} color={isActive ? 'var(--latte)' : 'currentColor'} />
                <span>{item.label}</span>

                {item.id === 'pos' && cartCount > 0 && (
                  <span style={{
                    backgroundColor: 'var(--caramel)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    marginLeft: 2
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Badge (Text that, khong dung emoji/icon trang tri) & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Badge text thuan tuy */}
          <div style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isAdmin ? 'var(--caramel-light)' : '#E0F2FE',
            border: isAdmin ? '1px solid rgba(198, 124, 78, 0.25)' : '1px solid #BAE6FD',
            fontSize: 13,
            fontWeight: 600,
            color: isAdmin ? 'var(--primary-roast)' : '#0369A1'
          }}>
            {isAdmin ? 'Quản trị viên' : 'Nhân viên thu ngân'}: <span style={{ fontWeight: 700 }}>{currentUser?.fullName && !currentUser.fullName.includes('?') ? currentUser.fullName : (isAdmin ? 'Quản trị viên' : 'Nhân viên thu ngân')}</span>
          </div>

          {/* Nut Dang xuat */}
          <button
            onClick={onLogout}
            title="Đăng xuất khỏi hệ thống"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
