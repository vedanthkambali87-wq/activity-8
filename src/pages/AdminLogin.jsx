import { useState } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const navigate=useNavigate();
  async function submit(e){e.preventDefault();setError('');setBusy(true);try{await signIn(email,password);navigate('/admin/dashboard');}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <main className="auth-wrap"><Link className="back-link" to="/"><ArrowLeft size={16}/> Back to the board</Link><section className="auth-card"><div className="auth-icon"><LockKeyhole size={21}/></div><span className="eyebrow muted">BOARD ADMINISTRATION</span><h1>Good to see you.</h1><p>Sign in to post and manage community notices.</p>{!supabase&&<div className="info-message">Connect Supabase in your <code>.env</code> file to enable admin sign-in.</div>}<form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required /></label>{error&&<p className="error-message">{error}</p>}<button className="button auth-submit" disabled={busy||!supabase}>{busy?'Signing in…':'Sign in'}</button></form></section></main>;
}
