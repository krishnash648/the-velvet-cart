import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import productsData from '../data/products';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const sections = [
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Users' },
  { id: 'analytics', label: 'Analytics' }
];

const dummyOrders = [
  { id: 'ORD001', user: 'Alice', total: 3999, status: 'Pending', date: '2024-06-01', items: 2, products: [{ name: 'Headphones', qty: 1 }, { name: 'Mouse', qty: 1 }], history: [{ status: 'Pending', date: '2024-06-01' }] },
  { id: 'ORD002', user: 'Bob', total: 8999, status: 'Shipped', date: '2024-06-02', items: 1, products: [{ name: 'Keyboard', qty: 1 }], history: [{ status: 'Pending', date: '2024-06-02' }, { status: 'Shipped', date: '2024-06-03' }] },
  { id: 'ORD003', user: 'Charlie', total: 12999, status: 'Delivered', date: '2024-06-03', items: 3, products: [{ name: 'Monitor', qty: 1 }, { name: 'Cable', qty: 2 }], history: [{ status: 'Pending', date: '2024-06-03' }, { status: 'Shipped', date: '2024-06-04' }, { status: 'Delivered', date: '2024-06-05' }] },
];
const dummyUsers = [
  { id: 1, name: 'Alice', email: 'alice@email.com', registered: '2024-05-01', blocked: false, orderCount: 3, lastLogin: '2024-06-05', role: 'user' },
  { id: 2, name: 'Bob', email: 'bob@email.com', registered: '2024-05-10', blocked: false, orderCount: 1, lastLogin: '2024-06-04', role: 'admin' },
  { id: 3, name: 'Charlie', email: 'charlie@email.com', registered: '2024-05-15', blocked: true, orderCount: 2, lastLogin: '2024-06-03', role: 'user' },
];

