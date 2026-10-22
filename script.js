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

  // Scroll progress + back to top
  const bar = $('#progress'), up = $('#totop');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (scrollY / (h.scrollHeight - innerHeight || 1) * 100) + '%';
    up.classList.toggle('show', scrollY > 600);
  }, { passive: true });
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Card spotlight follows the pointer
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px');
    c.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  // Gentle 3D tilt on the hero chart (mouse devices only)
  const cc = $('.chart-card');
  if (cc && matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    cc.addEventListener('pointermove', e => {
      const r = cc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cc.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    cc.addEventListener('pointerleave', () => cc.style.transform = '');
  }

  // Newsletter
  document.querySelectorAll('.news').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); f.innerHTML = '<b>Thanks! You are subscribed.</b>';
  }));

  $('#yr').textContent = new Date().getFullYear();
})();
