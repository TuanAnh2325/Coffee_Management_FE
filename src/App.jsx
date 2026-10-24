import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import PosView from './components/PosView';
import TablesView from './components/TablesView';
import OrdersView from './components/OrdersView';
import ReportsView from './components/ReportsView';
import InventoryView from './components/InventoryView';
import ReceiptModal from './components/ReceiptModal';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState(null);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load initial data from centralized api.js
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [cats, prods, tbls, ords, rep, inv] = await Promise.all([
        api.getCategories().catch(() => []),
        api.getProducts().catch(() => []),
        api.getTables().catch(() => []),
        api.getOrders().catch(() => []),
        api.getTodayReport().catch(() => null),
        api.getInventory().catch(() => [])
      ]);

      setCategories(cats);
      setProducts(prods);
      setTables(tbls);
      setOrders(ords);
      setReport(rep);
      setInventory(inv);
    } catch (err) {
      showToast('Không thể kết nối đến máy chủ Backend', 'error');
    }
  };

  const handleCheckout = async (orderPayload) => {
    setLoading(true);
    try {
      const result = await api.createOrder(orderPayload);
      setCompletedOrder({
        ...result,
        tableName: orderPayload.tableId ? `Bàn ${orderPayload.tableId}` : 'Mang về',
        items: orderPayload.items
      });
      setCart([]);
      showToast('Thanh toán thành công! Hóa đơn đã được ghi nhận.');
      // Refresh orders and tables
      const [updatedOrders, updatedTables, updatedReport] = await Promise.all([
        api.getOrders().catch(() => orders),
        api.getTables().catch(() => tables),
        api.getTodayReport().catch(() => report)
      ]);
      setOrders(updatedOrders);
      setTables(updatedTables);
      setReport(updatedReport);
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTableStatus = async (tableId, status) => {
    try {
      await api.updateTableStatus(tableId, status);
      setTables(prev =>
        prev.map(t => (t.id === tableId ? { ...t, status } : t))
      );
      showToast(`Đã cập nhật trạng thái bàn ${tableId} thành công!`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật trạng thái bàn', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'pos' && (
          <PosView
            categories={categories}
            products={products}
            tables={tables}
            cart={cart}
            setCart={setCart}
            onCheckout={handleCheckout}
            loading={loading}
          />
        )}

        {activeTab === 'tables' && (
          <TablesView
            tables={tables}
            onUpdateStatus={handleUpdateTableStatus}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            onViewReceipt={(ord) => setCompletedOrder(ord)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView report={report} />
        )}

        {activeTab === 'inventory' && (
          <InventoryView inventory={inventory} />
        )}
      </main>

      {/* Simulated Receipt Modal */}
      {completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      {/* Floating Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
