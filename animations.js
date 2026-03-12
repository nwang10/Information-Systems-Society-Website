// ===== Scroll Reveal Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Stagger children if it's a grid
      const children = entry.target.querySelectorAll('.reveal-child');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
        child.classList.add('revealed');
      });
    }
  });
}, observerOptions);

// Observe all elements with reveal classes
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // Auto-add reveal-child to grid items
  document.querySelectorAll('.grid-3, .grid-4, .grid-2, .partners-grid').forEach(grid => {
    grid.querySelectorAll('.card, .event-card, .member-card, .resource-card, .partner-card, .job-card').forEach(child => {
      child.classList.add('reveal-child');
    });
    revealObserver.observe(grid);
  });

  // Initialize counters
  initCounters();

  // Initialize tilt effect
  initTilt();

  // Initialize magnetic buttons
  initMagneticButtons();

  // Initialize floating particles on hero
  initParticles();

  // Initialize smooth parallax
  initParallax();

  // Initialize scroll progress bar
  initScrollProgress();

  // Initialize text scramble on hero heading
  initTextReveal();
});


// ===== Animated Counter =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-item h3');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const text = el.textContent;
  const match = text.match(/(\d+)/);
  if (!match) return;

  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  el.textContent = '0' + suffix;
  requestAnimationFrame(update);
}


// ===== Card Tilt Effect =====
function initTilt() {
  document.querySelectorAll('.card, .event-card, .member-card, .resource-card, .partner-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}


// ===== Magnetic Buttons =====
function initMagneticButtons() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s ease';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}


// ===== Floating Particles on Hero =====
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.classList.add('hero-particles');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.style.position = 'relative';
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height / 15000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 5, 12, ${p.opacity})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(197, 5, 12, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}


// ===== Parallax Scrolling =====
function initParallax() {
  const hero = document.querySelector('.hero-visual');
  const heroText = document.querySelector('.hero-text');
  const statsBar = document.querySelector('.stats-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (hero) {
      hero.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
    if (heroText) {
      heroText.style.transform = `translateY(${scrollY * 0.08}px)`;
      heroText.style.opacity = Math.max(1 - scrollY / 700, 0);
    }
  });
}


// ===== Scroll Progress Bar =====
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.classList.add('scroll-progress');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = `${progress}%`;
  });
}


// ===== Hero Text Reveal Animation =====
function initTextReveal() {
  const heroH1 = document.querySelector('.hero-text h1');
  if (!heroH1) return;

  // Wrap each word in a span for animation
  const words = heroH1.innerHTML.split(/(\s+|<[^>]+>)/);
  let html = '';
  let wordIndex = 0;

  words.forEach(word => {
    if (word.match(/^</) || word.match(/^\s+$/)) {
      html += word;
    } else if (word.trim()) {
      html += `<span class="word-reveal" style="animation-delay: ${wordIndex * 0.08}s">${word}</span>`;
      wordIndex++;
    }
  });

  heroH1.innerHTML = html;
  heroH1.classList.add('text-revealed');
}


// ===== Smooth Section Transitions =====
// Add a subtle gradient separator between sections
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section + section').forEach(section => {
    if (!section.classList.contains('cta-section') && !section.classList.contains('stats-bar')) {
      // already styled
    }
  });
});


// ===== Navbar Active Link Highlight on Scroll =====
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
});
