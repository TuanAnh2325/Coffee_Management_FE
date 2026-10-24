import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, Coffee, ShoppingBag, Banknote, QrCode, CreditCard, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function PosView({
  categories,
  products,
  tables,
  cart,
  setCart,
  onCheckout,
  loading
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // Size selections map for each product (default size 'M')
  const [productSizes, setProductSizes] = useState({});

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getSizeExtra = (size) => {
    if (size === 'L') return 10000;
    if (size === 'M') return 5000;
    return 0;
  };

  const handleSelectSize = (productId, size) => {
    setProductSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const size = productSizes[product.id] || 'M';
    const extraPrice = getSizeExtra(size);
    const unitPrice = Number(product.basePrice) + extraPrice;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id && item.sizeName === size
      );

      if (existingIndex > -1) {
        return prevCart.map((item, idx) => {
          if (idx === existingIndex) {
            const nextQty = item.quantity + 1;
            return {
              ...item,
              quantity: nextQty,
              subtotal: nextQty * item.unitPrice
            };
          }
          return item;
        });
      }

      return [
        ...prevCart,
        {
          productId: product.id,
          productName: product.name,
          imageUrl: product.imageUrl,
          sizeName: size,
          unitPrice: unitPrice,
          quantity: 1,
          subtotal: unitPrice,
          itemNote: ''
        }
      ];
    });
  };

  const handleUpdateQuantity = (index, delta) => {
    setCart(prevCart => {
      const target = prevCart[index];
      if (!target) return prevCart;
      const nextQty = target.quantity + delta;
      if (nextQty <= 0) {
        return prevCart.filter((_, idx) => idx !== index);
      }
      return prevCart.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            quantity: nextQty,
            subtotal: nextQty * item.unitPrice
          };
        }
        return item;
      });
    });
  };

  const handleUpdateNote = (index, note) => {
    setCart(prevCart => {
      return prevCart.map((item, idx) => {
        if (idx === index) {
          return { ...item, itemNote: note };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (index) => {
    setCart(prevCart => prevCart.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handlePay = () => {
    if (cart.length === 0) return;
    onCheckout({
      orderType,
      tableId: orderType === 'DINE_IN' ? selectedTableId : null,
      paymentMethod,
      totalAmount,
      items: cart
    });
  };

  return (
    <div className="pos-grid-container">
      {/* LEFT: MENU & PRODUCT CATALOG */}
      <div>
        {/* Search & Filter Header */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: 18,
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: 20
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
            <input
              type="text"
              placeholder="Tìm đồ uống, cà phê, trà, bánh ngọt... (Mã hoặc tên món)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: 42,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-app)',
                borderColor: 'var(--border-light)'
              }}
            />
          </div>

          {/* Categories Pill list */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: selectedCategory === null ? 'var(--primary-roast)' : 'var(--bg-app)',
                color: selectedCategory === null ? 'var(--text-white)' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Sparkles size={14} /> Tất cả menu
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: isSelected ? 'var(--primary-roast)' : 'var(--bg-app)',
                    color: isSelected ? 'var(--text-white)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16
        }}>
          {filteredProducts.map((p) => {
            const currentSize = productSizes[p.id] || 'M';
            const extra = getSizeExtra(currentSize);
            const displayPrice = Number(p.basePrice) + extra;

            return (
              <div
                key={p.id}
                className="animate-fade-in"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                {/* Product Image */}
                <div style={{
                  height: 140,
                  width: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#ECE3D7'
                }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(46, 27, 18, 0.85)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {p.code}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--caramel)', fontWeight: 600, marginBottom: 2 }}>
                    {p.categoryName || 'Đồ uống'}
                  </div>
                  <h4 style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    lineHeight: '1.3',
                    marginBottom: 6
                  }}>
                    {p.name}
                  </h4>

                  {/* Size buttons */}
                  <div style={{ display: 'flex', gap: 6, margin: '8px 0 12px' }}>
                    {['S', 'M', 'L'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handleSelectSize(p.id, sz)}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 11.5,
                          fontWeight: 700,
                          border: currentSize === sz ? '1.5px solid var(--caramel)' : '1px solid var(--border-light)',
                          backgroundColor: currentSize === sz ? 'var(--caramel-light)' : 'var(--bg-app)',
                          color: currentSize === sz ? 'var(--caramel)' : 'var(--text-secondary)'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {/* Price & Add button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: 8,
                    borderTop: '1px solid var(--border-light)'
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Giá (Size {currentSize})</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--caramel)' }}>
                        {formatMoney(displayPrice)}
                      </div>
                    </div>
                    <button
                      type="button" onClick={() => handleAddToCart(p)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-roast)',
                        color: 'var(--latte)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: CART / POS SIDEBAR */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        position: 'sticky',
        top: 96
      }}>
        {/* Cart Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>
              Đơn hàng hiện tại
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {cart.length} món trong giỏ
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: 'var(--danger)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-bg)'
              }}
            >
              <Trash2 size={14} /> Xóa hết
            </button>
          )}
        </div>

        {/* Order Type Selector */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => setOrderType('DINE_IN')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12.5,
                fontWeight: 600,
                backgroundColor: orderType === 'DINE_IN' ? 'var(--primary-roast)' : 'var(--bg-app)',
                color: orderType === 'DINE_IN' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              <Coffee size={15} /> Tại quán
            </button>
            <button
              onClick={() => setOrderType('TAKE_AWAY')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12.5,
                fontWeight: 600,
                backgroundColor: orderType === 'TAKE_AWAY' ? 'var(--primary-roast)' : 'var(--bg-app)',
                color: orderType === 'TAKE_AWAY' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              <ShoppingBag size={15} /> Mang về
            </button>
          </div>

          {/* Table select if Dine-in */}
          {orderType === 'DINE_IN' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Chọn bàn:</span>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(Number(e.target.value))}
                style={{ flex: 1, padding: '6px 12px', fontSize: 13 }}
              >
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.tableNumber} - {t.area} ({t.status === 'EMPTY' ? 'Trống' : 'Có khách'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {cart.length === 0 ? (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 13
            }}>
              <Coffee size={38} color="#D8CCC0" style={{ marginBottom: 8 }} />
              <div>Chưa có món nào</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Chọn món bên menu để thêm vào đơn</div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--caramel)', fontWeight: 600 }}>
                      Size {item.sizeName} • {formatMoney(item.unitPrice)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    style={{ color: 'var(--text-muted)', padding: 2 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Quantity and subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <button
                      type="button" onClick={() => handleUpdateQuantity(idx, -1)}
                      style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: 12, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button" onClick={() => handleUpdateQuantity(idx, 1)}
                      style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary-roast)' }}>
                    {formatMoney(item.subtotal)}
                  </div>
                </div>

                {/* Note input */}
                <input
                  type="text"
                  placeholder="Ghi chú pha chế (ít đường, không đá,...)"
                  value={item.itemNote || ''}
                  onChange={(e) => handleUpdateNote(idx, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: 11,
                    marginTop: 6,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div style={{
          padding: '16px 18px',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#FCFAF7'
        }}>
          {/* Payment Method Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {[
              { id: 'CASH', label: 'Tiền mặt', icon: Banknote },
              { id: 'BANKING', label: 'QR Chuyển khoản', icon: QrCode },
              { id: 'CARD', label: 'Thẻ', icon: CreditCard }
            ].map(m => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    padding: '6px 4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 10.5,
                    fontWeight: 600,
                    backgroundColor: isSelected ? 'var(--caramel-light)' : 'var(--bg-app)',
                    color: isSelected ? 'var(--caramel)' : 'var(--text-secondary)',
                    border: isSelected ? '1.5px solid var(--caramel)' : '1px solid var(--border-light)'
                  }}
                >
                  <Icon size={15} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Total Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Tổng thanh toán:</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--caramel)' }}>
              {formatMoney(totalAmount)}
            </span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={cart.length === 0 || loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: cart.length === 0 ? 'var(--bg-sand)' : 'var(--caramel)',
              color: cart.length === 0 ? 'var(--text-muted)' : 'var(--text-white)',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: cart.length > 0 ? 'var(--shadow-md)' : 'none',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Check size={18} />
            {loading ? 'Đang xử lý...' : 'Thanh toán & In hóa đơn'}
          </button>
        </div>
      </div>
    </div>
  );
}
