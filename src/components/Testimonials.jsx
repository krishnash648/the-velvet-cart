const testimonials = [
  {
    name: 'Aarav S.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    quote: 'Absolutely love the Velvet Cart experience! Fast delivery and top-notch products.'
  },
  {
    name: 'Priya M.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.5,
    quote: 'The product quality is amazing and the support team is super helpful. Highly recommended!'
  },
  {
    name: 'Rahul K.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 5,
    quote: 'Best online gadget store! The deals and offers are unbeatable.'
  },
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <span className="text-yellow-400">
      {'★'.repeat(full)}{half ? '☆' : ''}
    </span>
  );
};

const Testimonials = () => (
  <div className="max-w-6xl mx-auto px-4 my-20">
    <h2 className="text-2xl md:text-3xl font-extrabold mb-8 gradient-text text-center">What Our Customers Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
          <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-4 border-white/20 shadow-md" />
          <div className="font-bold text-lg text-white mb-1">{t.name}</div>
          <div className="mb-2">{renderStars(t.rating)}</div>
          <p className="text-gray-200 text-base italic">“{t.quote}”</p>
        </div>
      ))}
    </div>
  </div>
);

export default Testimonials; 