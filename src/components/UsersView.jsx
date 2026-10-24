import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Users, Search, Shield, ShieldCheck, UserCheck, UserX, Phone, Mail, Lock } from 'lucide-react';

export default function UsersView({
  users = [],
  loading = false,
  onAddUser,
  onUpdateUser,
  onToggleStatus,
  onDeleteUser,
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('ROLE_STAFF');
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Counters
  const totalCount = users.length;
  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = totalCount - activeCount;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchSearch =
      (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').includes(searchTerm);

    const matchRole =
      roleFilter === 'ALL' || u.roleName === roleFilter;

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'INACTIVE' && !u.isActive);

    return matchSearch && matchRole && matchStatus;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setFullName('');
    setPhone('');
    setEmail('');
    setRoleName('ROLE_STAFF');
    setIsActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setUsername(user.username || '');
    setPassword('');
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setRoleName(user.roleName || 'ROLE_STAFF');
    setIsActive(user.isActive !== false);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editingUser) {
      if (!username.trim()) {
        setError('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (!password.trim()) {
        setError('Vui lòng nhập mật khẩu');
        return;
      }
    }
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên nhân viên');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        roleName,
        isActive
      };

      if (!editingUser) {
        payload.username = username.trim().toLowerCase();
        payload.password = password.trim();
        await onAddUser(payload);
      } else {
        if (password.trim()) {
          payload.password = password.trim();
        }
        await onUpdateUser(editingUser.id, payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--primary-roast)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <Users size={26} color="var(--caramel)" /> Quản lý nhân viên
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
            Quản lý tài khoản, phân quyền và trạng thái hoạt động của nhân viên
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            backgroundColor: 'var(--primary-roast)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(36, 20, 13, 0.15)'
          }}
        >
          <Plus size={18} /> Thêm nhân viên mới
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Tổng nhân sự
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary-roast)', marginTop: 4 }}>
            {totalCount}
          </div>
        </div>

        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
            Đang hoạt động
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803D', marginTop: 4 }}>
            {activeCount}
          </div>
        </div>

        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 12, color: '#991B1B', fontWeight: 600, textTransform: 'uppercase' }}>
            Đã khóa / Tạm dừng
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
            {inactiveCount}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          maxWidth: 360
        }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Tìm theo tên, tài khoản, SĐT..."
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
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
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
            <option value="ALL">Tất cả vai trò</option>
            <option value="ROLE_ADMIN">Quản trị viên</option>
            <option value="ROLE_STAFF">Nhân viên thu ngân</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ overflowX: 'auto' }}>
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
                <th style={{ padding: '14px 18px' }}>Nhân viên</th>
                <th style={{ padding: '14px 18px' }}>Tài khoản</th>
                <th style={{ padding: '14px 18px' }}>Vai trò</th>
                <th style={{ padding: '14px 18px' }}>Thông tin liên hệ</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy nhân viên nào phù hợp'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.roleName === 'ROLE_ADMIN';
                  const isCurrent = currentUser?.username === u.username;

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: isAdmin ? 'var(--primary-roast)' : 'var(--caramel)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 14
                          }}>
                            {(u.fullName || u.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {u.fullName} {isCurrent && <span style={{ fontSize: 11, color: 'var(--caramel)', fontWeight: 700 }}>(Bạn)</span>}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                              ID: #{u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td style={{ padding: '14px 18px' }}>
                        <code style={{
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: 'var(--primary-roast)'
                        }}>
                          {u.username}
                        </code>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '14px 18px' }}>
                        {isAdmin ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: '#FEF3C7',
                            color: '#92400E'
                          }}>
                            <ShieldCheck size={14} /> Quản trị viên
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: '#E0E7FF',
                            color: '#3730A3'
                          }}>
                            <Shield size={14} /> Thu ngân
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12 }}>
                          {u.phone ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                              <Phone size={13} color="var(--text-muted)" /> {u.phone}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có SĐT</span>
                          )}
                          {u.email && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                              <Mail size={13} color="var(--text-muted)" /> {u.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status & Quick Toggle */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(u.id, !u.isActive)}
                          disabled={u.username === 'admin'}
                          title={u.username === 'admin' ? 'Không thể khóa tài khoản quản trị chính' : 'Bấm để đổi trạng thái'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '5px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 12,
                            fontWeight: 600,
                            border: 'none',
                            cursor: u.username === 'admin' ? 'not-allowed' : 'pointer',
                            backgroundColor: u.isActive ? '#DCFCE7' : '#FEE2E2',
                            color: u.isActive ? '#15803D' : '#B91C1C',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {u.isActive ? (
                            <>
                              <UserCheck size={14} /> Đang hoạt động
                            </>
                          ) : (
                            <>
                              <UserX size={14} /> Đã khóa
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(u)}
                            title="Chỉnh sửa thông tin"
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)',
                              backgroundColor: '#fff',
                              color: 'var(--primary-roast)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 12.5,
                              fontWeight: 500
                            }}
                          >
                            <Edit2 size={14} /> Sửa
                          </button>

                          {u.username !== 'admin' && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${u.fullName}" (${u.username}) không?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              title="Xóa nhân viên"
                              style={{
                                padding: '6px 8px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid #FECACA',
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(36, 20, 13, 0.55)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 16
        }}>
          <div className="animate-scale-in" style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-xl)',
            maxWidth: 480,
            width: '100%',
            padding: '24px 24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
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
                color: 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--primary-roast)',
              marginBottom: 16
            }}>
              {editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
            </h3>

            {error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Username */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                  Tên đăng nhập <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: staff01, thu_ngan..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!editingUser}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    backgroundColor: editingUser ? 'var(--bg-app)' : '#fff',
                    outline: 'none'
                  }}
                />
                {editingUser && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Tên đăng nhập không thể thay đổi sau khi tạo
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                  Mật khẩu {editingUser ? '(để trống nếu không đổi)' : <span style={{ color: 'red' }}>*</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 11 }} />
                  <input
                    type="password"
                    placeholder={editingUser ? 'Nhập mật khẩu mới nếu muốn đổi' : 'Nhập mật khẩu đăng nhập...'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                  Họ và tên <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                  Vai trò phân quyền
                </label>
                <select
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  disabled={editingUser?.username === 'admin'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    backgroundColor: editingUser?.username === 'admin' ? 'var(--bg-app)' : '#fff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ROLE_STAFF">Nhân viên thu ngân (ROLE_STAFF)</option>
                  <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                </select>
              </div>

              {/* Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 5 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                marginTop: 4
              }}>
                <input
                  type="checkbox"
                  id="userStatusCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={editingUser?.username === 'admin'}
                  style={{ width: 17, height: 17, cursor: 'pointer' }}
                />
                <label htmlFor="userStatusCheck" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Kích hoạt tài khoản (Đang hoạt động)
                </label>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'var(--caramel)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(198, 124, 78, 0.3)'
                  }}
                >
                  {submitting ? 'Đang lưu...' : (editingUser ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
