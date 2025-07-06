const products = [
  {
    id: 1,
    name: 'Wireless Noise Cancelling Headphones',
    price: 2999,
    originalPrice: 3999,
    category: 'Audio',
    brand: 'Sony',
    rating: 4.5,
    reviews: 128,
    stock: 15,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    features: ['Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.0', 'Touch Controls'],
    images: [
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://assets.bosecreative.com/transform/775c3e9a-fcd1-489f-a2f7-a57ac66464e1/SF_QCUH_deepplum_gallery_1_816x612_x2?quality=90&io=width:400,height:300,transform:fit&io=width:400,height:300,transform:fit',
    isNew: true,
    isOnSale: true,
    discount: 25
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 4999,
    originalPrice: 5999,
    category: 'Wearables',
    brand: 'Apple',
    rating: 4.8,
    reviews: 256,
    stock: 8,
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and water resistance up to 50m.',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
    images: [
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://cdn.mos.cms.futurecdn.net/Pk5ydxYo6ty2Q4SX9vznP6.jpg',
    isNew: false,
    isOnSale: true,
    discount: 17
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    price: 1999,
    originalPrice: 2499,
    category: 'Audio',
    brand: 'JBL',
    rating: 4.3,
    reviews: 89,
    stock: 22,
    description: 'Compact portable speaker with 360-degree sound, waterproof design, and 12-hour playback.',
    features: ['360° Sound', 'Waterproof', '12-hour Battery', 'Party Mode'],
    images: [
      'https://storio.in/cdn/shop/files/71kl33XC3pL.jpg?v=1736418030',
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://storio.in/cdn/shop/files/71kl33XC3pL.jpg?v=1736418030',
    isNew: false,
    isOnSale: false,
    discount: 0
  },
  {
    id: 4,
    name: 'RGB Gaming Mouse',
    price: 1499,
    originalPrice: 1999,
    category: 'Accessories',
    brand: 'Logitech',
    rating: 4.6,
    reviews: 167,
    stock: 12,
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    features: ['RGB Lighting', 'Programmable Buttons', 'High DPI Sensor', 'Ergonomic Design'],
    images: [
      'https://archertechlab.com/cdn/shop/products/400-3_1200x1200_crop_center.png?v=1750658032',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',

    ],
    image: 'https://archertechlab.com/cdn/shop/products/400-3_1200x1200_crop_center.png?v=1750658032' + new Date().getTime(),
    isNew: true,
    isOnSale: true,
    discount: 25
  },
  {
    id: 5,
    name: '4K Ultra HD Smart TV',
    price: 45999,
    originalPrice: 54999,
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.7,
    reviews: 342,
    stock: 5,
    description: '55-inch 4K Ultra HD Smart TV with HDR, built-in streaming apps, and voice control.',
    features: ['4K Ultra HD', 'HDR Technology', 'Smart TV', 'Voice Control'],
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://aws-obg-image-lb-3.tcl.com/content/dam/iffalcon/product/tv/s-series/s53/id-image/2.png',
    isNew: false,
    isOnSale: true,
    discount: 16
  },
  {
    id: 6,
    name: 'Wireless Mechanical Keyboard',
    price: 3499,
    originalPrice: 4299,
    category: 'Accessories',
    brand: 'Corsair',
    rating: 4.4,
    reviews: 94,
    stock: 18,
    description: 'Premium mechanical keyboard with Cherry MX switches, RGB backlighting, and wireless connectivity.',
    features: ['Cherry MX Switches', 'RGB Backlighting', 'Wireless', 'Aluminum Frame'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511452885600-a2f0b4a5b0c2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://pinkgaming.shop/cdn/shop/files/pink-cute-cat-design-wireless-mechanical-keyboard_2048x.jpg?v=1724946951',
    isNew: true,
    isOnSale: false,
    discount: 0
  },
  {
    id: 7,
    name: 'Action Camera',
    price: 8999,
    originalPrice: 10999,
    category: 'Electronics',
    brand: 'GoPro',
    rating: 4.9,
    reviews: 203,
    stock: 7,
    description: '4K action camera with image stabilization, waterproof case, and 360-degree capture.',
    features: ['4K Recording', 'Image Stabilization', 'Waterproof', '360° Capture'],
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://cameraclub.in/cdn/shop/files/Untitleddesign_5_95ac4bcc-c06f-44fd-b8de-d456a1ee0a39.png?v=1713357560',
    isNew: false,
    isOnSale: true,
    discount: 18
  },
  {
    id: 8,
    name: 'Wireless Earbuds',
    price: 2499,
    originalPrice: 2999,
    category: 'Audio',
    brand: 'Apple',
    rating: 4.6,
    reviews: 189,
    stock: 25,
    description: 'True wireless earbuds with active noise cancellation and spatial audio technology.',
    features: ['Active Noise Cancellation', 'Spatial Audio', 'Wireless Charging', 'Sweat Resistant'],
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1512446733611-9099a758e63c?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://www.zdnet.com/a/img/resize/f00be25dc9dbc38bb2d31641e69e33139d9ab53a/2024/02/14/07e7dfb9-8c65-4d03-a629-b9fc36f42bfd/dsc01521-2.jpg?auto=webp&fit=crop&height=675&width=1200',
    isNew: false,
    isOnSale: true,
    discount: 17
  },
  {
    id: 9,
    name: 'Android Tablet 10.1"',
    price: 15999,
    originalPrice: 18999,
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.4,
    reviews: 112,
    stock: 14,
    description: '10.1-inch Android tablet with HD display, long battery life, and fast performance for work and play.',
    features: ['10.1" HD Display', 'Octa-core Processor', 'Long Battery', 'Expandable Storage'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://www.digitaltrends.com/wp-content/uploads/2024/06/lenovo-tab-plus-2024-official-1.jpg?fit=720%2C479&p=1',
    isNew: true,
    isOnSale: false,
    discount: 0
  },
  {
    id: 10,
    name: 'Gaming Headset Pro',
    price: 3499,
    originalPrice: 3999,
    category: 'Audio',
    brand: 'Corsair',
    rating: 4.7,
    reviews: 98,
    stock: 20,
    description: 'Surround sound gaming headset with noise-cancelling mic and RGB lighting.',
    features: ['Surround Sound', 'Noise Cancelling Mic', 'RGB Lighting', 'Comfort Fit'],
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://www.eksa.net/cdn/shop/files/E900ProYellow_5104bed1-2393-4a32-93b0-c02bb12c0f20.png?v=1706768415&width=720',
    isNew: true,
    isOnSale: true,
    discount: 12
  },
  {
    id: 11,
    name: 'DSLR Camera 24MP',
    price: 39999,
    originalPrice: 45999,
    category: 'Electronics',
    brand: 'Canon',
    rating: 4.8,
    reviews: 67,
    stock: 6,
    description: '24MP DSLR camera with fast autofocus, Wi-Fi, and full HD video recording.',
    features: ['24MP Sensor', 'Wi-Fi', 'Full HD Video', 'Fast Autofocus'],
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://i.reincubate.com/i/mirrorless-dslr-cover.png',
    isNew: false,
    isOnSale: true,
    discount: 13
  },
  {
    id: 12,
    name: 'Power Bank 20000mAh',
    price: 1499,
    originalPrice: 1999,
    category: 'Accessories',
    brand: 'Mi',
    rating: 4.5,
    reviews: 154,
    stock: 30,
    description: 'High-capacity 20000mAh power bank with fast charging and dual USB output.',
    features: ['20000mAh', 'Fast Charging', 'Dual USB', 'Slim Design'],
    images: [
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://www.mytrendyphone.eu/images/Cyke-P1-Plus-Wireless-Power-Bank-20000mAh-Green-15092020-01-p.webp',
    isNew: false,
    isOnSale: false,
    discount: 0
  },
  {
    id: 13,
    name: 'Smart Home Speaker',
    price: 2999,
    originalPrice: 3499,
    category: 'Audio',
    brand: 'Google',
    rating: 4.6,
    reviews: 88,
    stock: 17,
    description: 'Voice-controlled smart speaker with Google Assistant and multi-room audio.',
    features: ['Voice Control', 'Google Assistant', 'Multi-room Audio', 'Wi-Fi'],
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    ],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGCCWx0g1gSB1F1U47Aoy0N4c8gZ1e2imLdA&s',
    isNew: true,
    isOnSale: true,
    discount: 14
  }
];

export default products;
