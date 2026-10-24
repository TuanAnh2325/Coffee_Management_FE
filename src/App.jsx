import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import LoginView from './components/LoginView';
import PosView from './components/PosView';
import TablesView from './components/TablesView';
import OrdersView from './components/OrdersView';
import MenuView from './components/MenuView';
import CategoryView from './components/CategoryView';
import ReportsView from './components/ReportsView';
import InventoryView from './components/InventoryView';
import ReceiptModal from './components/ReceiptModal';
import Toast from './components/Toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = api.getCurrentUser();
    if (user && user.fullName && user.fullName.includes('?')) {
      user.fullName = user.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Nhân viên thu ngân';
      localStorage.setItem('coffee_pos_user', JSON.stringify(user));
    }
    return user;
  });
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
    }, 4000);
  };

  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  // Bảo vệ phân quyền: Nếu là Staff, chỉ được xem POS, Sơ đồ bàn, Lịch sử đơn
  useEffect(() => {
    if (currentUser && currentUser.role === 'ROLE_STAFF') {
      const allowedStaffTabs = ['pos', 'tables', 'orders'];
      if (!allowedStaffTabs.includes(activeTab)) {
        setActiveTab('pos');
      }
    }
  }, [currentUser, activeTab]);

  // Tu dong lam moi so lieu khi chuyen tab Bao cao hoac Don hang
  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'reports') {
        api.getTodayReport().then(rep => setReport(rep)).catch(() => {});
      } else if (activeTab === 'orders') {
        api.getOrders().then(ords => setOrders(ords)).catch(() => {});
      }
    }
  }, [currentUser, activeTab]);

  const loadAllData = async () => {
    try {
      const [cats, prods, tbls, ords, rep, inv] = await Promise.all([
        api.getCategories().catch(err => { console.warn('Categories:', err.message); return []; }),
        api.getProducts().catch(err => { console.warn('Products:', err.message); return []; }),
        api.getTables().catch(err => { console.warn('Tables:', err.message); return []; }),
        api.getOrders().catch(err => { console.warn('Orders:', err.message); return []; }),
        api.getTodayReport().catch(err => { console.warn('Reports:', err.message); return null; }),
        api.getInventory().catch(err => { console.warn('Inventory:', err.message); return []; })
      ]);

      setCategories(cats);
      setProducts(prods);
      setTables(tbls);
      setOrders(ords);
      setReport(rep);
      setInventory(inv);
    } catch {
      showToast('Không thể kết nối đến máy chủ Backend', 'error');
    }
  };

  const handleLoginSuccess = async (credentials) => {
    try {
      const user = await api.login(credentials);
      setCurrentUser(user);
      setActiveTab('pos');
      showToast(`Đăng nhập thành công! Xin chào ${user.fullName || user.username}`);
      return user;
    } catch (err) {
      showToast(err.message || 'Đăng nhập không thành công', 'error');
      throw err;
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCart([]);
    showToast('Đã đăng xuất khỏi hệ thống');
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
      
      const [updatedOrders, updatedTables, updatedReport, updatedInv] = await Promise.all([
        api.getOrders().catch(() => orders),
        api.getTables().catch(() => tables),
        api.getTodayReport().catch(() => report),
        api.getInventory().catch(() => inventory)
      ]);
      setOrders(updatedOrders);
      setTables(updatedTables);
      setReport(updatedReport);
      setInventory(updatedInv);
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD BÀN ---
  const handleCreateTable = async (tableData) => {
    try {
      const newTable = await api.createTable(tableData);
      setTables(prev => [...prev, newTable]);
      showToast(`Đã tạo ${newTable.tableNumber} thành công!`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo bàn mới', 'error');
      throw err;
    }
  };

  const handleUpdateTable = async (tableId, tableData) => {
    try {
      const updated = await api.updateTable(tableId, tableData);
      setTables(prev => prev.map(t => (t.id === tableId ? updated : t)));
      showToast(`Đã cập nhật ${updated.tableNumber} thành công!`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật bàn', 'error');
      throw err;
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await api.deleteTable(tableId);
      setTables(prev => prev.filter(t => t.id !== tableId));
      showToast('Đã xóa bàn thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa bàn', 'error');
      throw err;
    }
  };

  const handleUpdateTableStatus = async (tableId, status) => {
    try {
      await api.updateTableStatus(tableId, status);
      setTables(prev =>
        prev.map(t => (t.id === tableId ? { ...t, status } : t))
      );
      showToast('Đã cập nhật trạng thái bàn!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật trạng thái bàn', 'error');
    }
  };

  // --- CRUD DANH MỤC ---
  const handleAddCategory = async (categoryData) => {
    try {
      const newCat = await api.createCategory(categoryData);
      setCategories(prev => [...prev, newCat]);
      showToast(`Đã thêm danh mục '${newCat.name}' thành công!`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi tạo danh mục', 'error');
      throw err;
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      const updated = await api.updateCategory(categoryId, categoryData);
      setCategories(prev => prev.map(c => (c.id === categoryId ? updated : c)));
      showToast(`Đã cập nhật danh mục '${updated.name}' thành công!`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật danh mục', 'error');
      throw err;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showToast('Đã xóa danh mục thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa danh mục', 'error');
      throw err;
    }
  };

  // --- CRUD MÓN (PRODUCTS) ---
  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await api.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      showToast(`Đã thêm món '${newProduct.name}' vào thực đơn!`);
      api.getInventory().then(inv => setInventory(inv)).catch(() => {});
    } catch (err) {
      showToast(err.message || 'Lỗi khi thêm món', 'error');
      throw err;
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const updated = await api.updateProduct(productId, productData);
      setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
      showToast(`Đã cập nhật món '${updated.name}' thành công!`);
      api.getInventory().then(inv => setInventory(inv)).catch(() => {});
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật món', 'error');
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Đã xóa món khỏi thực đơn!');
      api.getInventory().then(inv => setInventory(inv)).catch(() => {});
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa món', 'error');
      throw err;
    }
  };

  const handleToggleProductAvailability = async (productId) => {
    try {
      const updated = await api.toggleProductAvailability(productId);
      setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
      showToast(`Đã đổi trạng thái món sang: ${updated.isAvailable ? 'Đang phục vụ' : 'Ngưng phục vụ'}`);
    } catch (err) {
      showToast(err.message || 'Lỗi khi đổi trạng thái món', 'error');
      throw err;
    }
  };

  // --- TỒN KHO ---
  const handleUpdateStock = async (productId, quantity) => {
    try {
      await api.updateStock(productId, quantity);
      const updatedInv = await api.getInventory();
      setInventory(updatedInv);
      showToast('Cập nhật số lượng tồn kho thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật kho', 'error');
      throw err;
    }
  };

  // Nếu chưa đăng nhập, hiển thị màn hình Login
  if (!currentUser) {
    return (
      <>
        <LoginView onLoginSuccess={handleLoginSuccess} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  const isAdmin = currentUser.role === 'ROLE_ADMIN';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render content theo tab
  const renderMainContent = () => (
    <>
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
          onCreateTable={handleCreateTable}
          onUpdateTable={handleUpdateTable}
          onDeleteTable={handleDeleteTable}
          isAdmin={isAdmin}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersView
          orders={orders}
          onViewReceipt={(ord) => setCompletedOrder(ord)}
        />
      )}

      {/* Các chức năng chỉ dành riêng cho Admin */}
      {isAdmin && activeTab === 'menu' && (
        <MenuView
          categories={categories}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleAvailability={handleToggleProductAvailability}
        />
      )}

      {isAdmin && activeTab === 'categories' && (
        <CategoryView
          categories={categories}
          products={products}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {isAdmin && activeTab === 'reports' && (
        <ReportsView report={report} onRefresh={() => api.getTodayReport().then(rep => setReport(rep)).catch(() => {})} />
      )}

      {isAdmin && activeTab === 'inventory' && (
        <InventoryView
          inventory={inventory}
          onUpdateStock={handleUpdateStock}
        />
      )}
    </>
  );

  return (
    <>
      {isAdmin ? (
        /* Giao diện Admin: Sidebar bên trái cố định + Nội dung bên phải */
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cartCount}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
            {renderMainContent()}
          </main>
        </div>
      ) : (
        /* Giao diện Staff: Header trên cùng + Nội dung bên dưới */
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cartCount}
          />
          <main style={{ flex: 1 }}>
            {renderMainContent()}
          </main>
        </div>
      )}

      {/* Simulated Receipt Modal */}
      {completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      {/* Floating Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
