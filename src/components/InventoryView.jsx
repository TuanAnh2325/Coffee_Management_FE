import React, { useState } from 'react';
import { Boxes, AlertTriangle, CheckCircle, Package, Edit, X } from 'lucide-react';

export default function InventoryView({ inventory, onUpdateStock }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setNewQuantity(String(item.quantityInStock));
    setError('');
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (newQuantity === '' || Number(newQuantity) < 0) {
      setError('Số lượng tồn kho không được âm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpdateStock(selectedItem.productId, Number(newQuantity));
      setSelectedItem(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật kho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--primary-roast)', margin: '0 0 4px' }}>
          Quản lý tồn kho sản phẩm & nguyên vật liệu
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          Theo dõi số lượng tồn, cập nhật nhập kho và tự động trừ khi hoàn thành đơn bán
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Tên mặt hàng / Đồ uống</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Số lượng tồn</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Ngưỡng tối thiểu</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Đơn vị tính</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Trạng thái kho</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, idx) => {
                const isWarning = item.status === 'SAP_HET' || item.quantityInStock <= item.minStockThreshold;

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-app)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--caramel)'
                        }}>
                          <Package size={18} />
                        </div>
                        {item.productName}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, fontSize: 15, color: isWarning ? 'var(--danger)' : 'var(--primary-roast)' }}>
                      {item.quantityInStock}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {item.minStockThreshold}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>
                      {item.unit}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 12,
                        fontWeight: 700,
                        backgroundColor: isWarning ? '#FEF2F2' : '#ECFDF5',
                        color: isWarning ? '#DC2626' : '#059669'
                      }}>
                        {isWarning ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
                        {isWarning ? 'Sắp hết hàng' : 'Đầy đủ'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--primary-roast)',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={14} /> Nhập kho
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cập nhật tồn kho */}
      {selectedItem && (
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
            maxWidth: 420,
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)'
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--primary-roast)' }}>
                Cập nhật tồn kho / Nhập thêm hàng
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStock} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && (
                <div style={{
                  padding: '10px 12px',
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
                <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Mặt hàng
                </label>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedItem.productName}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Số lượng tồn mới ({selectedItem.unit}) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 15,
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#fff',
                    color: 'var(--text-secondary)',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-roast)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Lưu tồn kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
