import { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Search, Star } from 'lucide-react';

export default function AdminReviewManager({ reviews, setReviews }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const updateReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { status: newStatus });
      setReviews(reviews.map((r: any) => r.id === reviewId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews((prev: any) => prev.filter((r: any) => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review: any) => {
      const matchesSearch = review.name?.toLowerCase().includes(searchTerm.toLowerCase()) || review.text?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-medium text-slate-600"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentReviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            No reviews found.
          </div>
        ) : (
          currentReviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{review.name}</h3>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {review.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-6">"{review.text}"</p>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <select
                  value={review.status}
                  onChange={(e) => updateReviewStatus(review.id, e.target.value)}
                  className="text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
                <button aria-label="Button action"  
                  onClick={() => deleteReview(review.id)}
                  className="text-red-500 hover:text-red-600 text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, filteredReviews.length)}</span> of <span className="font-bold text-slate-900">{filteredReviews.length}</span> reviews
          </span>
          <div className="flex gap-2">
            <button aria-label="Button action"  
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button aria-label="Button action"  
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
