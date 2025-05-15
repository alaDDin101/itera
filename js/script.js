// Modern Vanilla JS for iTeRa Website
// Language switching, year update, hero/mesh/binary animations

document.addEventListener('DOMContentLoaded', function() {
  // Footer year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Language switching
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);
  document.getElementById('lang-toggle').addEventListener('click', function() {
    const lang = document.body.classList.contains('rtl') ? 'en' : 'ar';
    setLanguage(lang);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hash) {
        e.preventDefault();
        const target = document.querySelector(this.hash);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  animateMeshBg();
  animateBinaryBg();
});

function setLanguage(lang) {
  const html = document.getElementById('html-root');
  if (lang === 'ar') {
    document.body.classList.add('rtl');
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    document.getElementById('lang-toggle').innerText = 'EN';
  } else {
    document.body.classList.remove('rtl');
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    document.getElementById('lang-toggle').innerText = 'AR';
  }
  // Update all elements with data-en/data-ar
  document.querySelectorAll('[data-en][data-ar]').forEach(function(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute('data-' + lang);
    } else {
      el.innerHTML = el.getAttribute('data-' + lang);
    }
  });
  localStorage.setItem('lang', lang);
}

// --- Animated Mesh Background ---
function animateMeshBg() {
  const canvas = document.getElementById('hero-mesh-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = document.querySelector('.hero-section').offsetHeight;
  let points = [];
  let lines = [];
  const POINTS = Math.floor(w / 90) + 8;
  const SPEED = 0.07;
  function randomY() { return Math.random() * h * 0.8 + h * 0.1; }
  function randomX(i) { return (i / (POINTS - 1)) * w; }
  for (let i = 0; i < POINTS; i++) {
    points.push({
      x: randomX(i),
      y: randomY(),
      vy: (Math.random() - 0.5) * SPEED
    });
  }
  for (let i = 0; i < POINTS - 1; i++) {
    lines.push([i, i + 1]);
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = 'rgba(122,201,67,0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let [a, b] of lines) {
      ctx.moveTo(points[a].x, points[a].y);
      ctx.lineTo(points[b].x, points[b].y);
    }
    ctx.stroke();
    ctx.restore();
    for (let p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(122,201,67,0.7)';
      ctx.fill();
    }
  }
  function update() {
    for (let p of points) {
      p.y += p.vy;
      if (p.y < h * 0.08 || p.y > h * 0.92) p.vy *= -1;
    }
  }
  function loop() {
    draw();
    update();
    requestAnimationFrame(loop);
  }
  loop();
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.querySelector('.hero-section').offsetHeight;
  });
}

// --- Animated Binary Code ---
function animateBinaryBg() {
  const binaryDiv = document.querySelector('.hero-binary-bg');
  if (!binaryDiv) return;
  let w = window.innerWidth;
  let h = document.querySelector('.hero-section').offsetHeight;
  let cols = Math.floor(w / 18);
  let drops = Array(cols).fill(0).map(() => Math.random() * h);
  function draw() {
    let html = '';
    for (let i = 0; i < cols; i++) {
      let y = drops[i];
      for (let j = 0; j < Math.floor(h / 22); j++) {
        if (Math.random() > 0.96) {
          html += `<span style="position:absolute;left:${i*18}px;top:${(y+j*22)%h}px;">${Math.random() > 0.5 ? '1' : '0'}</span>`;
        }
      }
      drops[i] = (drops[i] + 10 + Math.random() * 2) % h;
    }
    binaryDiv.innerHTML = html;
  }
  setInterval(draw, 220);
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = document.querySelector('.hero-section').offsetHeight;
    cols = Math.floor(w / 18);
    drops = Array(cols).fill(0).map(() => Math.random() * h);
  });
} 