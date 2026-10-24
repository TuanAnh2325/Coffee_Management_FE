import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, CheckCircle2, Coffee, Clock, X } from 'lucide-react';

export default function TablesView({ tables, onUpdateStatus, onCreateTable, onUpdateTable, onDeleteTable, isAdmin }) {
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Form state
  const [tableNumber, setTableNumber] = useState('');
  const [area, setArea] = useState('Tầng 1 (Trong nhà)');
  const [capacity, setCapacity] = useState('4');
  const [status, setStatus] = useState('EMPTY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const areas = ['ALL', 'Tầng 1 (Trong nhà)', 'Tầng 2 (Máy lạnh)', 'Sân vườn ngoài trời'];

  const filteredTables = tables.filter(t => {
    if (areaFilter === 'ALL') return true;
    return t.area?.includes(areaFilter) || t.area === areaFilter;
  });

  const getStatusBadge = (tableStatus) => {
    switch (tableStatus) {
      case 'SERVING':
        return { label: 'Đang có khách', bg: 'var(--caramel-light)', color: 'var(--caramel)', icon: Coffee };
      case 'RESERVED':
        return { label: 'Đã đặt trước', bg: 'var(--info-bg)', color: 'var(--info)', icon: Clock };
      default:
        return { label: 'Bàn trống', bg: 'var(--success-bg)', color: 'var(--success)', icon: CheckCircle2 };
    }
  };

  const handleOpenAddModal = () => {
    setEditingTable(null);
    setTableNumber('');
    setArea('Tầng 1 (Trong nhà)');
    setCapacity('4');
    setStatus('EMPTY');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (table) => {
    setEditingTable(table);
    setTableNumber(table.tableNumber);
    setArea(table.area || 'Tầng 1 (Trong nhà)');
    setCapacity(String(table.capacity || 4));
    setStatus(table.status || 'EMPTY');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setError('Vui lòng nhập số hiệu hoặc tên bàn');
      return;
    }
    if (!capacity || Number(capacity) <= 0) {
      setError('Sức chứa của bàn phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        tableNumber: tableNumber.trim(),
        area: area.trim(),
        capacity: Number(capacity),
        status: status
      };

      if (editingTable) {
        await onUpdateTable(editingTable.id, payload);
      } else {
        await onCreateTable(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thông tin bàn');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${table.tableNumber}? Khách hàng và nhân viên sẽ không thể chọn bàn này nữa.`)) {
      try {
        await onDeleteTable(table.id);
      } catch (err) {
        alert(err.message || 'Không thể xóa bàn này');
      }
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
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--primary-roast)', margin: '0 0 4px' }}>
            Sơ đồ bàn phục vụ
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Quản lý sơ đồ vị trí, theo dõi trạng thái và phân bổ chỗ ngồi cho khách
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Filter buttons */}
          <div style={{
            display: 'flex',
            gap: 6,
            backgroundColor: '#fff',
            padding: 4,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            {areas.map(a => (
              <button
                key={a}
                onClick={() => setAreaFilter(a)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  backgroundColor: areaFilter === a ? 'var(--primary-roast)' : 'transparent',
                  color: areaFilter === a ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {a === 'ALL' ? 'Tất cả khu vực' : a}
              </button>
            ))}
          </div>

          {/* Admin Create Table Button */}
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-roast)',
                color: '#fff',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Plus size={18} /> Thêm bàn mới
            </button>
          )}
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
              style={{
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-roast)', margin: '0 0 3px' }}>
                    {t.tableNumber}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
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
                justifyContent: 'space-between',
                fontSize: 13,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-app)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={16} color="var(--caramel)" />
                  <span>Sức chứa: <strong>{t.capacity} khách</strong></span>
                </div>

                {/* Admin Quick Action (Edit & Delete) */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      title="Sửa thông tin bàn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 2
                      }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      title="Xóa bàn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: 2
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
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
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
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
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
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
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  Đặt trước
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTables.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          color: 'var(--text-muted)'
        }}>
          Không có bàn nào trong khu vực này.
        </div>
      )}

      {/* Modal Thêm / Sửa bàn */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 16
        }}>
          <div style={{
            width: '100%',
            maxWidth: 460,
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)'
            }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--primary-roast)' }}>
                {editingTable ? 'Cập nhật thông tin bàn' : 'Thêm bàn mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  fontSize: 13
                }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Số hiệu bàn / Tên bàn *
                </label>
                <input
                  type="text"
                  placeholder="VD: Bàn 01, VIP 01, Sân vườn 1..."
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                    Khu vực đặt bàn
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      backgroundColor: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Tầng 1 (Trong nhà)">Tầng 1 (Trong nhà)</option>
                    <option value="Tầng 2 (Máy lạnh)">Tầng 2 (Máy lạnh)</option>
                    <option value="Sân vườn ngoài trời">Sân vườn ngoài trời</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                    Sức chứa (khách) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="4"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Trạng thái ban đầu
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    backgroundColor: '#fff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="EMPTY">Bàn trống</option>
                  <option value="SERVING">Đang có khách</option>
                  <option value="RESERVED">Đã đặt trước</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#fff',
                    color: 'var(--text-secondary)',
                    fontSize: 13.5,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-roast)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Đang lưu...' : (editingTable ? 'Cập nhật bàn' : 'Tạo bàn mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
