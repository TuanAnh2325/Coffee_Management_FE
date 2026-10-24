import React, { useState, useRef } from 'react';
import { Plus, Search, X, UploadCloud, Edit2, Trash2, Power, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function MenuView({ categories, products, onAddProduct, onUpdateProduct, onDeleteProduct, onToggleAvailability }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [basePrice, setBasePrice] = useState('');
  const [initialStock, setInitialStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.categoryId === Number(selectedCategory) || p.category?.id === Number(selectedCategory);
    const matchesSearch = !searchTerm || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setCode('');
    setName('');
    setCategoryId(categories[0]?.id || 1);
    setBasePrice('');
    setInitialStock('50');
    setImageUrl('');
    setDescription('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setCode(prod.code || '');
    setName(prod.name || '');
    setCategoryId(prod.categoryId || prod.category?.id || categories[0]?.id || 1);
    setBasePrice(String(prod.basePrice || ''));
    setInitialStock('50');
    setImageUrl(prod.imageUrl || '');
    setDescription(prod.description || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const result = await api.uploadImage(file);
      if (result && result.url) {
        setImageUrl(result.url);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải ảnh lên máy chủ');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Vui lòng nhập mã món (ví dụ: CF-DEN, TRA-DAO)');
      return;
    }
    if (!name.trim()) {
      setError('Vui lòng nhập tên món đồ uống hoặc bánh');
      return;
    }
    if (!basePrice || Number(basePrice) <= 0) {
      setError('Đơn giá cơ bản phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        categoryId: Number(categoryId),
        basePrice: Number(basePrice),
        initialStock: Number(initialStock) || 50,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        description: description.trim()
      };

      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onAddProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu món');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (prod) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món '${prod.name}' khỏi thực đơn?`)) {
      try {
        await onDeleteProduct(prod.id);
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa món');
      }
    }
  };

  const handleToggle = async (prod) => {
    try {
      await onToggleAvailability(prod.id);
    } catch (err) {
      alert(err.message || 'Lỗi khi đổi trạng thái món');
    }
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '24px' }}>
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
            Quản lý thực đơn
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Thêm mới, chỉnh sửa giá, trạng thái phục vụ và hình ảnh món ăn đồ uống
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
          <Plus size={18} /> Thêm món mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        backgroundColor: '#fff',
        padding: '14px 18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: 24
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: selectedCategory === 'ALL' ? 600 : 500,
              backgroundColor: selectedCategory === 'ALL' ? 'var(--primary-roast)' : 'var(--bg-app)',
              color: selectedCategory === 'ALL' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Tất cả ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: selectedCategory === String(cat.id) ? 600 : 500,
                backgroundColor: selectedCategory === String(cat.id) ? 'var(--primary-roast)' : 'var(--bg-app)',
                color: selectedCategory === String(cat.id) ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã món..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: 13,
              outline: 'none',
              backgroundColor: 'var(--bg-app)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20
      }}>
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              opacity: prod.isAvailable === false ? 0.75 : 1
            }}
          >
            <div style={{ position: 'relative', height: 160, backgroundColor: 'var(--bg-subtle)' }}>
              <img
                src={prod.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'}
                alt={prod.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: 10,
                left: 10,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(43, 24, 16, 0.85)',
                color: '#fff',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.3px'
              }}>
                {prod.code}
              </span>

              {/* Action Buttons Overlay */}
              <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                display: 'flex',
                gap: 6
              }}>
                <button
                  onClick={() => handleOpenEditModal(prod)}
                  title="Sửa món"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'var(--primary-roast)',
                    display: 'flex'
                  }}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(prod)}
                  title="Xóa món"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#EF4444',
                    display: 'flex'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                {prod.name}
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 12px', flex: 1, lineHeight: 1.4 }}>
                {prod.description || 'Chưa có mô tả'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid var(--border-light)'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Đơn giá chuẩn</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--caramel)' }}>
                    {formatPrice(prod.basePrice)}
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(prod)}
                  title="Bấm để bật/tắt phục vụ món"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: prod.isAvailable !== false ? '#ECFDF5' : '#FEF2F2',
                    color: prod.isAvailable !== false ? '#059669' : '#DC2626',
                    border: '1px solid ' + (prod.isAvailable !== false ? '#A7F3D0' : '#FECACA'),
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Power size={13} />
                  {prod.isAvailable !== false ? 'Đang phục vụ' : 'Ngưng phục vụ'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          color: 'var(--text-muted)'
        }}>
          Chưa có món nào trong thực đơn. Bấm vào "Thêm món mới" để bắt đầu.
        </div>
      )}

      {/* Modal Thêm / Sửa món */}
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
            maxWidth: 520,
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-xl)',
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
                {editingProduct ? 'Chỉnh sửa món thực đơn' : 'Thêm món mới vào thực đơn'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    Mã món *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: CF-MUOI"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    Tên món *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Cà phê Muối"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    Danh mục *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      backgroundColor: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    Đơn giá cơ bản (VNĐ) *
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 32000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 13.5,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Upload ảnh từ máy tính */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Hình ảnh món
                </label>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: uploadingImage ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 size={16} className="spin" /> Đang tải ảnh...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} /> Chọn ảnh từ máy tính
                      </>
                    )}
                  </button>

                  {imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          border: '1px solid var(--border-light)'
                        }}
                      />
                      <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
                        Đã tải ảnh lên
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 6 }}>
                  <input
                    type="text"
                    placeholder="Hoặc dán đường dẫn ảnh (URL)..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: 12.5,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  {editingProduct ? 'Cập nhật số lượng kho' : 'Tồn kho ban đầu'}
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  Mô tả hương vị / thành phần
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ngắn gọn về hương vị món..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: 13.5,
                    boxSizing: 'border-box'
                  }}
                />
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
                  {loading ? 'Đang lưu...' : (editingProduct ? 'Cập nhật món' : 'Lưu món mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
