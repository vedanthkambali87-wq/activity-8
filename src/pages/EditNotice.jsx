import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NoticeForm from '../components/NoticeForm';
import LoadingMessage from '../components/LoadingMessage';
import { getNotices } from '../lib/supabase';
export default function EditNotice() { const { id } = useParams(); const [notice, setNotice] = useState(null); const [loading, setLoading] = useState(true); useEffect(() => { getNotices().then(items => setNotice(items.find(item => item.id === id) || null)).finally(() => setLoading(false)); }, [id]); if (loading) return <main className="page-shell"><LoadingMessage/></main>; return <main className="page-shell editor-page"><Link className="back-link" to="/admin/dashboard"><ArrowLeft size={16}/> Back to dashboard</Link><span className="eyebrow muted">EDIT A NOTICE</span><h1>Make an update.</h1>{notice ? <NoticeForm initial={notice}/> : <div className="empty-state">Notice not found.</div>}</main>; }
