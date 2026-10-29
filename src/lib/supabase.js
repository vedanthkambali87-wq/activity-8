import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;

const storageKey = 'noticeboard.notices';
const starterNotices = [
  { id: 'welcome', title: 'Welcome to the noticeboard', category: 'Community', body: 'A shared space for the updates, events, and ideas that bring our community together. Check back often for what’s happening next.', author: 'Board team', pinned: true, created_at: new Date().toISOString() },
  { id: 'market', title: 'Saturday community market', category: 'Events', body: 'Join us this Saturday from 9 am to 1 pm in the courtyard. Local makers, fresh produce, and good coffee. Everyone is welcome.', author: 'Events committee', pinned: false, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'hours', title: 'Updated building hours', category: 'Updates', body: 'The main hall will be open from 8 am to 8 pm on weekdays starting next Monday. Weekend access remains unchanged.', author: 'Facilities', pinned: false, created_at: new Date(Date.now() - 172800000).toISOString() },
];

export async function getNotices() {
  if (supabase) {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (!error) return data;
    console.error('Could not load notices from Supabase:', error.message);
  }
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(storageKey, JSON.stringify(starterNotices));
  return starterNotices;
}

export async function saveNotice(notice) {
  if (supabase) {
    const payload = { ...notice, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('notices').upsert(payload).select().single();
    if (!error) return data;
    throw new Error(error.message);
  }
  const notices = await getNotices();
  const next = notice.id ? notices.map(item => item.id === notice.id ? { ...item, ...notice } : item) : [{ ...notice, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...notices];
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next.find(item => item.id === (notice.id || next[0].id));
}

export async function deleteNotice(id) {
  if (supabase) {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify((await getNotices()).filter(item => item.id !== id)));
}

export async function signIn(email, password) {
  if (!supabase) throw new Error('Add Supabase credentials to .env to enable admin sign-in.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function getSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
