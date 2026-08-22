import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, query, where, limit } from 'firebase/firestore';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  status?: string;
  userId?: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Rajesh Kumar Singh',
    text: 'AbsTracker AIS-140 GPS device lagwaya apne 10 trucks me. Patna RTO me passing bina kisi dikkat ke turant ho gaya. Best service!',
    rating: 5,
    date: '2025-01-15'
  },
  {
    id: '2',
    name: 'Vikram Transport Logistics',
    text: 'Very accurate live location and speed alerts. App interface is fast, and customer support resolves queries in 10 minutes.',
    rating: 5,
    date: '2025-02-01'
  },
  {
    id: '3',
    name: 'Amit Sharma (School Bus Fleet)',
    text: 'Installed in 15 school buses. Parents are very satisfied with live tracking notifications and SOS emergency alerts.',
    rating: 5,
    date: '2025-02-10'
  }
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setLoading(true);
      const q = query(collection(db, 'reviews'), where('status', '==', 'approved'), limit(50));
      const querySnapshot = await getDocs(q);
      const fetchedReviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      
      fetchedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (fetchedReviews.length > 0) {
        setReviews(fetchedReviews.slice(0, 10));
      } else {
        setReviews(DEFAULT_REVIEWS);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
      setReviews(DEFAULT_REVIEWS);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login?redirect=home');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setSubmitError('Review must be at least 10 characters long.');
      return;
    }
    
    setSubmitError('');
    setSubmitLoading(true);
    try {
      const newReview = {
        status: 'pending',
        name: currentUser.displayName || 'Verified Vehicle Owner',
        text: reviewText,
        rating,
        date: new Date().toISOString(),
        userId: currentUser.uid
      };
      
      await addDoc(collection(db, 'reviews'), newReview);
      setShowForm(false);
      setReviewText('');
      setRating(5);
      alert('Thank you! Your review has been submitted for approval.');
    } catch (error) {
      console.error("Error adding review", error);
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-white border-b border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">Customer Testimonials</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Trusted by 15,000+ Transporters</h3>
          </div>
          <button aria-label="Button action"  
            onClick={() => {
              if(!currentUser) {
                navigate('/login?redirect=home');
              } else {
                setShowForm(!showForm);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            <MessageSquarePlus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-slate-50 p-8 rounded-3xl shadow-xl border border-red-200 max-w-2xl mx-auto">
                <h4 className="text-2xl font-black text-slate-900 mb-6">Share Your Experience</h4>
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-200">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button aria-label="Button action" 
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-xl transition-colors ${rating >= star ? 'bg-amber-100 text-amber-500' : 'bg-white text-slate-400 hover:bg-slate-200'} border border-slate-200`}
                        >
                          <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-500' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Review</label>
                    <textarea
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 transition-all text-slate-900 font-medium resize-none"
                      placeholder="Share details about GPS fitting, RTO certificate, and app experience..."
                    ></textarea>
                  </div>

                  <button aria-label="Button action" 
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Submit Review'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 sm:p-10 rounded-[2rem] shadow-sm hover:shadow-xl border-2 border-slate-200 hover:border-red-400 flex flex-col justify-between relative group transition-all duration-300"
              >
                <div className="absolute -top-5 left-8 w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                  <Quote className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex gap-1 mb-6 mt-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`w-4 h-4 ${idx < test.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 fill-slate-300'}`} />
                    ))}
                  </div>
                  <p className="text-slate-700 font-medium mb-8 leading-relaxed text-base">"{test.text}"</p>
                </div>
                
                <div className="pt-5 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center font-black text-red-700 text-base uppercase">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
