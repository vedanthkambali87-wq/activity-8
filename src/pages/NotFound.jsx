import { Link } from 'react-router-dom';
export default function NotFound() { return <main className="page-shell not-found"><span className="eyebrow muted">404 · OFF THE BOARD</span><h1>That page wandered off.</h1><p>Let’s get you back to the notices.</p><Link className="button" to="/">Back to home</Link></main>; }
