import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTracking from '../components/OrderTracking';
import { toast } from 'react-hot-toast';

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock order data - in a real app, this would come from a database
  const mockOrders = [
    {
      id: 'ORD001',
      status: 'delivered',
      createdAt: '2024-01-15T10:30:00Z',
      total: 8999,
      items: [
        {
          name: 'Action Camera',
          brand: 'GoPro',
          price: 8999,
          quantity: 1,
          image: 'https://cameraclub.in/cdn/shop/files/Untitleddesign_5_95ac4bcc-c06f-44fd-b8de-d456a1ee0a39.png?v=1713357560'
        }
      ],
      paymentMethod: 'Credit Card',
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210'
      },
      trackingNumber: 'TRK123456789',
      courier: 'Blue Dart',
      estimatedDelivery: '2024-01-20T15:00:00Z',
      statusTimeline: {
        pending: '2024-01-15T10:30:00Z',
        confirmed: '2024-01-15T14:00:00Z',
        processing: '2024-01-16T09:00:00Z',
        shipped: '2024-01-17T11:00:00Z',
        out_for_delivery: '2024-01-20T08:00:00Z',
        delivered: '2024-01-20T14:30:00Z'
      }
    },
    {
      id: 'ORD002',
      status: 'shipped',
      createdAt: '2024-01-18T16:45:00Z',
      total: 6498,
      items: [
        {
          name: 'Wireless Noise Cancelling Headphones',
          brand: 'Sony',
          price: 2999,
          quantity: 1,
          image: 'https://assets.bosecreative.com/transform/775c3e9a-fcd1-489f-a2f7-a57ac66464e1/SF_QCUH_deepplum_gallery_1_816x612_x2?quality=90&io=width:400,height:300,transform:fit&io=width:400,height:300,transform=fit'
        },
        {
          name: 'Smart Fitness Watch',
          brand: 'Apple',
          price: 3499,
          quantity: 1,
          image: 'https://cdn.mos.cms.futurecdn.net/Pk5ydxYo6ty2Q4SX9vznP6.jpg'
        }
      ],
      paymentMethod: 'UPI',
      shippingAddress: {
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91 9876543211'
      },
      trackingNumber: 'TRK987654321',
      courier: 'DTDC',
      estimatedDelivery: '2024-01-25T15:00:00Z',
      statusTimeline: {
        pending: '2024-01-18T16:45:00Z',
        confirmed: '2024-01-18T18:00:00Z',
        processing: '2024-01-19T10:00:00Z',
        shipped: '2024-01-20T14:00:00Z'
      }
    }
  ];

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      
      if (order) {
        setTrackingOrder(order);
        toast.success('Order found!');
      } else {
        toast.error('Order not found. Please check your order ID.');
        setTrackingOrder(null);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-night text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to track orders</h2>
          <p className="text-gray-400">You need to be logged in to access order tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-night text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Track Your Order</h1>
          <p className="text-gray-400">Enter your order ID to track your delivery status</p>
        </div>

        {/* Track Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
        >
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., ORD001, ORD002)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          {/* Sample Order IDs */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 mb-2">Sample Order IDs for testing:</p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-purple-400">ORD001</span>
              <span className="text-purple-400">ORD002</span>
            </div>
          </div>
        </motion.div>

        {/* Order Tracking Result */}
        <AnimatePresence>
          {trackingOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OrderTracking order={trackingOrder} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Orders */}
        {user.orders && user.orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Recent Orders</h2>
            <div className="grid gap-4">
              {user.orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setOrderId(order.id);
                    handleTrackOrder({ preventDefault: () => {} });
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">Order #{order.id}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{order.total?.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 