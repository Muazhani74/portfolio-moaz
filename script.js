// Typing Effect
const typed = new Typed("#typed-text", {
  strings: [
    "Web Developer", // Corrected "Wep" to "Web"
    "C++ Programmer",
    "Creative Problem Solver"
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 1500,
  loop: true
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the document click listener from firing immediately

    navLinks.classList.toggle('active');

    hamburger.innerHTML = navLinks.classList.contains('active')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

// Smooth Scrolling for Nav Links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    // Close mobile menu after clicking a link
    if (navLinks) {
      navLinks.classList.remove('active');
    }
    if (hamburger) {
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }

    window.scrollTo({
      top: targetSection.offsetTop - 80, // Adjust for fixed navbar height
      behavior: 'smooth'
    });
  });
});

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    // Check if the current scroll position is within the section
    if (pageYOffset >= (sectionTop - 100) && pageYOffset < (sectionTop + sectionHeight - 100)) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Theme Toggle
const toggleBtn = document.querySelector('.theme-toggle');
const body = document.body;

if (toggleBtn) {
  // Set initial theme based on localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    // Default to light mode if system prefers it and no saved theme
    body.classList.add('light-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    // Default to dark mode
    body.classList.remove('light-mode');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    toggleBtn.innerHTML = isLight
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Animate Skills on Scroll
let skillsAnimated = false;

function animateSkills() {
  const skillsSection = document.querySelector('.skills-section');
  const skillLevels = document.querySelectorAll('.skill-level');
  if (!skillsSection) return;

  const sectionTop = skillsSection.offsetTop;
  const windowHeight = window.innerHeight;
  const scrollPosition = window.pageYOffset;

  // Trigger animation when the skills section is in view
  if (!skillsAnimated && scrollPosition + windowHeight > sectionTop + 100) {
    skillLevels.forEach(level => {
      const width = level.getAttribute('data-level');
      level.style.width = width;
    });
    skillsAnimated = true;
  }
}

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills); // Run on load in case section is already in view

// Back to Top Button (Added a back-to-top button in HTML for this to work)
const backToTopBtn = document.createElement('button');
backToTopBtn.classList.add('back-to-top');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('active');
  } else {
    backToTopBtn.classList.remove('active');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Scroll Animation for elements with 'animate' class
const animateElements = document.querySelectorAll('.animate');

function checkScrollAnimation() {
  animateElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Trigger animation when element is 100px from the bottom of the viewport
    if (elementTop < windowHeight - 100) {
      element.style.opacity = 1;
      element.style.transform = 'translateY(0)';
    }
  });
}

window.addEventListener('scroll', checkScrollAnimation);
window.addEventListener('load', checkScrollAnimation); // Run on load for elements already in view

// Current Year in Footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Form Submission to Firebase
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.'); // Changed alert message to English
      return;
    }

    // Ensure 'database' variable is defined (from Firebase initialization in HTML)
    if (typeof database === 'undefined') {
      alert('Firebase is not initialized correctly.'); // Changed alert message to English
      return;
    }

    // Save data to Firebase
    const newMessageRef = database.ref('messages').push();
    newMessageRef.set({
      name,
      email,
      subject,
      message,
      timestamp: Date.now()
    }).then(() => {
      alert('Message sent successfully!'); // Changed alert message to English
      contactForm.reset();
    }).catch(error => {
      alert('Failed to send message. Please try again.'); // Changed alert message to English
      console.error("Firebase write error:", error); // More descriptive error logging
    });
  });
}
