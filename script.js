/* ==========================================================================
   MOAZ HANY — PORTFOLIO SCRIPTS
   Organized by feature. Uses IntersectionObserver for scroll-triggered
   work (reveal animations, skill bars, stat counters, active nav link)
   instead of polling scroll events for better performance.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Declared up front so it exists (as undefined) before applyTheme() can
  // reference it below — avoids a "Cannot access before initialization" crash.
  let skillRadarChart;

  /* ---------- Typing effect ---------- */
  if (window.Typed && document.getElementById('typed-text')) {
    new Typed('#typed-text', {
      strings: ['Web Developer', 'C++ Programmer', 'Creative Problem Solver'],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 1600,
      loop: true
    });
  }

  /* ---------- Current year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    if (hamburger) {
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      hamburger.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      const clickedInsideMenu = navLinks.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideMenu && !clickedHamburger && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ---------- Smooth scroll for nav links ---------- */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();
      closeMenu();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
      window.scrollTo({
        top: targetSection.offsetTop - navbarHeight + 1,
        behavior: 'smooth'
      });
    });
  });

  /* ---------- Theme toggle ---------- */
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  const applyTheme = (theme) => {
    body.classList.toggle('light-mode', theme === 'light');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'light'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
    updateRadarTheme();
  };

  if (toggleBtn) {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

    toggleBtn.addEventListener('click', () => {
      const nextTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem('theme', nextTheme);
    });
  }

  /* ---------- Skill radar chart ---------- */
  function getRadarThemeColors() {
    const styles = getComputedStyle(document.body);
    return {
      grid: styles.getPropertyValue('--border-subtle').trim() || 'rgba(255,255,255,0.08)',
      text: styles.getPropertyValue('--text-secondary').trim() || '#8792a8'
    };
  }

  function updateRadarTheme() {
    if (!skillRadarChart) return;
    const colors = getRadarThemeColors();
    skillRadarChart.options.scales.r.grid.color = colors.grid;
    skillRadarChart.options.scales.r.angleLines.color = colors.grid;
    skillRadarChart.options.scales.r.pointLabels.color = colors.text;
    skillRadarChart.update();
  }

  function initSkillRadar() {
    const canvas = document.getElementById('skillRadar');
    if (!canvas || typeof Chart === 'undefined') return;

    const colors = getRadarThemeColors();

    skillRadarChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['HTML/CSS', 'JavaScript', 'React', 'C++', 'Data Structures', 'Problem Solving'],
        datasets: [{
          label: 'Proficiency',
          data: [92, 68, 65, 85, 77, 80],
          backgroundColor: 'rgba(124, 111, 240, 0.18)',
          borderColor: 'rgba(56, 189, 248, 0.9)',
          borderWidth: 2,
          pointBackgroundColor: '#7c6ff0',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false, stepSize: 25 },
            grid: { color: colors.grid },
            angleLines: { color: colors.grid },
            pointLabels: {
              color: colors.text,
              font: { family: "'Inter', sans-serif", size: 12, weight: '600' }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` }
          }
        }
      }
    });
  }

  initSkillRadar();

  /* ---------- Navbar scrolled state + scroll progress ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
    if (backToTopBtn) backToTopBtn.classList.toggle('active', scrollY > 300);

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animate skill bars when their card enters view ---------- */
  const skillCategories = document.querySelectorAll('.skill-category');

  if (skillCategories.length && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-level').forEach(level => {
            level.style.width = level.getAttribute('data-level');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillCategories.forEach(cat => skillObserver.observe(cat));
  }

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* ---------- Contact form → Firebase ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const setStatus = (message, type) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type || ''}`.trim();
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        setStatus('Please fill in all fields.', 'error');
        return;
      }

      if (typeof database === 'undefined') {
        setStatus('Something went wrong connecting to the server. Please try again later.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending your message…', '');

      // 1) Always keep a permanent record in Firebase.
      const saveToDatabase = database.ref('messages').push().set({
        name, email, subject, message, timestamp: Date.now()
      });

      // 2) Also fire an instant email notification via EmailJS, if it's configured.
      const emailjsReady = typeof emailjs !== 'undefined'
        && typeof EMAILJS_SERVICE_ID !== 'undefined'
        && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID';

      const sendEmailNotification = emailjsReady
        ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: name,
            from_email: email,
            subject,
            message
          })
        : Promise.resolve('emailjs-not-configured');

      Promise.allSettled([saveToDatabase, sendEmailNotification]).then(([dbResult, mailResult]) => {
        if (dbResult.status === 'fulfilled') {
          setStatus('Message sent successfully! I\u2019ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          setStatus('Failed to send message. Please try again.', 'error');
          console.error('Firebase write error:', dbResult.reason);
        }

        if (emailjsReady && mailResult.status === 'rejected') {
          console.error('EmailJS error:', mailResult.reason);
        }
      }).finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

});
