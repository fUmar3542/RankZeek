(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');

  // Sticky header style
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 90 + 'ms';
    io.observe(el);
  });

  // Count-up stats
  const fmt = n => n.toLocaleString('en-US');
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, sfx = el.dataset.suffix || '', t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1600, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = fmt(v) + sfx;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); co.unobserve(el);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  // Pricing buttons preselect package
  const plan = $('#plan'), q = new URLSearchParams(location.search).get('plan');
  if (plan && q) plan.value = q;

  // Contact form (front-end only: connect to Formspree/Netlify to receive messages)
  const form = $('#form'), note = $('#note');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(i => {
      const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.classList.toggle('bad', bad); if (bad) ok = false;
    });
    note.classList.toggle('err', !ok);
    note.textContent = ok ? 'Thanks! We will reply within one business day.' : 'Please enter your name and a valid email.';
    if (ok) form.reset();
  });

  $('#yr').textContent = new Date().getFullYear();
})();
