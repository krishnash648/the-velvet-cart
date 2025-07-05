const badges = [
  { icon: '✅', text: '100% Genuine Products' },
  { icon: '🔒', text: 'Secure Payments' },
  { icon: '⚡', text: 'Fast Delivery' },
  { icon: '🔄', text: 'Easy Returns' },
];

const TrustBadgesRow = () => (
  <div className="flex flex-wrap justify-center gap-8 my-12 bg-white/5 rounded-2xl shadow-lg py-6 px-4 max-w-5xl mx-auto">
    {badges.map((badge, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <span className="text-2xl">{badge.icon}</span>
        <span className="font-semibold text-white text-base md:text-lg drop-shadow">{badge.text}</span>
      </div>
    ))}
  </div>
);

export default TrustBadgesRow; 