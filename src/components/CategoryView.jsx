import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, Tag } from 'lucide-react';

export default function CategoryView({ categories, products, onAddCategory, onUpdateCategory, onDeleteCategory }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCode('');
    setName('');
    setDescription('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setCode(cat.code || '');
    setName(cat.name || '');
    setDescription(cat.description || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Vui lòng nhập mã danh mục (ví dụ: COFFEE, TEA, JUICE)');
      return;
    }
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục hiển thị');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim()
      };

      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, payload);
      } else {
        await onAddCategory(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục '${cat.name}'? Lưu ý: Không thể xóa danh mục đang có món.`)) {
      try {
        await onDeleteCategory(cat.id);
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa danh mục');
      }
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* Top Header */}
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
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--primary-roast)',
            margin: '0 0 4px'
          }}>
            Quản lý danh mục thực đơn
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Quản lý, chỉnh sửa và tạo mới các nhóm đồ uống, bánh ngọt trên hệ thống
          </p>
        </div>

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
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} /> Thêm danh mục mới
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
      }}>
        {categories.map(cat => {
          const itemCount = products.filter(p => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--caramel-light)',
                    color: 'var(--caramel)',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.4px'
                  }}>
                    {cat.code}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      title="Sửa danh mục"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 4
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      title="Xóa danh mục"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: 4
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  {cat.name}
                </h3>

                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
                  {cat.description || 'Chưa có mô tả cho nhóm này'}
                </p>
              </div>

              <div style={{
                paddingTop: 14,
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                  Số món hiện có:
                </span>
                <span style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: 'var(--primary-roast)',
                  backgroundColor: 'var(--bg-app)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)'
                }}>
                  {itemCount} món
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          color: 'var(--text-muted)'
        }}>
          Chưa có danh mục nào. Bấm vào "Thêm danh mục mới" để bắt đầu.
        </div>
      )}

      {/* Modal Thêm / Sửa danh mục */}
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
            maxWidth: 480,
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
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục thực đơn mới'}
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
                  Mã danh mục *
                </label>
                <input
                  type="text"
                  placeholder="VD: JUICE, SNACK, CAKE..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  placeholder="VD: Nước ép hoa quả tươi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt về nhóm sản phẩm này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
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
                  {loading ? 'Đang lưu...' : (editingCategory ? 'Lưu cập nhật' : 'Lưu danh mục')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
