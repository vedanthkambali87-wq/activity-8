import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Pin, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getNotices } from '../lib/supabase';

export default function NoticeDetails() {
  const { id } = useParams(); const [notice, setNotice] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getNotices().then(items=>setNotice(items.find(n=>n.id===id))).finally(()=>setLoading(false)); }, [id]);
  if (loading) return <div className="page-shell empty-state">Loading notice…</div>;
  if (!notice) return <div className="page-shell empty-state">That notice could not be found. <Link to="/">Back to the board</Link></div>;
  return <main className="page-shell detail-page"><Link className="back-link" to="/"><ArrowLeft size={16}/> Back to all notices</Link><article className="detail-card"><div className="detail-kicker"><span className="category">{notice.category}</span>{notice.pinned&&<span className="pin-label"><Pin size={12}/> Pinned notice</span>}</div><h1>{notice.title}</h1><div className="detail-meta"><span><CalendarDays size={15}/>{new Intl.DateTimeFormat('en',{dateStyle:'long'}).format(new Date(notice.created_at))}</span><span><UserRound size={15}/>{notice.author||'Community team'}</span></div><div className="detail-body">{notice.body.split('\n').map((line,i)=><p key={i}>{line||' '}</p>)}</div></article></main>;
}
