const API_BASE_URL = 'http://localhost:8080/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Lỗi máy chủ (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // response is not json
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  // Authentication
  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(res);
    localStorage.setItem('coffee_pos_user', JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem('coffee_pos_user');
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem('coffee_pos_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Users Management (Admin)
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    return await handleResponse(res);
  },

  async createUser(userPayload) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    return await handleResponse(res);
  },

  async updateUser(id, userPayload) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    return await handleResponse(res);
  },

  async toggleUserStatus(id, isActive) {
    const res = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isActive !== undefined ? { isActive } : {})
    });
    return await handleResponse(res);
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  },

  // Categories CRUD
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return await handleResponse(res);
  },

  async createCategory(categoryPayload) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryPayload)
    });
    return await handleResponse(res);
  },

  async updateCategory(id, categoryPayload) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryPayload)
    });
    return await handleResponse(res);
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  },

  // Products CRUD
  async getProducts(categoryId = null) {
    const url = categoryId
      ? `${API_BASE_URL}/products?categoryId=${categoryId}`
      : `${API_BASE_URL}/products`;
    const res = await fetch(url);
    return await handleResponse(res);
  },

  async createProduct(productPayload) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload)
    });
    return await handleResponse(res);
  },

  async updateProduct(id, productPayload) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload)
    });
    return await handleResponse(res);
  },

  async toggleProductAvailability(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}/availability`, {
      method: 'PUT'
    });
    return await handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    return await handleResponse(res);
  },

  async getProductSizes() {
    const res = await fetch(`${API_BASE_URL}/products/sizes`);
    return await handleResponse(res);
  },

  // Tables CRUD
  async getTables() {
    const res = await fetch(`${API_BASE_URL}/tables`);
    return await handleResponse(res);
  },

  async createTable(tablePayload) {
    const res = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tablePayload)
    });
    return await handleResponse(res);
  },

  async updateTable(id, tablePayload) {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tablePayload)
    });
    return await handleResponse(res);
  },

  async deleteTable(id) {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  },

  async updateTableStatus(tableId, status) {
    const res = await fetch(`${API_BASE_URL}/tables/${tableId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await handleResponse(res);
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return await handleResponse(res);
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return await handleResponse(res);
  },

  // Reports
  async getTodayReport() {
    const res = await fetch(`${API_BASE_URL}/reports/today`);
    return await handleResponse(res);
  },

  async getMonthReport(year, month) {
    let url = `${API_BASE_URL}/reports/month`;
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);
    if (params.length > 0) url += '?' + params.join('&');
    const res = await fetch(url);
    return await handleResponse(res);
  },

  // Inventory
  async getInventory() {
    const res = await fetch(`${API_BASE_URL}/inventory`);
    return await handleResponse(res);
  },

  async updateStock(productId, quantity) {
    const res = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return await handleResponse(res);
  }
};

export default api;
