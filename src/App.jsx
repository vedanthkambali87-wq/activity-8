import React, { useEffect, useMemo, useState } from 'react';

const MATCHES = [
  { id: 'tigers-lions', home: 'Campus Tigers', away: 'City Lions', homeCode: 'CT', awayCode: 'CL', date: 'Friday, November 20', shortDate: 'FRI, NOV 20', time: '6:30 PM', venue: 'University Stadium', tag: 'SEASON OPENER' },
  { id: 'falcons-hawks', home: 'North Falcons', away: 'East Hawks', homeCode: 'NF', awayCode: 'EH', date: 'Saturday, November 21', shortDate: 'SAT, NOV 21', time: '4:00 PM', venue: 'University Stadium', tag: 'RIVALRY GAME' },
  { id: 'tigers-falcons', home: 'Campus Tigers', away: 'North Falcons', homeCode: 'CT', awayCode: 'NF', date: 'Sunday, November 22', shortDate: 'SUN, NOV 22', time: '7:00 PM', venue: 'University Stadium', tag: 'SUNDAY NIGHT' },
];
const STANDS = [
  { id: 'general', name: 'East Stand', price: 250, detail: 'All the atmosphere, right by the touchline.', mark: '◉' },
  { id: 'premium', name: 'Grandstand', price: 500, detail: 'A central view with a little extra room.', mark: '✦', popular: true },
  { id: 'student', name: 'Student End', price: 150, detail: 'The loudest section. Student ID required.', mark: '↗' },
];
const BOOKINGS_KEY = 'ticket-bookings';
const DRAFT_KEY = 'ticket-booking-draft';
const EMPTY_DRAFT = { matchId: '', standId: 'general', name: '', email: '', tickets: '1' };
function readStorage(key, fallback, merge = false) {
  try {
    const storage = key === DRAFT_KEY ? window.sessionStorage : window.localStorage;
    const saved = JSON.parse(storage.getItem(key) || (merge ? '{}' : '[]'));
    return merge ? { ...fallback, ...saved } : (Array.isArray(saved) ? saved : fallback);
  } catch (error) { console.warn(`Could not read ${key}.`, error); return fallback; }
}
function getMatch(id) { return MATCHES.find((match) => match.id === id); }
function getStand(id) { return STANDS.find((stand) => stand.id === id); }
function price(value) { return `₹${Number(value).toLocaleString('en-IN')}`; }
function totalFor(standId, quantity) { return (getStand(standId)?.price ?? 0) * Number(quantity || 0); }
function validate(form) {
  if (!getMatch(form.matchId)) return 'Choose a fixture to continue.';
  if (!getStand(form.standId)) return 'Choose a stand category.';
  if (!form.name.trim()) return 'Add the ticket holder’s name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.';
  const count = Number(form.tickets);
  if (!Number.isInteger(count) || count < 1 || count > 8) return 'Choose between 1 and 8 tickets.';
  return '';
}
function TeamMark({ code, alt = '' }) { return <span className={`team-mark ${alt}`} aria-hidden="true">{code}</span>; }

