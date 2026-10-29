import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeForm from '../components/NoticeForm';
import { getNotices, supabase } from '../lib/supabase';

export default function NoticeEditor(){
  const {id}=useParams();const [initial,setInitial]=useState(null);const [ready,setReady]=useState(!id);
  useEffect(()=>{if(id)getNotices().then(items=>setInitial(items.find(n=>n.id===id)||null)).finally(()=>setReady(true));},[id]);
  if(!ready)return <main className="page-shell empty-state">Loading…</main>;
  if(!supabase)return <main className="page-shell"><Link className="back-link" to="/"><ArrowLeft size={16}/> Back to board</Link><div className="info-message editor-info">Admin sign-in is not configured yet. Add your Supabase URL and anon key to <code>.env</code>, then restart the dev server.</div></main>;
  return <main className="page-shell editor-page"><Link className="back-link" to="/"><ArrowLeft size={16}/> Back to board</Link><span className="eyebrow muted">{id?'EDIT A NOTICE':'SHARE WITH YOUR COMMUNITY'}</span><h1>{id?'Make an update':'Put it on the board.'}</h1><p className="page-intro">Clear, useful updates help everyone feel in the loop.</p>{id&&!initial?<div className="empty-state">Notice not found.</div>:<NoticeForm initial={initial}/>}</main>;
}
