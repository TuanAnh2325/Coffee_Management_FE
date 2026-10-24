const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const FALLBACK_CATEGORIES = [
  { id: 1, code: 'COFFEE', name: 'Cà phê truyền thống & Pha máy', description: 'Cà phê Robusta & Arabica nguyên chất thơm đậm đà' },
  { id: 2, code: 'TEA', name: 'Trà trái cây nhiệt đới', description: 'Trà hoa quả thanh mát kết hợp trái cây tươi giòn ngọt' },
  { id: 3, code: 'FREEZE', name: 'Đá xay & Sinh tố', description: 'Thức uống đá xay béo ngậy kèm kem tươi whipping' },
  { id: 4, code: 'CAKE', name: 'Bánh ngọt & Điểm tâm', description: 'Bánh nướng tươi mỗi ngày ăn kèm đồ uống' }
];

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Cà phê',
    code: 'CF-DEN',
    name: 'Cà phê Đen đá',
    basePrice: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    description: 'Cà phê Robusta đậm vị truyền thống'
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: 'Cà phê',
    code: 'CF-SUA',
    name: 'Cà phê Sữa đá',
    basePrice: 29000,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400',
    description: 'Cà phê hòa quyện sữa đặc thơm ngọt béo'
  },
  {
    id: 3,
    categoryId: 1,
    categoryName: 'Cà phê',
    code: 'BAC-XIU',
    name: 'Bạc xỉu 3 tầng',
    basePrice: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400',
    description: 'Nhiều sữa ít cà phê, vị béo thơm thanh nhẹ'
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: 'Trà trái cây',
    code: 'TRA-DAO',
    name: 'Trà Đào Cam Sả',
    basePrice: 39000,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    description: 'Trà đào thơm nồng kết hợp hương cam sả và miếng đào giòn'
  },
  {
    id: 5,
    categoryId: 2,
    categoryName: 'Trà trái cây',
    code: 'TRA-VAI',
    name: 'Trà Vải Hoa Lài',
    basePrice: 39000,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
    description: 'Trà lài thanh mát cùng quả vải ngâm ngọt mọng nước'
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: 'Đá xay',
    code: 'FREEZE-MATCHA',
    name: 'Matcha Đá Xay Thạch',
    basePrice: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
    description: 'Trà xanh Nhật Bản đá xay phủ kem tươi và thạch matcha'
  },
  {
    id: 7,
    categoryId: 4,
    categoryName: 'Bánh ngọt',
    code: 'CAKE-TIRAMISU',
    name: 'Bánh Tiramisu Ý',
    basePrice: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    description: 'Bánh mềm thơm hương cà phê và phô mai mascarpone'
  }
];

const FALLBACK_TABLES = [
  { id: 1, tableNumber: 'Bàn 01', area: 'Tầng 1 (Trong nhà)', status: 'EMPTY', capacity: 4 },
  { id: 2, tableNumber: 'Bàn 02', area: 'Tầng 1 (Trong nhà)', status: 'SERVING', capacity: 4 },
  { id: 3, tableNumber: 'Bàn 03', area: 'Tầng 1 (Trong nhà)', status: 'SERVING', capacity: 2 },
  { id: 4, tableNumber: 'Bàn 04', area: 'Tầng 1 (Trong nhà)', status: 'EMPTY', capacity: 4 },
  { id: 5, tableNumber: 'Bàn 05', area: 'Tầng 2 (Máy lạnh)', status: 'RESERVED', capacity: 6 },
  { id: 6, tableNumber: 'Bàn 06', area: 'Tầng 2 (Máy lạnh)', status: 'EMPTY', capacity: 4 },
  { id: 7, tableNumber: 'Bàn 07', area: 'Tầng 2 (Máy lạnh)', status: 'SERVING', capacity: 2 },
  { id: 8, tableNumber: 'Bàn 08', area: 'Sân vườn ngoài trời', status: 'EMPTY', capacity: 4 },
  { id: 9, tableNumber: 'Bàn 09', area: 'Sân vườn ngoài trời', status: 'EMPTY', capacity: 4 },
  { id: 10, tableNumber: 'Bàn 10', area: 'Sân vườn ngoài trời', status: 'SERVING', capacity: 6 }
];

