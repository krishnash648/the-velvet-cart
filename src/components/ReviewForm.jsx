import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ReviewForm({ productId, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    
    const review = {
      id: Date.now(),
      productId,
      userId: user.uid,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      helpful: 0,
      reported: false
    };

    try {
      await onSubmit(review);
      toast.success('Review submitted successfully! ⭐');
      setRating(0);
      setComment('');
      onCancel();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating, interactive = true) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || currentRating);
      
      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-all duration-200 ${
            isFilled ? 'text-yellow-400' : 'text-gray-400'
          } ${interactive ? 'hover:scale-110 cursor-pointer' : ''}`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          {isFilled ? '★' : '☆'}
        </button>
      );
    });
  };

  if (!user) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
        <p className="text-gray-300">Please log in to write a review.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Write a Review</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Rating
          </label>
          <div className="flex gap-1">
            {renderStars(rating)}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select your rating'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows="4"
            maxLength="500"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-400">
              {comment.length}/500 characters
            </p>
            <p className="text-xs text-gray-400">
              {comment.length >= 10 ? '✓' : 'Minimum 10 characters'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.length < 10}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              isSubmitting || rating === 0 || comment.length < 10
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
} 