import { ArrowRight, CalendarDays, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeCard from '../components/NoticeCard';
import LoadingMessage from '../components/LoadingMessage';
import { getNotices } from '../lib/supabase';

export default function Home() {
  const [notices, setNotices] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getNotices().then(items => setNotices(items.sort((a,b) => Number(b.pinned)-Number(a.pinned) || new Date(b.created_at)-new Date(a.created_at)))).finally(() => setLoading(false)); }, []);
  return <><section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="live-dot" /> YOUR COMMUNITY, IN THE KNOW</span><h1>A little notice.<br /><em>A lot more connected.</em></h1><p>Updates, events, and ideas from the people around you. All in one place.</p><Link className="button hero-button" to="/notices">Explore the notices <ArrowRight size={16}/></Link></div><div className="hero-stamp"><span>GOOD<br/>THINGS<br/><i>HAPPEN</i><br/>HERE</span><span className="stamp-star">✳</span></div></section>
    <section className="board home-board"><div className="section-heading"><div><span className="eyebrow muted">A PLACE TO STAY CONNECTED</span><h2>Made for the whole community</h2></div></div><div className="home-highlights"><div><span className="highlight-icon"><CalendarDays size={19}/></span><h3>Know what’s happening</h3><p>Events, announcements, and important dates, all on one board.</p></div><div><span className="highlight-icon"><Users size={19}/></span><h3>Keep everyone in the loop</h3><p>One shared place for the news your neighbors need to know.</p></div></div></section>
    <section className="board home-latest"><div className="section-heading"><div><span className="eyebrow muted">FRESH FROM THE BOARD</span><h2>Latest notices <span className="count">{notices.length}</span></h2></div><Link className="text-link" to="/notices">View all notices <ArrowRight size={15}/></Link></div>{loading ? <LoadingMessage/> : notices.length ? <div className="notice-grid">{notices.slice(0,3).map(notice=><NoticeCard key={notice.id} notice={notice}/>)}</div> : <div className="empty-state">No notices have been posted yet.</div>}<div className="board-note"><span>✳</span> A good community starts with staying in the loop.</div></section></>;
}