const FALLBACK_ORDERS = [
  {
    id: 1,
    orderCode: 'HD20261024-0001',
    tableName: 'Bàn 02',
    orderType: 'DINE_IN',
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    totalAmount: 73000,
    createdAt: '2026-10-24 08:30:15',
    items: [
      { productName: 'Cà phê Sữa đá', sizeName: 'M', unitPrice: 34000, quantity: 1, subtotal: 34000 },
      { productName: 'Trà Đào Cam Sả', sizeName: 'S', unitPrice: 39000, quantity: 1, subtotal: 39000 }
    ]
  },
  {
    id: 2,
    orderCode: 'HD20261024-0002',
    tableName: 'Mang về',
    orderType: 'TAKE_AWAY',
    paymentStatus: 'PAID',
    paymentMethod: 'BANKING',
    totalAmount: 80000,
    createdAt: '2026-10-24 09:15:20',
    items: [
      { productName: 'Matcha Đá Xay Thạch', sizeName: 'L', unitPrice: 55000, quantity: 1, subtotal: 55000 },
      { productName: 'Cà phê Đen đá', sizeName: 'S', unitPrice: 25000, quantity: 1, subtotal: 25000 }
    ]
  }
];

const FALLBACK_REPORT = {
  date: '2026-10-24',
  totalRevenue: 12450000,
  totalOrders: 142,
  completedOrders: 138,
  cancelledOrders: 4,
  cashRevenue: 5200000,
  bankingRevenue: 7250000,
  topSellingProducts: [
    { productName: 'Cà phê Sữa đá', quantitySold: 58, revenue: 1972000 },
    { productName: 'Trà Đào Cam Sả', quantitySold: 42, revenue: 1638000 },
    { productName: 'Bạc xỉu 3 tầng', quantitySold: 36, revenue: 1152000 },
    { productName: 'Matcha Đá Xay', quantitySold: 24, revenue: 1080000 }
  ]
};

const FALLBACK_INVENTORY = [
  { productId: 1, productName: 'Cà phê Đen đá', quantityInStock: 150, minStockThreshold: 20, unit: 'Ly', status: 'AN_TOAN' },
  { productId: 2, productName: 'Cà phê Sữa đá', quantityInStock: 120, minStockThreshold: 20, unit: 'Ly', status: 'AN_TOAN' },
  { productId: 3, productName: 'Bạc xỉu 3 tầng', quantityInStock: 95, minStockThreshold: 20, unit: 'Ly', status: 'AN_TOAN' },
  { productId: 4, productName: 'Trà Đào Cam Sả', quantityInStock: 80, minStockThreshold: 15, unit: 'Ly', status: 'AN_TOAN' },
  { productId: 5, productName: 'Trà Vải Hoa Lài', quantityInStock: 12, minStockThreshold: 15, unit: 'Ly', status: 'SAP_HET' },
  { productId: 6, productName: 'Matcha Đá Xay Thạch', quantityInStock: 45, minStockThreshold: 10, unit: 'Ly', status: 'AN_TOAN' },
  { productId: 7, productName: 'Bánh Tiramisu Ý', quantityInStock: 8, minStockThreshold: 10, unit: 'Chiếc', status: 'SAP_HET' }
];

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      return await handleResponse(res);
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async getProducts(categoryId = null) {
    try {
      const url = categoryId
        ? `${API_BASE_URL}/products?categoryId=${categoryId}`
        : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      return await handleResponse(res);
    } catch {
      if (categoryId) {
        return FALLBACK_PRODUCTS.filter(p => p.categoryId === categoryId);
      }
      return FALLBACK_PRODUCTS;
    }
  },

  async getProductSizes() {
    try {
      const res = await fetch(`${API_BASE_URL}/products/sizes`);
      return await handleResponse(res);
    } catch {
      return [
        { id: 1, sizeName: 'S', extraPrice: 0 },
        { id: 2, sizeName: 'M', extraPrice: 5000 },
        { id: 3, sizeName: 'L', extraPrice: 10000 }
      ];
    }
  },

  async getTables() {
    try {
      const res = await fetch(`${API_BASE_URL}/tables`);
      return await handleResponse(res);
    } catch {
      return FALLBACK_TABLES;
    }
  },

  async updateTableStatus(tableId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/tables/${tableId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await handleResponse(res);
    } catch {
      return { id: tableId, status };
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      return await handleResponse(res);
    } catch {
      return FALLBACK_ORDERS;
    }
  },

  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      return await handleResponse(res);
    } catch {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomId = Math.floor(1000 + Math.random() * 9000);
      return {
        id: randomId,
        orderCode: `HD${dateStr}-${randomId}`,
        orderType: orderPayload.orderType,
        tableId: orderPayload.tableId,
        paymentStatus: 'PAID',
        paymentMethod: orderPayload.paymentMethod,
        totalAmount: orderPayload.totalAmount,
        createdAt: new Date().toLocaleString('vi-VN'),
        items: orderPayload.items
      };
    }
  },

  async getTodayReport() {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/today`);
      return await handleResponse(res);
    } catch {
      return FALLBACK_REPORT;
    }
  },

  async getInventory() {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory`);
      return await handleResponse(res);
    } catch {
      return FALLBACK_INVENTORY;
    }
  }
};

export default api;
