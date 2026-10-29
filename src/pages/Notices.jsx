import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingMessage from '../components/LoadingMessage';
import NoticeCard from '../components/NoticeCard';
import { getNotices } from '../lib/supabase';

export default function Notices() {
  const [notices, setNotices] = useState([]); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All'); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { getNotices().then(setNotices).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  const categories = ['All', ...new Set(notices.map(notice => notice.category || 'Updates'))];
  const filtered = useMemo(() => notices.filter(notice => (category === 'All' || notice.category === category) && `${notice.title} ${notice.body} ${notice.category}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.created_at) - new Date(a.created_at)), [notices, query, category]);
  return <section className="board notices-page"><div className="section-heading"><div><span className="eyebrow muted">THE LATEST</span><h1>On the board <span className="count">{notices.length}</span></h1></div><SearchBar value={query} onChange={setQuery}/></div><CategoryFilter categories={categories} selected={category} onSelect={setCategory}/>
    {loading ? <LoadingMessage/> : error ? <div className="empty-state error-message">Could not load notices: {error}</div> : filtered.length ? <div className="notice-grid">{filtered.map(notice => <NoticeCard key={notice.id} notice={notice}/>)}</div> : <div className="empty-state">No notices found. Try another search or category.</div>}
    <div className="board-note"><span>✳</span> A good community starts with staying in the loop.</div>
  </section>;
}
