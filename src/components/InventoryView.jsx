import React from 'react';
import { Boxes, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export default function InventoryView({ inventory }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--primary-roast)' }}>
          Quản lý tồn kho sản phẩm & nguyên vật liệu
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Tự động trừ số lượng theo từng đơn hàng bán ra và cảnh báo khi chạm ngưỡng tối thiểu
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface)',
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
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Số lượng tồn hiện tại</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Ngưỡng tối thiểu</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Đơn vị tính</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Trạng thái kho</th>
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
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 12,
                        fontWeight: 700,
                        backgroundColor: isWarning ? 'var(--danger-bg)' : 'var(--success-bg)',
                        color: isWarning ? 'var(--danger)' : 'var(--success)'
                      }}>
                        {isWarning ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                        {isWarning ? 'Sắp hết hàng' : 'Đầy đủ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
