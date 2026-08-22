import { useState, useEffect } from 'react';
import { Mail, RefreshCcw, Trash2, X, Search, Inbox, Send, Archive, Star, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminWebmail() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [sentEmails, setSentEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '', from: 'AbsTracker <help@abstracker.in>' });
  const [sending, setSending] = useState(false);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [summaryGenerating, setSummaryGenerating] = useState(false);
  const [emailSummary, setEmailSummary] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMode, setAiMode] = useState<'text' | 'template'>('text');

  const [starredIds, setStarredIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('starred_emails') || '[]'); } catch { return []; }
  });
  const [archivedIds, setArchivedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('archived_emails') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('starred_emails', JSON.stringify(starredIds));
  }, [starredIds]);

  useEffect(() => {
    localStorage.setItem('archived_emails', JSON.stringify(archivedIds));
  }, [archivedIds]);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateData, setTemplateData] = useState({ name: '', subject: '', body: '' });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTemplate(true);
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      await addDoc(collection(db, 'email_templates'), {
        name: templateData.name || 'Custom Template',
        subject: templateData.subject,
        html: templateData.body,
        body: templateData.body,
        createdAt: new Date().toISOString()
      });
      
      alert('Template saved successfully! You can now load it when composing new messages.');
      setShowTemplateModal(false);
      setTemplateData({ name: '', subject: '', body: '' });
      fetchTemplates();
    } catch (err: any) {
      alert('Error saving template: ' + err.message);
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      const res = await fetch('https://abstracker.abstracker0.workers.dev/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeData.to,
          from: composeData.from,
          subject: composeData.subject,
          htmlBody: composeData.body
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      
      // Save to Firebase sent_emails as backup
      try {
        const { collection, addDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        await addDoc(collection(db, 'sent_emails'), {
          to: composeData.to,
          from: composeData.from,
          recipient: composeData.to,
          subject: composeData.subject,
          html: composeData.body,
          body: composeData.body,
          sentAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save to firebase", err);
      }
      
      setShowCompose(false);
      setComposeData({ to: '', subject: '', body: '', from: 'AbsTracker <help@abstracker.in>' });
      fetchSentEmails();
      alert('Email sent successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const loadWelcomeTemplate = async () => {
    try {
      // First try to load from Firebase 'email_templates'
      const { collection, getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const q = query(collection(db, 'email_templates'), orderBy('createdAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const template = snap.docs[0].data();
        setComposeData({
          ...composeData,
          subject: template.subject || 'Welcome to AbsTracker!',
          body: template.html || template.body || ''
        });
        return;
      }
    } catch (err) {
      console.error("Template load error", err);
    }
    
    // Fallback template
    setComposeData({
      ...composeData,
      subject: 'Welcome to AbsTracker!',
      body: `<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
  <h1 style="color: #4f46e5;">Welcome to AbsTracker!</h1>
  <p>We are thrilled to have you on board.</p>
  <p>Get started by exploring your dashboard and tracking your progress.</p>
  <br/>
  <p>Best regards,<br/>The AbsTracker Team</p>
</div>`
    });
  };

  const handleSummarize = async (email: any) => {
    try {
      setSummaryGenerating(true);
      setEmailSummary('');
      const res = await fetch('/api/ai/summarize-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: email.subject, 
          body: email.text_body || email.body || 'No content' 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize');
      setEmailSummary(data.summary);
    } catch (err: any) {
      alert('Error summarizing: ' + err.message);
    } finally {
      setSummaryGenerating(false);
    }
  };

  const handleReply = (email: any) => {
    setComposeData({
      to: email.sender || email.from || '',
      subject: email.subject.startsWith('Re:') ? email.subject : 'Re: ' + email.subject,
      body: '<br/><br/><blockquote>On ' + new Date(email.received_at || email.sentAt).toLocaleString() + ', ' + (email.sender || 'Sender') + ' wrote:<br/>' + (email.html_body || email.html || email.body || '') + '</blockquote>',
      from: 'AbsTracker <help@abstracker.in>'
    });
    setAiPrompt('Write a helpful reply to this email: ' + email.subject);
    setSelectedEmail(null);
    setShowCompose(true);
  };
  
  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://abstracker.abstracker0.workers.dev/api/emails?q=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('Failed to fetch emails');
      const data = await res.json();
      setEmails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentEmails = async () => {
    try {
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const q = query(collection(db, 'sent_emails'), orderBy('sentAt', 'desc'));
      const snapshot = await getDocs(q);
      const sent = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSentEmails(sent);
    } catch (err) {
      console.error("Error fetching sent emails", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const q = query(collection(db, 'email_templates'), orderBy('createdAt', 'desc'), limit(5));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedTemplates(fetched);
    } catch (err) {
      console.error("Failed to load templates", err);
    }
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    try {
      setAiGenerating(true);
      const res = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, mode: aiMode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      setComposeData({
        ...composeData,
        subject: data.subject || composeData.subject,
        body: data.result || ''
      });
      setShowAiModal(false);
      setAiPrompt('');
    } catch (err: any) {
      alert('Error generating content: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchSentEmails();
    fetchTemplates();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Move this email to trash?')) return;
    try {
      const res = await fetch(`https://abstracker.abstracker0.workers.dev/api/emails?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmails(emails.filter((e: any) => e.id !== id));
        if (selectedEmail?.id === id) setSelectedEmail(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (starredIds.includes(id)) {
      setStarredIds(starredIds.filter(i => i !== id));
    } else {
      setStarredIds([...starredIds, id]);
    }
  };

  const toggleArchive = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (archivedIds.includes(id)) {
      setArchivedIds(archivedIds.filter(i => i !== id));
    } else {
      setArchivedIds([...archivedIds, id]);
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const inboxEmails = emails.filter((e: any) => !archivedIds.includes(e.id));
  const starredEmailsList = emails.filter((e: any) => starredIds.includes(e.id));
  const archivedEmailsList = emails.filter((e: any) => archivedIds.includes(e.id));

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 bg-slate-50/50 p-2 rounded-3xl">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white rounded-3xl shadow-sm border border-slate-200 p-4 flex flex-col shrink-0">
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 tracking-tight leading-tight">Webmail</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inbox Server</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox, count: inboxEmails.length },
            { id: 'sent', label: 'Sent Items', icon: Send, count: sentEmails.length },
            { id: 'starred', label: 'Starred', icon: Star, count: starredEmailsList.length },
            { id: 'archive', label: 'Archive', icon: Archive, count: archivedEmailsList.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFolder(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeFolder === item.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${activeFolder === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeFolder === item.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-4 px-2 space-y-2">
          <button 
            onClick={() => setShowCompose(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Compose
          </button>
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="w-full bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            ✨ Create Template
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Storage Used
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
            <div className="bg-indigo-500 h-1.5 rounded-full w-[12%]"></div>
          </div>
          <p className="text-[10px] text-slate-400 text-right">1.2 GB / 10 GB</p>
        </div>
      </div>

      {/* Main Mail Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search in inbox..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-full text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <button onClick={fetchEmails} className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="m-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}
          
          {emails.length === 0 && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-slate-900">Your inbox is empty</p>
              <p className="text-sm mt-1">No new emails to display right now.</p>
            </div>
          )}

          <div className="divide-y divide-slate-50">
            {(activeFolder === 'inbox' ? inboxEmails : activeFolder === 'sent' ? sentEmails : activeFolder === 'starred' ? starredEmailsList : archivedEmailsList).map((email: any) => (
              <div 
                key={email.id} 
                onClick={() => setSelectedEmail(email)}
                className={`group p-4 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-start gap-4 relative ${archivedIds.includes(email.id) && activeFolder === 'inbox' ? 'hidden' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex shrink-0 items-center justify-center font-black text-slate-500 text-xs border border-slate-200/50 group-hover:from-indigo-100 group-hover:to-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                  {getInitials(email.sender || 'Admin')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-900 truncate pr-4">{email.sender || `To: ${email.to}`}</p>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                      {new Date(email.received_at || email.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm mb-1 truncate">{email.subject}</p>
                  <p className="text-sm text-slate-500 truncate">{email.text_body || email.body?.replace(/<[^>]+>/g, '') || 'Sent Email'}</p>
                </div>

                {/* Hover Actions */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button onClick={(e) => toggleStar(e, email.id)} className={`p-1.5 hover:bg-yellow-50 rounded-lg transition-colors ${starredIds.includes(email.id) ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`} title="Star">
                    <Star className="w-4 h-4" fill={starredIds.includes(email.id) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={(e) => toggleArchive(e, email.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title={archivedIds.includes(email.id) ? "Unarchive" : "Archive"}>
                    <Archive className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowTemplateModal(false)} 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  ✨ Create Email Template
                </h3>
                <button onClick={() => setShowTemplateModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-all shadow-sm border border-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSaveTemplate} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Template Name</label>
                  <input 
                    type="text" 
                    required
                    value={templateData.name}
                    onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                    placeholder="e.g. Welcome Email, Invoice, etc."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Default Subject</label>
                  <input 
                    type="text" 
                    required
                    value={templateData.subject}
                    onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                    placeholder="Welcome to AbsTracker!"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Template Body (HTML Supported)</label>
                  <textarea 
                    required
                    rows={8}
                    value={templateData.body}
                    onChange={(e) => setTemplateData({...templateData, body: e.target.value})}
                    placeholder="<p>Welcome!</p>"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium resize-none"
                  ></textarea>
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={savingTemplate}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    {savingTemplate ? <RefreshCcw className="w-5 h-5 animate-spin" /> : '💾'} 
                    {savingTemplate ? 'Saving...' : 'Save Template'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowCompose(false)} 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" /> New Message
                </h3>
                <button onClick={() => setShowCompose(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-all shadow-sm border border-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSendEmail} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">From</label>
                  <select 
                    value={composeData.from}
                    onChange={(e) => setComposeData({...composeData, from: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  >
                    <option value="AbsTracker <help@abstracker.in>">AbsTracker &lt;help@abstracker.in&gt;</option>
                    <option value="AbsTracker <info@abstracker.in>">AbsTracker &lt;info@abstracker.in&gt;</option>
                    <option value="AbsTracker <no-reply@abstracker.in>">AbsTracker &lt;no-reply@abstracker.in&gt;</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">To</label>
                  <input 
                    type="email" 
                    required
                    value={composeData.to}
                    onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                    placeholder="recipient@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    placeholder="Email subject..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Message (HTML Supported)</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowAiModal(true)} className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1 rounded-full hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-sm flex items-center gap-1">✨ AI Assist</button>
                      <select 
                        onChange={(e) => {
                           if (!e.target.value) return;
                           const tmpl = savedTemplates.find(t => t.id === e.target.value);
                           if (tmpl) {
                              setComposeData({
                                ...composeData,
                                subject: tmpl.subject,
                                body: tmpl.html || tmpl.body || ''
                              });
                           }
                           e.target.value = "";
                        }}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors outline-none cursor-pointer"
                      >
                         <option value="">✨ Load Saved Template...</option>
                         {savedTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name || t.subject}</option>
                         ))}
                      </select>
                      <button type="button" onClick={loadWelcomeTemplate} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">Default Welcome</button>
                    </div>
                  </div>
                  <textarea 
                    required
                    rows={8}
                    value={composeData.body}
                    onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                    placeholder="Write your message here..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium resize-none"
                  ></textarea>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    {sending ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
                    {sending ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Generate Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setShowAiModal(false)} 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  ✨ AI Email Generator
                </h3>
                <button onClick={() => setShowAiModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-all shadow-sm border border-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleAIGenerate} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Generation Mode</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setAiMode('text')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${aiMode === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Normal Text
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAiMode('template')}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${aiMode === 'template' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      HTML Template
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">What should the email say?</label>
                  <textarea 
                    required
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A professional welcome email for a new GPS dealer outlining the next steps for onboarding..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {aiGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : '✨'} 
                    {aiGenerating ? 'Generating...' : `Generate ${aiMode === 'template' ? 'Template' : 'Text'}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email View Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" 
              onClick={() => setSelectedEmail(null)} 
            />
            
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 z-10"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleReply(selectedEmail)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-2 text-sm font-bold">
                    <Send className="w-4 h-4" /> <span className="hidden sm:inline">Reply</span>
                  </button>
                  <button onClick={() => handleSummarize(selectedEmail)} disabled={summaryGenerating} className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50">
                    {summaryGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
                    <span className="hidden sm:inline">{summaryGenerating ? 'Analyzing...' : 'AI Summarize'}</span>
                  </button>
                  <button onClick={() => handleDelete(selectedEmail.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 text-sm font-bold">
                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
                <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30">
                <h1 className="text-2xl font-black text-slate-900 mb-6 leading-tight">{selectedEmail.subject}</h1>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                      {getInitials(selectedEmail.sender || 'Admin')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {selectedEmail.sender || 'AbsTracker Admin'}
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider">{selectedEmail.sender ? 'Sender' : 'You'}</span>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium">To:</span> {selectedEmail.recipient || selectedEmail.to}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 whitespace-nowrap bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    {new Date(selectedEmail.received_at || selectedEmail.sentAt).toLocaleString()}
                  </div>
                </div>
              </div>

              
              {emailSummary && (
                <div className="mx-8 mt-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
                  <h4 className="text-sm font-black text-purple-900 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" /> AI Summary & Suggested Action
                  </h4>
                  <div className="prose prose-sm prose-purple font-medium text-purple-800 leading-relaxed">
                     <div dangerouslySetInnerHTML={{ __html: emailSummary.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="flex-1 overflow-y-auto p-8">
                {selectedEmail.html_body || selectedEmail.html ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html_body || selectedEmail.html || selectedEmail.body }} 
                    className="prose max-w-none prose-slate prose-headings:font-black prose-a:text-indigo-600 hover:prose-a:text-indigo-700" 
                  />
                ) : (
                  <div className="whitespace-pre-wrap font-medium text-slate-700 font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedEmail.body }}>
                    {selectedEmail.text_body}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
