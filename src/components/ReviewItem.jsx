import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ReviewItem({ review, onHelpful, onReport, onDelete }) {
  const { user } = useAuth();
  const [isHelpful, setIsHelpful] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      
      return (
        <span
          key={index}
          className={`text-sm ${isFilled ? 'text-yellow-400' : 'text-gray-400'}`}
        >
          {isFilled ? '★' : '☆'}
        </span>
      );
    });
  };

  const handleHelpful = () => {
    if (!user) {
      toast.error('Please log in to mark reviews as helpful');
      return;
    }
    
    if (!isHelpful) {
      setIsHelpful(true);
      onHelpful(review.id);
      toast.success('Marked as helpful! 👍');
    }
  };

  const handleReport = () => {
    if (!user) {
      toast.error('Please log in to report reviews');
      return;
    }
    
    if (user.uid === review.userId) {
      toast.error('You cannot report your own review');
      return;
    }
    
    setShowReportDialog(true);
  };

  const confirmReport = () => {
    onReport(review.id);
    setShowReportDialog(false);
    toast.success('Review reported. Thank you for helping us maintain quality!');
  };

  const handleDelete = () => {
    if (user.uid !== review.userId) {
      toast.error('You can only delete your own reviews');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDelete(review.id);
      toast.success('Review deleted successfully');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            {review.userName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-white">{review.userName}</h4>
            <p className="text-sm text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {renderStars(review.rating)}
          </div>
          {user && user.uid === review.userId && (
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
              title="Delete review"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-200 leading-relaxed mb-4">{review.comment}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpful}
            disabled={isHelpful}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isHelpful 
                ? 'text-green-400 cursor-default' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>👍</span>
            <span>{review.helpful + (isHelpful ? 1 : 0)}</span>
            <span>Helpful</span>
          </button>
          
          {user && user.uid !== review.userId && (
            <button
              onClick={handleReport}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <span>🚩</span>
              <span>Report</span>
            </button>
          )}
        </div>

        {review.verified && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            ✓ Verified Purchase
          </span>
        )}
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowReportDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Report Review</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to report this review? This helps us maintain quality standards.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmReport}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors"
              >
                Report
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="flex-1 bg-white/10 text-white py-2 px-4 rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 