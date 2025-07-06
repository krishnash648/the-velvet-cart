import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-blush rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-400 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;

export const ProductSkeleton = () => (
  <div className="card animate-pulse flex flex-col gap-4">
    <div className="h-40 bg-gray-300/20 rounded-xl" />
    <div className="h-6 w-3/4 bg-gray-300/20 rounded" />
    <div className="h-4 w-1/2 bg-gray-300/20 rounded" />
    <div className="h-4 w-1/3 bg-gray-300/20 rounded" />
    <div className="flex gap-2 mt-2">
      <div className="h-8 w-20 bg-gray-300/20 rounded" />
      <div className="h-8 w-8 bg-gray-300/20 rounded" />
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <div className="space-y-8">
    <div className="h-96 bg-gray-300/20 rounded-2xl animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-4">
      <div className="h-96 bg-gray-300/20 rounded-2xl animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-300/20 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <div className="h-8 w-3/4 bg-gray-300/20 rounded animate-pulse" />
      <div className="h-6 w-1/2 bg-gray-300/20 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-300/20 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-300/20 rounded animate-pulse" />
      <div className="h-12 w-32 bg-gray-300/20 rounded-lg animate-pulse" />
    </div>
  </div>
);

export const CartSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-card border border-card rounded-lg">
        <div className="w-24 h-24 bg-gray-300/20 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-gray-300/20 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-300/20 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-300/20 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export const AdminSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 bg-card border border-card rounded-lg">
          <div className="h-6 w-1/2 bg-gray-300/20 rounded animate-pulse mb-2" />
          <div className="h-8 w-3/4 bg-gray-300/20 rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="h-64 bg-gray-300/20 rounded-lg animate-pulse" />
  </div>
); 