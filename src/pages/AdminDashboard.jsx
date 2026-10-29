import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { deleteNotice, getNotices, getSession, signOut, supabase } from '../lib/supabase';
import LoadingMessage from '../components/LoadingMessage';

export default function AdminDashboard() {
  const [session, setSession] = useState(undefined); const [notices, setNotices] = useState([]); const [error, setError] = useState(''); const navigate = useNavigate();
  useEffect(() => { if (!supabase) { setSession(null); return; } getSession().then(setSession).catch(err => { setError(err.message); setSession(null); }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => subscription.unsubscribe(); }, []);
  useEffect(() => { if (session) getNotices().then(setNotices).catch(err => setError(err.message)); }, [session]);
  if (session === undefined) return <main className="page-shell"><LoadingMessage>Checking your session…</LoadingMessage></main>;
  if (!session) return <Navigate to="/admin" replace/>;
  async function remove(id) { if (!window.confirm('Delete this notice? This cannot be undone.')) return; try { await deleteNotice(id); setNotices(current => current.filter(notice => notice.id !== id)); } catch (err) { setError(err.message); } }
  async function logout() { await signOut(); navigate('/admin'); }
  return <main className="page-shell dashboard-page"><div className="dashboard-heading"><div><span className="eyebrow muted">BOARD ADMINISTRATION</span><h1>Manage notices</h1><p className="page-intro">Publish updates and keep your community in the loop.</p></div><div className="dashboard-actions"><button className="button button-quiet" onClick={logout}><LogOut size={15}/> Sign out</button><Link className="button" to="/admin/add"><Plus size={16}/> Add notice</Link></div></div>{error&&<p className="error-message">{error}</p>}<div className="admin-list">{notices.length ? notices.map(notice => <div className="admin-row" key={notice.id}><div><span className="category">{notice.category}</span><h3>{notice.title}</h3><small>{new Date(notice.created_at).toLocaleDateString()}</small></div><div className="admin-row-actions"><Link className="icon-button" to={`/admin/edit/${notice.id}`} aria-label={`Edit ${notice.title}`}><Pencil size={16}/></Link><button className="icon-button danger" onClick={() => remove(notice.id)} aria-label={`Delete ${notice.title}`}><Trash2 size={16}/></button></div></div>) : <div className="empty-state">No notices yet. Add the first one.</div>}</div></main>;
}