export default function App() {
  const [bookings, setBookings] = useState(() => readStorage(BOOKINGS_KEY, []));
  const [form, setForm] = useState(() => readStorage(DRAFT_KEY, EMPTY_DRAFT, true));
  const [message, setMessage] = useState('');
  const [matchFilter, setMatchFilter] = useState('all');
  const [standFilter, setStandFilter] = useState('all');
  const match = getMatch(form.matchId);
  const stand = getStand(form.standId);
  const total = totalFor(form.standId, form.tickets);
  const visibleBookings = useMemo(() => bookings.filter((booking) => (matchFilter === 'all' || booking.matchId === matchFilter) && (standFilter === 'all' || booking.standId === standFilter)), [bookings, matchFilter, standFilter]);
  useEffect(() => { try { window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch (error) { console.warn('Could not save the session draft.', error); } }, [form]);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); setMessage(''); }
  function selectMatch(matchId) { setForm((current) => ({ ...current, matchId })); setMessage('Fixture selected. Finish your booking below.'); }
  function fillSample() { setForm({ matchId: MATCHES[0].id, standId: 'student', name: 'Aarav Sharma', email: 'aarav@example.com', tickets: '2' }); setMessage('Sample details loaded. Review the summary and confirm.'); }
  function confirmBooking(event) {
    event?.preventDefault();
    const error = validate(form);
    if (error) { setMessage(error); return; }
    const selectedMatch = getMatch(form.matchId); const selectedStand = getStand(form.standId);
    const booking = { id: `GS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, matchId: selectedMatch.id, match: `${selectedMatch.home} vs ${selectedMatch.away}`, date: `${selectedMatch.date} · ${selectedMatch.time}`, venue: selectedMatch.venue, standId: selectedStand.id, stand: selectedStand.name, name: form.name.trim(), email: form.email.trim(), tickets: Number(form.tickets), total };
    const updated = [booking, ...bookings];
    try { window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated)); setBookings(updated); setForm(EMPTY_DRAFT); window.sessionStorage.removeItem(DRAFT_KEY); setMessage(`You’re on the list! Booking ID: ${booking.id}`); }
    catch (storageError) { console.error('Could not save the booking.', storageError); setMessage('Could not save the booking. Check browser storage and try again.'); }
  }

  return <div className="site-shell" id="top">
    <div className="announcement"><span className="announcement-dot"/> CAMPUS LEAGUE 2026 <span className="announcement-divider">/</span> Home games are here <a href="#matches">Find your match ↗</a></div>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">g<span>.</span></span><span className="brand-word">goodseats<small>CAMPUS SPORTS CLUB</small></span></a><nav aria-label="Main navigation"><a href="#matches">Fixtures</a><a href="#how-it-works">How it works</a><a href="#my-bookings">My tickets <b>{bookings.length}</b></a></nav><a className="header-cta" href="#book">Book a seat <span>↗</span></a></header>
    <main>
      <section className="hero"><div className="hero-copy"><div className="hero-label"><i/> THE CAMPUS GAME IS ON</div><h1>Bring your<br/><em>people.</em> Back<br/>your team.</h1><p>Big match energy, right on campus. Find a fixture, pick your spot, and make a day of it.</p><div className="hero-actions"><a className="button button-lime" href="#matches">Explore fixtures <span>↓</span></a><small><i/> 3 UPCOMING HOME GAMES</small></div></div>
        <div className="hero-visual"><div className="visual-topline"><span>FEATURED FIXTURE</span><span className="live-pill">● ON SALE NOW</span></div><div className="stadium-art"><div className="stadium-roof"/><div className="stadium-crowd"/><div className="stadium-field"><i/><b/><span/></div><div className="stadium-lights">✦　✦　✦</div></div><div className="featured-match"><div className="featured-date"><span>FRIDAY</span><strong>20</strong><span>NOV · 6:30 PM</span></div><div className="featured-teams"><div><TeamMark code="CT"/><b>CAMPUS<br/>TIGERS</b></div><span>VS</span><div><TeamMark code="CL" alt="gold"/><b>CITY<br/>LIONS</b></div></div><a href="#book" onClick={() => selectMatch(MATCHES[0].id)}>Get tickets ↗</a></div></div>
        <div className="hero-footnote"><span>01 — 03</span><span>THE UNIVERSITY STADIUM · CAMPUS NORTH</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <div className="ticker"><span>✳ GOOD GAME. GOOD COMPANY.</span><span>✳ YOUR CAMPUS. YOUR TEAM.</span><span>✳ MAKE SOME NOISE.</span><span>✳ GOOD GAME. GOOD COMPANY.</span></div>

      <section className="section" id="matches"><div className="section-kicker">01 / THE LINE-UP</div><div className="section-heading"><div><h2>Pick your <em>fixture.</em></h2><p>Three dates. One very good reason to show up.</p></div><small>ALL GAMES AT<br/><b>UNIVERSITY STADIUM</b></small></div>
        <div className="table-wrap"><table><thead><tr><th>THE MATCH-UP</th><th>DATE &amp; TIME</th><th>VENUE</th><th>FROM</th><th/></tr></thead><tbody>{MATCHES.map((item,index) => <tr key={item.id} className={form.matchId === item.id ? 'fixture-selected' : ''}><td><div className="fixture-teams"><TeamMark code={item.homeCode} alt={index===1?'blue':''}/><b>{item.home}</b><span>vs</span><TeamMark code={item.awayCode} alt={index===1?'red':'gold'}/><b>{item.away}</b></div><small>{item.tag} · INTER-COLLEGE LEAGUE</small></td><td><b>{item.shortDate}</b><small>{item.time}</small></td><td><b>{item.venue}</b><small>Campus North</small></td><td className="price-cell">₹150</td><td><button className="row-select" type="button" onClick={() => selectMatch(item.id)}>{form.matchId===item.id?'Selected ✓':'Choose ↗'}</button></td></tr>)}</tbody></table></div><div className="match-foot"><span>● TICKETS AVAILABLE</span><span>Student ID required for Student End.</span></div>
      </section>

      <section className="how-section" id="how-it-works"><div><div className="section-kicker">02 / NO COMPLICATED STUFF</div><h2>Three steps<br/>to <em>game day.</em></h2><p>Pick your match-day plan. We’ll keep the ticket safe in your browser.</p></div><div className="steps"><article><span>01</span><div><b>Choose the fixture</b><small>Find your game in the line-up.</small></div><i>↗</i></article><article><span>02</span><div><b>Claim your corner</b><small>Pick a stand and bring up to 8 friends.</small></div><i>◉</i></article><article><span>03</span><div><b>Show up loud</b><small>Confirm your details. Your ID is ready instantly.</small></div><i>✳</i></article></div></section>

      <section className="booking-section" id="book"><div className="section-kicker">03 / MAKE IT OFFICIAL</div><div className="section-heading"><div><h2>Your spot in<br/><em>the stands.</em></h2><p>All the match-day details, one quick booking.</p></div><span className="demo-chip">● CLIENT-SIDE DEMO</span></div>
        <div className="booking-layout"><form className="booking-form" id="booking-form" onSubmit={confirmBooking} noValidate><div className="form-title"><span>01</span><b>Your match</b><i/></div><label>FIXTURE<select value={form.matchId} onChange={(event) => update('matchId',event.target.value)}><option value="">Choose a match</option>{MATCHES.map((item)=><option key={item.id} value={item.id}>{item.home} vs {item.away} · {item.shortDate}</option>)}</select></label><div className="form-title"><span>02</span><b>Choose your stand</b><i/></div>
          <div className="stands" role="radiogroup" aria-label="Stand category">{STANDS.map((item)=><button type="button" role="radio" aria-checked={form.standId===item.id} className={`stand-option ${form.standId===item.id?'stand-active':''}`} key={item.id} onClick={()=>update('standId',item.id)}><span className="stand-symbol">{item.mark}</span><span className="stand-copy"><b>{item.name}{item.popular&&<small>FAN FAVOURITE</small>}</b><i>{item.detail}</i></span><strong>{price(item.price)}<small>/seat</small></strong></button>)}</div>
          <div className="form-title"><span>03</span><b>Who’s coming?</b><i/></div><div className="input-grid"><label>FULL NAME<input value={form.name} onChange={(event)=>update('name',event.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name"/></label><label>EMAIL ADDRESS<input type="email" value={form.email} onChange={(event)=>update('email',event.target.value)} placeholder="you@college.edu" autoComplete="email"/></label></div><label className="quantity-label">NUMBER OF TICKETS<span className="quantity"><button type="button" aria-label="Remove one ticket" onClick={()=>update('tickets',String(Math.max(1,(Number(form.tickets)||1)-1)))}>−</button><input aria-label="Number of tickets" type="number" min="1" max="8" step="1" value={form.tickets} onChange={(event)=>update('tickets',event.target.value)}/><button type="button" aria-label="Add one ticket" onClick={()=>update('tickets',String(Math.min(8,(Number(form.tickets)||0)+1)))}>+</button></span></label><button type="button" className="sample-link" onClick={fillSample}>✳ Fill with sample details</button></form>
          <aside className="order-card"><div className="order-top"><span>YOUR MATCH-DAY PASS</span><span>GS / 026</span></div><div className="order-art"><small>GOODSEATS · LIVE SPORTS</small><div className="order-teams"><div><TeamMark code={match?.homeCode??'CT'}/><b>{match?.home??'HOME TEAM'}</b></div><span>VS</span><div><TeamMark code={match?.awayCode??'CL'} alt="gold"/><b>{match?.away??'AWAY TEAM'}</b></div></div><div className="mini-field"><i/></div></div><div className="order-details"><b>{match?`${match.home} vs ${match.away}`:'Pick a fixture to get started'}</b><small>{match?`${match.shortDate} · ${match.time}`:'Your match details appear here'}</small><small>⌖ &nbsp;{match?.venue??'University Stadium'}</small><hr/><div className="order-line"><span>{stand?.name??'East Stand'} × {Number(form.tickets)||0}</span><b>{price(total)}</b></div><div className="order-line fee"><span>Booking fee</span><span>Included</span></div><div className="order-total"><b>Total</b><strong>{price(total)}</strong></div><button className="confirm-button" type="submit" form="booking-form">Confirm booking <span>↗</span></button><p className="secure-note">✓ &nbsp;No payment needed · Student demo</p>{message&&<p className="booking-message" role="status">{message}</p>}</div></aside>
        </div>
      </section>

      <section className="my-bookings" id="my-bookings"><div className="section-kicker">04 / YOUR GAME-DAY PLANS</div><div className="section-heading"><div><h2>Tickets in <em>your pocket.</em></h2><p>Confirmed bookings stay on this device.</p></div><span className="booking-count"><b>{String(bookings.length).padStart(2,'0')}</b><small>BOOKED</small></span></div>
        <div className="filters"><label>MATCH<select aria-label="Filter bookings by match" value={matchFilter} onChange={(event)=>setMatchFilter(event.target.value)}><option value="all">Every match</option>{MATCHES.map((item)=><option key={item.id} value={item.id}>{item.home} vs {item.away}</option>)}</select></label><label>STAND<select aria-label="Filter bookings by stand" value={standFilter} onChange={(event)=>setStandFilter(event.target.value)}><option value="all">Every stand</option>{STANDS.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
        {visibleBookings.length===0?<div className="empty-bookings"><span className="ticket-icon">GS</span><div><b>{bookings.length?'No tickets in that section.':'The best seats are still waiting.'}</b><p>{bookings.length?'Try another match or stand filter.':'Choose a fixture and your confirmed pass appears here.'}</p></div><a href="#matches">Explore fixtures ↗</a></div>:<div className="saved-list">{visibleBookings.map((booking)=><article className="saved-ticket" key={booking.id}><div><small>GOODSEATS · CAMPUS LEAGUE <b>CONFIRMED ✓</b></small><h3>{booking.match||booking.event}</h3><p>{booking.date} · {booking.venue}</p><footer>{booking.stand} · {booking.tickets} ticket{booking.tickets===1?'':'s'} <strong>{price(booking.total)}</strong></footer></div><aside><small>BOOKING ID</small><b>{booking.id}</b></aside></article>)}</div>}
      </section>
      <section className="closing-banner"><span>✳</span><div><small>THE BEST PART OF GAME DAY?</small><h2>Being <em>there.</em></h2></div><a href="#matches">Find your fixture ↗</a></section>
    </main>
    <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">g<span>.</span></span><span className="brand-word">goodseats<small>CAMPUS SPORTS CLUB</small></span></a><p>Student-built match-day ticketing demo.<br/>Bookings stay in this browser. No payment is processed.</p><a href="#top">BACK TO TOP ↑</a></footer>
  </div>;
}
