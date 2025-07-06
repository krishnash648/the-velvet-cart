import { motion } from 'framer-motion';

const orderStatuses = {
  'pending': {
    label: 'Order Placed',
    description: 'Your order has been successfully placed',
    icon: '📋',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  'confirmed': {
    label: 'Order Confirmed',
    description: 'We have confirmed your order and are preparing it',
    icon: '✅',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  'processing': {
    label: 'Processing',
    description: 'Your order is being processed and packed',
    icon: '📦',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  'shipped': {
    label: 'Shipped',
    description: 'Your order has been shipped and is on its way',
    icon: '🚚',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  'out_for_delivery': {
    label: 'Out for Delivery',
    description: 'Your order is out for delivery today',
    icon: '🛵',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  'delivered': {
    label: 'Delivered',
    description: 'Your order has been successfully delivered',
    icon: '🎉',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  'cancelled': {
    label: 'Cancelled',
    description: 'Your order has been cancelled',
    icon: '❌',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20'
  }
};

const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderTracking({ order }) {
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    return estimatedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
            <p className="text-gray-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[order.status].bgColor} ${orderStatuses[order.status].color}`}>
              {orderStatuses[order.status].label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Amount:</span>
            <p className="text-white font-semibold">₹{order.total?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-400">Items:</span>
            <p className="text-white">{order.items?.length || 0} items</p>
          </div>
          <div>
            <span className="text-gray-400">Payment:</span>
            <p className="text-white">{order.paymentMethod}</p>
          </div>
        </div>

        {order.status !== 'cancelled' && (
          <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <p className="text-blue-300 text-sm">
              📅 Estimated delivery: {getEstimatedDelivery()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-6">Order Progress</h4>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
          <div className="space-y-6">
            {statusOrder.map((status, index) => {
              const statusInfo = orderStatuses[status];
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex && !isCancelled;
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    isCompleted 
                      ? `${statusInfo.bgColor} ${statusInfo.color}` 
                      : 'bg-gray-600 text-gray-400'
                  }`}>
                    {statusInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className={`font-semibold ${
                        isCompleted ? 'text-white' : 'text-gray-400'
                      }`}>
                        {statusInfo.label}
                      </h5>
                      {isCurrent && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isCompleted ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {statusInfo.description}
                    </p>
                    {order.statusTimeline?.[status] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(order.statusTimeline[status])}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Shipping Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-white mb-2">Delivery Address</h5>
              <div className="text-gray-300 text-sm space-y-1">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
            {order.trackingNumber && (
              <div>
                <h5 className="font-medium text-white mb-2">Tracking Details</h5>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>Tracking Number: <span className="text-white font-mono">{order.trackingNumber}</span></p>
                  <p>Courier: {order.courier || 'Standard Delivery'}</p>
                  {order.estimatedDelivery && (
                    <p>Estimated: {formatDate(order.estimatedDelivery)}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h6 className="font-medium text-white">{item.name}</h6>
                <p className="text-sm text-gray-400">{item.brand}</p>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-sm text-gray-400">₹{item.price.toLocaleString()} each</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
          Download Invoice
        </button>
        <button className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300">
          Contact Support
        </button>
      </div>
    </div>
  );
} 