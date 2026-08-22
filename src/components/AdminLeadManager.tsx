import { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Download, ChevronLeft, ChevronRight, Search, PhoneCall, MessageCircle, Building2, Globe, Calendar, Filter } from 'lucide-react';

export default function AdminLeadManager({ leads, setLeads, downloadCSV }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'main' | 'dealers' | 'all'>('main');

  const deleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking lead?")) return;
    try {
      await deleteDoc(doc(db, "leads", leadId));
      setLeads((prev: any) => prev.filter((l: any) => l.id !== leadId));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "leads", leadId), { status: newStatus });
      setLeads((prev: any) => prev.map((l: any) => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead: any) => {
      const matchesSearch = 
        !searchTerm ||
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.phone?.includes(searchTerm) ||
        lead.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.dealerCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.dealerSlug?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = dateFilter === '' || new Date(lead.createdAt).toISOString().split('T')[0] === dateFilter;

      const isDealerLead = Boolean(lead.dealerId || lead.dealerDocId || lead.dealerSlug || lead.source === 'dealer_page');
      let matchesSource = true;
      if (sourceFilter === 'main') {
        matchesSource = !isDealerLead || lead.source === 'main_website';
      } else if (sourceFilter === 'dealers') {
        matchesSource = isDealerLead && lead.source !== 'main_website';
      }

      return matchesSearch && matchesDate && matchesSource;
    });
  }, [leads, searchTerm, dateFilter, sourceFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const mainLeadsCount = leads.filter((l: any) => !l.dealerId && !l.dealerDocId && l.source !== 'dealer_page').length;
  const dealerLeadsCount = leads.filter((l: any) => Boolean(l.dealerId || l.dealerDocId || l.dealerSlug || l.source === 'dealer_page')).length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Segment Tabs */}
      <div className="flex flex-col gap-4">
        {/* Source Segment Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => { setSourceFilter('main'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                sourceFilter === 'main' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Main Website Inquiries ({mainLeadsCount})
            </button>
            <button
              onClick={() => { setSourceFilter('dealers'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                sourceFilter === 'dealers' ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-100' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Franchise Dealer Bookings ({dealerLeadsCount})
            </button>
            <button
              onClick={() => { setSourceFilter('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                sourceFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({leads.length})
            </button>
          </div>

          <div className="text-xs font-medium text-slate-500 bg-blue-50/70 border border-blue-100 px-3.5 py-2 rounded-xl">
            {sourceFilter === 'main' ? (
              <span className="text-blue-900 font-semibold">Direct leads submitted on abstracker.in. Dealer page bookings are automatically routed to the dealer's portal.</span>
            ) : sourceFilter === 'dealers' ? (
              <span className="text-red-900 font-semibold">Franchise leads assigned to individual dealer login portals.</span>
            ) : (
              <span className="text-slate-700 font-semibold">Complete database view.</span>
            )}
          </div>
        </div>

        {/* Search, Date Filter & Export */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name, phone, vehicle, dealer..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-sm bg-white"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <input 
                type={dateFilter ? "date" : "text"}
                placeholder="Filter Date"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-40 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-medium text-sm text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={() => downloadCSV('leads')} 
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full lg:w-auto justify-center shadow-md text-sm"
          >
            <Download className="w-4 h-4" /> Export Leads CSV
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentLeads.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">
            No booking leads matching your filter.
          </div>
        ) : (
          currentLeads.map((lead: any) => {
            const isDealerLead = Boolean(lead.dealerId || lead.dealerDocId || lead.dealerSlug || lead.source === 'dealer_page');
            const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
            const waMessage = encodeURIComponent(`Hello ${lead.name || 'Sir/Madam'}, thank you for contacting AbsTracker regarding GPS installation for your ${lead.vehicle || 'vehicle'}. How can we assist you?`);

            return (
              <div key={lead.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative group flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg bg-slate-100 transition-colors"
                      title="Delete Lead"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>

                  {/* Customer Info */}
                  <h3 className="font-black text-xl text-slate-900 mb-0.5">{lead.name}</h3>
                  <a href={`tel:${lead.phone}`} className="text-red-600 font-bold text-sm hover:underline flex items-center gap-1 mb-3">
                    <PhoneCall className="w-3.5 h-3.5" /> {lead.phone}
                  </a>

                  {/* Channel Origin Badge */}
                  <div className="mb-4">
                    {isDealerLead ? (
                      <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-100 flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-black text-red-900 block">
                            Franchise: {lead.dealerName || lead.dealerSlug || lead.dealerId || 'Partner Dealer'}
                          </span>
                          {lead.dealerCity && (
                            <span className="text-red-600 font-medium">{lead.dealerCity} District</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-black text-blue-900">Main Website Inquiry</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {lead.vehicle && (
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Target Vehicle</span>
                        <p className="text-xs font-bold text-slate-800 bg-slate-100 inline-block px-2.5 py-1 rounded-lg">
                          {lead.vehicle}
                        </p>
                      </div>
                    )}

                    {lead.message && (
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Note</span>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                          "{lead.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</span>
                    <select
                      value={lead.status || 'new'}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`text-xs font-black px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        lead.status === 'installed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        lead.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        lead.status === 'closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Discussion</option>
                      <option value="installed">Installed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a 
                      href={`https://wa.me/${waPhone}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <a 
                      href={`tel:${lead.phone}`}
                      className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, filteredLeads.length)}</span> of <span className="font-bold text-slate-900">{filteredLeads.length}</span> bookings
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

