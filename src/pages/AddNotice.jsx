import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NoticeForm from '../components/NoticeForm';
export default function AddNotice() { return <main className="page-shell editor-page"><Link className="back-link" to="/admin/dashboard"><ArrowLeft size={16}/> Back to dashboard</Link><span className="eyebrow muted">SHARE WITH YOUR COMMUNITY</span><h1>Put it on the board.</h1><p className="page-intro">Clear, useful updates help everyone feel in the loop.</p><NoticeForm/></main>; }
