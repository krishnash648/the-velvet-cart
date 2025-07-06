import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import { toast } from 'react-hot-toast';

export default function ReviewsSection({ productId, productName }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${productId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [productId]);

  useEffect(() => {
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
  }, [reviews, productId]);

  useEffect(() => {
    if (user) {
      const hasReviewed = reviews.some(review => review.userId === user.uid);
      setUserHasReviewed(hasReviewed);
    }
  }, [reviews, user]);

  const handleSubmitReview = async (review) => {
    setReviews(prev => [review, ...prev]);
    setUserHasReviewed(true);
  };

  const handleHelpful = (reviewId) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const handleReport = (reviewId) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, reported: true }
          : review
      )
    );
  };

  const handleDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    setUserHasReviewed(false);
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews.filter(review => !review.reported);
    
    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return filtered.sort((a, b) => b.helpful - a.helpful);
      default:
        return filtered;
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const filteredReviews = getFilteredAndSortedReviews();
  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold gradient-text">{averageRating}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {i < Math.floor(averageRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>

        {user && !userHasReviewed && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Write a Review
          </motion.button>
        )}

        {userHasReviewed && (
          <span className="text-green-400 text-sm">✓ You've reviewed this product</span>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">Rating Breakdown</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-white">{rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Filter by rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value={0}>All ratings</option>
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>

          <span className="text-sm text-gray-400">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </span>
        </div>
      )}

      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            productId={productId}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                onReport={handleReport}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
            <p className="text-gray-300">
              {filterRating > 0 
                ? `No reviews with ${filterRating} star${filterRating > 1 ? 's' : ''} rating`
                : 'Be the first to review this product!'
              }
            </p>
            {!user && (
              <button
                onClick={() => toast.error('Please log in to write a review')}
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Write a Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 