export default function Admin() {
  const [active, setActive] = useState('products');
  const [products, setProducts] = useState(productsData);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [orders, setOrders] = useState(dummyOrders);
  const [users, setUsers] = useState(dummyUsers);
  const [isFakeAdmin, setIsFakeAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [orderFilter, setOrderFilter] = useState({ status: '', user: '', date: '' });
  const [orderDetails, setOrderDetails] = useState(null);
  const [userFilter, setUserFilter] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);
  const notifications = [
    { id: 1, type: 'order', message: 'New order placed: ORD004', time: '2 min ago' },
    { id: 2, type: 'stock', message: 'Low stock: Headphones', time: '10 min ago' },
    { id: 3, type: 'user', message: 'New user registered: Dave', time: '30 min ago' }
  ];
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleFakeAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsFakeAdmin(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials.');
    }
  };

  if (!isFakeAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night text-white">
        <div className="bg-white/10 p-8 rounded-2xl shadow-xl border border-white/10 text-center w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handleFakeAdminLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              autoComplete="current-password"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700">Login</button>
            {loginError && <div className="text-red-400 font-semibold mt-2">{loginError}</div>}
          </form>
          <div className="mt-6 text-sm text-gray-300">
            <div>Demo Credentials:</div>
            <div><span className="font-bold">Username:</span> admin</div>
            <div><span className="font-bold">Password:</span> admin123</div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
    setShowProductModal(false);
  };
  const handleEditProduct = (product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    setEditProduct(null);
    setShowProductModal(false);
  };
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleToggleBlockUser = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u));
  };

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;

  return (
    <div className="min-h-screen flex bg-night text-white">
      <aside className="w-64 bg-white/10 border-r border-white/20 flex flex-col p-6 justify-between min-h-screen">
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-8">Admin Dashboard</h2>
          <nav className="flex flex-col gap-2">
            {sections.map(sec => (
              <button
                key={sec.id}
                className={`text-left px-4 py-2 rounded-lg font-medium sidebar-btn${active === sec.id ? ' active' : ''}`}
                onClick={() => setActive(sec.id)}
              >
                {sec.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          className="w-full mt-8 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
          onClick={() => setIsFakeAdmin(false)}
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-10">
        {active === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-semibold">Product Management</div>
                <div className="relative">
                  <button
                    ref={bellRef}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition relative"
                    onClick={() => setShowNotifications(v => !v)}
                  >
                    <span className="text-2xl">🔔</span>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{notifications.length}</span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 min-w-[16rem] bg-night border border-white/20 rounded-xl shadow-2xl z-50 p-4">
                      <div className="font-semibold text-white mb-2">Notifications</div>
                      <ul className="space-y-2">
                        {notifications.map(n => (
                          <li key={n.id} className="text-white/80 text-sm flex flex-col border-b border-white/10 pb-2 last:border-b-0">
                            <span>{n.message}</span>
                            <span className="text-xs text-gray-400 mt-1">{n.time}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700" onClick={() => { setShowProductModal(true); setEditProduct(null); }}>Add Product</button>
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-4 mb-4 bg-white/10 p-3 rounded-xl border border-white/20">
                <span className="text-white/80">{selectedProducts.length} selected</span>
                <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                  setProducts(products.filter(p => !selectedProducts.includes(p.id)));
                  setSelectedProducts([]);
                }}>Delete Selected</button>
                <button className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white" onClick={() => setSelectedProducts([])}>Clear</button>
              </div>
            )}
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full bg-white/10 text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2"><input type="checkbox" checked={selectedProducts.length === products.length && products.length > 0} onChange={e => setSelectedProducts(e.target.checked ? products.map(p => p.id) : [])} /></th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-white/10">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-2"><img src={product.images?.[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" /></td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">₹{product.price.toLocaleString()}</td>
                      <td className="px-4 py-2">{product.stock ?? 10}</td>
                      <td className="px-4 py-2">{product.isNew ? 'New' : 'Active'}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600" onClick={() => { setEditProduct(product); setShowProductModal(true); }}>Edit</button>
                        <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(showProductModal || editProduct) && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-night p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4 gradient-text">{editProduct ? 'Edit' : 'Add'} Product</h3>
                  <ProductForm
                    initial={editProduct}
                    onSave={editProduct ? handleEditProduct : handleAddProduct}
                    onCancel={() => { setShowProductModal(false); setEditProduct(null); }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {active === 'orders' && (
          <div>
            <div className="text-2xl font-semibold mb-6">Order Management</div>
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div>
                <label className="block text-sm text-white/70 mb-1">Status</label>
                <select value={orderFilter.status} onChange={e => setOrderFilter(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white">
                  <option value="">All</option>
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">User</label>
                <input type="text" value={orderFilter.user} onChange={e => setOrderFilter(f => ({ ...f, user: e.target.value }))} placeholder="User name" className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Date</label>
                <input type="date" value={orderFilter.date} onChange={e => setOrderFilter(f => ({ ...f, date: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" />
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full bg-white/10 text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(order =>
                    (!orderFilter.status || order.status === orderFilter.status) &&
                    (!orderFilter.user || order.user.toLowerCase().includes(orderFilter.user.toLowerCase())) &&
                    (!orderFilter.date || order.date === orderFilter.date)
                  ).map(order => (
                    <tr key={order.id} className="border-b border-white/10">
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.user}</td>
                      <td className="px-4 py-2">₹{order.total.toLocaleString()}</td>
                      <td className="px-4 py-2">{order.status}</td>
                      <td className="px-4 py-2">{order.date}</td>
                      <td className="px-4 py-2">{order.items}</td>
                      <td className="px-4 py-2">
                        <select value={order.status} onChange={e => handleUpdateOrderStatus(order.id, e.target.value)} className="bg-white/10 border border-white/20 rounded px-2 py-1">
                          <option>Pending</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                        <button className="ml-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600" onClick={() => setOrderDetails(order)}>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orderDetails && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-night p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 relative">
                  <button className="absolute top-4 right-4 text-white text-xl bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600" onClick={() => setOrderDetails(null)}>×</button>
                  <h3 className="text-2xl font-bold mb-4 gradient-text">Order Details</h3>
                  <div className="mb-2 text-white/80">Order ID: <span className="font-semibold">{orderDetails.id}</span></div>
                  <div className="mb-2 text-white/80">User: <span className="font-semibold">{orderDetails.user}</span></div>
                  <div className="mb-2 text-white/80">Total: <span className="font-semibold">₹{orderDetails.total.toLocaleString()}</span></div>
                  <div className="mb-2 text-white/80">Status: <span className="font-semibold">{orderDetails.status}</span></div>
                  <div className="mb-2 text-white/80">Date: <span className="font-semibold">{orderDetails.date}</span></div>
                  <div className="mb-4 text-white/80">Items: <span className="font-semibold">{orderDetails.items}</span></div>
                  <div className="mb-4">
                    <div className="font-semibold mb-2 text-white">Products:</div>
                    <ul className="list-disc pl-6 text-white/90">
                      {orderDetails.products?.map((p, i) => (
                        <li key={i}>{p.name} × {p.qty}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2 text-white">Status History:</div>
                    <ul className="list-disc pl-6 text-white/90">
                      {orderDetails.history?.map((h, i) => (
                        <li key={i}>{h.status} on {h.date}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {active === 'users' && (
          <div>
            <div className="text-2xl font-semibold mb-6">User Management</div>
            <div className="mb-6 flex gap-4 items-end">
              <input
                type="text"
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                placeholder="Search by name or email"
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full bg-white/10 text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Registered</th>
                    <th className="px-4 py-2">Last Login</th>
                    <th className="px-4 py-2">Orders</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user =>
                    !userFilter ||
                    user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
                    user.email.toLowerCase().includes(userFilter.toLowerCase())
                  ).map(user => (
                    <tr key={user.id} className="border-b border-white/10">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.registered}</td>
                      <td className="px-4 py-2">{user.lastLogin}</td>
                      <td className="px-4 py-2">{user.orderCount}</td>
                      <td className="px-4 py-2">
                        <select
                          value={user.role}
                          onChange={e => setUsers(users.map(u => u.id === user.id ? { ...u, role: e.target.value } : u))}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">{user.blocked ? 'Blocked' : 'Active'}</td>
                      <td className="px-4 py-2">
                        <button className={`px-3 py-1 rounded ${user.blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`} onClick={() => handleToggleBlockUser(user.id)}>
                          {user.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button className="ml-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600" onClick={() => alert('Password reset link sent (mock)!')}>Reset Password</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {active === 'analytics' && (
          <div>
            <div className="text-2xl font-semibold mb-6">Sales Analytics</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold gradient-text">₹{totalSales.toLocaleString()}</div>
                <div className="text-lg mt-2">Total Sales</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold gradient-text">{totalOrders}</div>
                <div className="text-lg mt-2">Total Orders</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold gradient-text">{totalUsers}</div>
                <div className="text-lg mt-2">Total Users</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-xl p-8">
                <div className="text-lg font-semibold mb-4 text-white">Sales Over Time</div>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Sales',
                        data: [12000, 15000, 18000, 14000, 20000, 22000],
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168,85,247,0.2)',
                        tension: 0.4
                      }
                    ]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                  height={200}
                />
              </div>
              <div className="bg-white/10 rounded-xl p-8">
                <div className="text-lg font-semibold mb-4 text-white">Top Products</div>
                <Bar
                  data={{
                    labels: ['Headphones', 'Keyboard', 'Monitor', 'Mouse', 'Cable'],
                    datasets: [
                      {
                        label: 'Units Sold',
                        data: [120, 90, 70, 60, 40],
                        backgroundColor: [
                          '#a855f7', '#f472b6', '#6366f1', '#fbbf24', '#34d399'
                        ]
                      }
                    ]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                  height={200}
                />
              </div>
              <div className="bg-white/10 rounded-xl p-8 md:col-span-2">
                <div className="text-lg font-semibold mb-4 text-white">User Growth</div>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Users',
                        data: [10, 30, 60, 90, 120, 150],
                        borderColor: '#f472b6',
                        backgroundColor: 'rgba(244,114,182,0.2)',
                        tension: 0.4
                      }
                    ]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                  height={200}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [stock, setStock] = useState(initial?.stock || 10);
  const [image, setImage] = useState(initial?.images?.[0] || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.images?.[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onSave({
      ...initial,
      name,
      price: Number(price),
      stock: Number(stock),
      images: [imagePreview || image],
      isNew: initial?.isNew || false
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={e => setStock(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
      />
      <div className="flex flex-col gap-2">
        <label className="text-white/80">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg mt-2 border border-white/20" />
        )}
      </div>
      <div className="flex gap-4 mt-2">
        <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700">Save</button>
        <button type="button" className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 