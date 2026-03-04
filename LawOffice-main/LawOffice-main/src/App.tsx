import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Plus,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  User as UserIcon,
  Upload,
  File,
  Shield,
  Eye,
  Trash2,
  Download,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Case, DashboardStats, Document as DocType } from './types';
import LandingPage from './components/LandingPage';

// --- Components ---
// ... (rest of components remain the same)

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-primary-red text-white shadow-lg shadow-primary-red/20' 
        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-white rounded-full" />}
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon }: { label: string, value: string | number, trend?: string, icon: any }) => (
  <div className="glass-panel p-6 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-red to-green-accent opacity-50" />
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/5 rounded-lg text-primary-red group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-accent bg-green-accent/10 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-serif font-bold mb-1">{value}</div>
    <div className="text-sm text-text-muted uppercase tracking-wider font-medium">{label}</div>
  </div>
);

const CaseRow = ({ kase, onClick }: { kase: Case, onClick?: () => void }) => (
  <tr 
    onClick={onClick}
    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
  >
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary-red/20 flex items-center justify-center text-primary-red font-bold text-xs">
          {kase.type[0]}
        </div>
        <div>
          <div className="font-medium group-hover:text-primary-red transition-colors">{kase.title}</div>
          <div className="text-xs text-text-muted">{kase.caseNumber}</div>
        </div>
      </div>
    </td>
    <td className="py-4 px-4 text-sm">{kase.clientFirstName} {kase.clientLastName}</td>
    <td className="py-4 px-4">
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        kase.status === 'Active' ? 'bg-green-accent/10 text-green-accent' : 'bg-yellow-500/10 text-yellow-500'
      }`}>
        {kase.status}
      </span>
    </td>
    <td className="py-4 px-4">
      <span className={`text-xs font-medium ${
        kase.priority === 'High' ? 'text-primary-red' : 'text-text-muted'
      }`}>
        {kase.priority}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-text-muted">{kase.deadlineAt}</td>
    <td className="py-4 px-4 text-right">
      <button className="p-1 hover:bg-white/10 rounded">
        <MoreVertical size={16} />
      </button>
    </td>
  </tr>
);

const DocumentVault = ({ cases, user }: { cases: Case[], user: User | null }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  useEffect(() => {
    if (selectedCaseId) {
      fetch(`/api/documents/${selectedCaseId}`)
        .then(res => res.json())
        .then(data => setDocuments(data));
    }
  }, [selectedCaseId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCaseId || !user) return;

    setIsUploading(true);
    
    // In a real app, we'd upload to S3/Cloud Storage here.
    // For this demo, we'll just save the metadata.
    const docData = {
      id: `doc-${Date.now()}`,
      caseId: selectedCaseId,
      uploadedBy: user.id,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      visibility: 'Shared',
      isPrivileged: false
    };

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });

      if (res.ok) {
        const newDoc = await res.json();
        setDocuments(prev => [newDoc, ...prev]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-1">Document Vault</h2>
          <p className="text-text-muted">Securely manage and store case-related evidence and filings.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-red/50"
            value={selectedCaseId || ''}
            onChange={(e) => setSelectedCaseId(e.target.value)}
          >
            <option value="" disabled>Select a Case</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCaseId ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center glass-panel">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-muted">
            <Filter size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Case Selected</h3>
          <p className="text-text-muted max-w-xs">Please select a case from the dropdown above to view and manage its documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Zone */}
          <div className="lg:col-span-1 space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`glass-panel p-8 border-2 border-dashed border-white/10 hover:border-primary-red/50 transition-all cursor-pointer text-center group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <div className="w-16 h-16 bg-primary-red/10 text-primary-red rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <h4 className="font-bold mb-2">Click to Upload</h4>
              <p className="text-xs text-text-muted">PDF, DOCX, PNG, JPG (Max 50MB)</p>
              {isUploading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary-red text-sm font-bold">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-red border-t-transparent rounded-full"
                  />
                  Encrypting & Storing...
                </div>
              )}
            </div>

            <div className="glass-panel p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Shield size={18} className="text-green-accent" />
                Security Standards
              </h4>
              <ul className="space-y-3 text-xs text-text-muted">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-accent mt-1.5" />
                  AES-256 Encryption at rest
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-accent mt-1.5" />
                  POPIA & GDPR Compliant storage
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-accent mt-1.5" />
                  Automatic audit logging for every access
                </li>
              </ul>
            </div>
          </div>

          {/* Document List */}
          <div className="lg:col-span-2 glass-panel overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold">Case Documents</h3>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{documents.length} Files</span>
            </div>
            <div className="divide-y divide-white/5">
              {documents.length === 0 ? (
                <div className="p-12 text-center text-text-muted">
                  <File size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No documents found for this case.</p>
                </div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-lg text-text-muted group-hover:text-primary-red transition-colors">
                        <File size={24} />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {doc.fileName}
                          {doc.isPrivileged && <Shield size={14} className="text-primary-red" />}
                        </div>
                        <div className="text-xs text-text-muted flex items-center gap-3">
                          <span>{formatSize(doc.fileSize)}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{doc.visibility}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded text-text-muted hover:text-text-primary" title="Preview">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded text-text-muted hover:text-text-primary" title="Download">
                        <Download size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded text-text-muted hover:text-primary-red" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, casesRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/stats'),
          fetch('/api/cases')
        ]);
        
        const userData = await userRes.json();
        const statsData = await statsRes.json();
        const casesData = await casesRes.json();

        setUser(userData);
        setStats(statsData);
        setCases(casesData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-dark">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 bg-bg-dark z-20">
        <div 
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
          onClick={() => setView('landing')}
        >
          <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-red/30 group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LawOffice <span className="text-primary-red">Pro</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Legal Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Briefcase} label="Cases" active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} />
          <SidebarItem icon={FileText} label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
          <SidebarItem icon={Calendar} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
          <SidebarItem icon={MessageSquare} label="Messaging" active={activeTab === 'messaging'} onClick={() => setActiveTab('messaging')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <UserIcon size={20} className="text-text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-text-muted truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setView('landing')}
            className="w-full flex items-center gap-3 px-4 py-2 text-text-muted hover:text-primary-red transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-bg-dark/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search cases, documents, or clients..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-red/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-red rounded-full border-2 border-bg-dark" />
            </button>
            <button className="btn-primary">
              <Plus size={18} />
              New Case
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.firstName}</h2>
                    <p className="text-text-muted">Here's what's happening with your cases today.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Current Date</p>
                    <p className="text-lg font-serif">Saturday, 21 Feb 2026</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Active Cases" value={stats?.activeCases || 0} trend="+8%" icon={Briefcase} />
                  <StatCard label="Win Rate (YTD)" value={`${stats?.winRate || 0}%`} trend="94% rate" icon={CheckCircle2} />
                  <StatCard label="Total Documents" value={stats?.totalDocs || 0} trend="↑ 24/week" icon={FileText} />
                  <StatCard label="Pending Appts" value={stats?.pendingAppts || 0} trend="10:30 next" icon={Calendar} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Cases */}
                  <div className="lg:col-span-2 glass-panel overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-lg font-bold">Recent Cases</h3>
                      <button className="text-xs font-bold text-primary-red hover:underline uppercase tracking-widest">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/5">
                            <th className="py-4 px-4">Case Title</th>
                            <th className="py-4 px-4">Client</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">Priority</th>
                            <th className="py-4 px-4">Deadline</th>
                            <th className="py-4 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cases.map(kase => <CaseRow key={kase.id} kase={kase} />)}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                      {[
                        { icon: FileText, text: "New document uploaded for CASE-001", time: "09:14 today", color: "text-blue-400" },
                        { icon: Calendar, text: "Appointment booked with Thomas J.", time: "Yesterday", color: "text-green-accent" },
                        { icon: AlertCircle, text: "Status changed to 'Pending' for CASE-002", time: "2 days ago", color: "text-yellow-500" },
                        { icon: CheckCircle2, text: "Case CASE-005 closed successfully", time: "Feb 18", color: "text-primary-red" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className={`mt-1 ${item.color}`}>
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.text}</p>
                            <p className="text-xs text-text-muted">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                      View Full Audit Log
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div 
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <DocumentVault cases={cases} user={user} />
              </motion.div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'documents' && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-text-muted">
                  <Clock size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Coming Soon</h2>
                <p className="text-text-muted max-w-md">The {activeTab} module is currently under development as part of the Phase 1 rollout.</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-6 text-primary-red font-bold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Back to Dashboard <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
