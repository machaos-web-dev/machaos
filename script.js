// scattered dots backdrop
const scatter = document.getElementById('scatter');
for (let i = 0; i < 24; i++) {
  const s = document.createElement('span');
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.opacity = (Math.random() * 0.5 + 0.15).toFixed(2);
  scatter.appendChild(s);
}

// ---------------------------------------------------------------
// MOBILE NAV TOGGLE
// ---------------------------------------------------------------
const navToggle = document.getElementById('navtoggle');
const navLinks = document.getElementById('navlinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// close the mobile menu after tapping any link inside it
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

// ---------------------------------------------------------------
// FAQ ACCORDION
// ---------------------------------------------------------------
document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // close any other open item for a clean single-open accordion
    document.querySelectorAll('.faq-item.open').forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });

    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
  });
});

// ---------------------------------------------------------------
// SCROLL REVEAL
// ---------------------------------------------------------------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

// ---------------------------------------------------------------
// WAITLIST SUBMISSION
// Paste your Formspree endpoint here once you've created a form at
// formspree.io (Dashboard -> + New Form -> copy the "https://formspree.io/f/xxxxxxxx" URL).
// Until you do, entries save to this browser only (not shared/visible anywhere).
// ---------------------------------------------------------------
const WAITLIST_ENDPOINT = "https://formspree.io/f/xojgpvpb";

const form = document.getElementById('waitlist-form');
const btn = document.getElementById('join-btn');
const successMsg = document.getElementById('success-msg');
const errorMsg = document.getElementById('error-msg');
const countEl = document.getElementById('waitlist-count');

function getLocalWaitlist() {
  try { return JSON.parse(localStorage.getItem('machaos_waitlist') || '[]'); }
  catch (e) { return []; }
}
function saveLocalWaitlist(list) {
  localStorage.setItem('machaos_waitlist', JSON.stringify(list));
}
function refreshCount() {
  const base = 27; // seed number so the counter isn't empty on day one
  const list = getLocalWaitlist();
  countEl.textContent = (base + list.length) + ' businesses already on the list';
}
refreshCount();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  const business = document.getElementById('business').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!business || !email) return;

  btn.disabled = true;
  btn.textContent = 'Joining...';

  const isConfigured = WAITLIST_ENDPOINT && WAITLIST_ENDPOINT.startsWith('https://formspree.io/');

  try {
    if (isConfigured) {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ business, email })
      });
      if (!res.ok) throw new Error('bad response');
    } else {
      // Fallback: no Formspree URL set yet, save locally so the demo still works
      const list = getLocalWaitlist();
      list.push({ business, email, joinedAt: new Date().toISOString() });
      saveLocalWaitlist(list);
    }
    successMsg.style.display = 'block';
    form.reset();
    refreshCount();
  } catch (err) {
    errorMsg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Join waitlist';
  }
});
