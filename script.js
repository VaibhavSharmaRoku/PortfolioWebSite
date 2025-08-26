// Helpers
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

// Mobile nav toggle
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');
menuBtn?.addEventListener('click', ()=> navLinks.classList.toggle('open'));
$$('#navLinks a').forEach(a=> a.addEventListener('click', ()=> navLinks.classList.remove('open')));

// Footer year
$('#year').textContent = new Date().getFullYear();

// Reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  })
},{ threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

// Count up stats in About
function animateCount(el){
  const target = parseFloat(el.dataset.count || '0');
  const isFloat = !Number.isInteger(target);
  const dur = 1200; // ms
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t - start)/dur);
    const val = target * (0.2 + 0.8 * (1 - Math.pow(1-p, 3))); // easeOutCubic
    el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
$$('.about__stat .num').forEach(el => {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { animateCount(el); obs.disconnect(); } })
  },{threshold:0.6});
  obs.observe(el);
});

// Cards tilt parallax
$$('.tilt').forEach(card => {
  let rID;
  const onMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y/rect.height)-0.5) * -8;
    const ry = ((x/rect.width)-0.5) * 8;
    cancelAnimationFrame(rID);
    rID = requestAnimationFrame(()=> card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`);
  };
  const reset = () => card.style.transform = '';
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', reset);
});

// GSAP animations
window.addEventListener('load', () => {
  if (!window.gsap) return;
  const tl = gsap.timeline();
  tl.from('.nav', { y:-50, opacity:0, duration:0.5, ease:'power2.out' })
    .from('.hero__title', { y:20, opacity:0, duration:0.5 }, '-=0.1')
    .from(['.hero__subtitle', '.hero__desc', '.hero__cta', '.hero__socials'], { y:14, opacity:0, stagger:0.12, duration:0.5 })
    .from('.orb', { scale:0.7, opacity:0, duration:0.6, ease:'back.out(1.7)' }, '-=0.2');

  // Scroll reveals with ScrollTrigger
  if (gsap.ScrollTrigger) {
    $$('.section').forEach(sec => {
      const items = $$('.reveal', sec);
      gsap.from(items, {
        scrollTrigger: { trigger: sec, start: 'top 75%' },
        y: 26,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
      });
    });
  }
});

// Parallax clouds on pointer
const clouds = $$('.cloud');
window.addEventListener('pointermove', (e)=>{
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  clouds.forEach((c, i) => {
    const depth = (i+1) * 6;
    c.style.transform = `translate(${x*depth*3}%, ${y*depth*2}%)`;
  });
});

// Smooth scroll for nav links
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (!id || id === '#') return;
  const el = document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  window.scrollTo({ top: el.offsetTop - 56, behavior: 'smooth' });
}));
