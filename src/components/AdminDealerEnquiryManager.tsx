import { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Download, ChevronLeft, ChevronRight, Search, CheckCircle } from 'lucide-react';

export default function AdminDealerEnquiryManager({ enquiries, setEnquiries, downloadCSV }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const deleteEnquiry = async (enquiryId: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteDoc(doc(db, "dealerEnquiries", enquiryId));
      setEnquiries((prev: any) => prev.filter((l: any) => l.id !== enquiryId));
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  const markAsContacted = async (enquiryId: string) => {
    try {
      await updateDoc(doc(db, "dealerEnquiries", enquiryId), {
        status: 'contacted'
      });
      setEnquiries((prev: any) => prev.map((l: any) => l.id === enquiryId ? { ...l, status: 'contacted' } : l));
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry: any) => {
      const matchesSearch = enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            enquiry.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            enquiry.phone?.includes(searchTerm);
      return matchesSearch;
    });
  }, [enquiries, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search enquiries by name, business or phone..." 
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          />
        </div>
        <button onClick={() => downloadCSV('dealerEnquiries')} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors w-full lg:w-auto justify-center shadow-md">
          <Download className="w-4 h-4" /> Export Enquiries
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEnquiries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            No dealer enquiries found.
          </div>
        ) : (
          currentEnquiries.map((enquiry: any) => (
            <div key={enquiry.id} className={`bg-white rounded-2xl p-6 border ${enquiry.status === 'contacted' ? 'border-green-200 bg-green-50/30' : 'border-slate-200'} shadow-sm relative group`}>
              <div className="absolute top-4 right-4 flex gap-2">
                {enquiry.status !== 'contacted' && (
                  <button 
                    onClick={() => markAsContacted(enquiry.id)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-green-500 rounded-lg bg-slate-100 transition-colors"
                    title="Mark as Contacted"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => deleteEnquiry(enquiry.id)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg bg-slate-100 transition-colors"
                  title="Delete Enquiry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              <div className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
                {enquiry.createdAt ? `${new Date(enquiry.createdAt?.toDate ? enquiry.createdAt.toDate() : enquiry.createdAt).toLocaleDateString()} ${new Date(enquiry.createdAt?.toDate ? enquiry.createdAt.toDate() : enquiry.createdAt).toLocaleTimeString()}` : 'Date unknown'}
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-lg text-slate-900">{enquiry.name}</h3>
                {enquiry.status === 'contacted' && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Contacted</span>
                )}
                {enquiry.status === 'new' && (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                )}
              </div>
              <p className="text-slate-600 font-bold mb-4">{enquiry.businessName}</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</span>
                    <a aria-label="Link"  href={`tel:${enquiry.phone}`} className="text-sm font-medium text-red-600 hover:underline">{enquiry.phone}</a>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</span>
                    <a href={`mailto:${enquiry.email}`} className="text-sm font-medium text-slate-700 hover:underline truncate block" title={enquiry.email}>{enquiry.email}</a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</span>
                    <p className="text-sm font-medium text-slate-700">{enquiry.city}, {enquiry.state}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Est. Volume</span>
                    <p className="text-sm font-medium text-slate-700">{enquiry.volume || 'N/A'}</p>
                  </div>
                </div>

                {enquiry.message && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</span>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{enquiry.message}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, filteredEnquiries.length)}</span> of <span className="font-bold text-slate-900">{filteredEnquiries.length}</span> enquiries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
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
