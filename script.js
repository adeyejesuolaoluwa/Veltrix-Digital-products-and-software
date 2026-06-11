const pageLoader = document.querySelector('.page-loader');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const faqButtons = document.querySelectorAll('.faq-question');
const statCounters = document.querySelectorAll('.stat-card strong');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialNav = document.querySelectorAll('.testimonial-nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
let activeTestimonial = 0;

window.addEventListener('load', () => {
  pageLoader.classList.add('hidden');
  setTimeout(() => pageLoader.style.display = 'none', 450);
});

modeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('veltrixMode', isLight ? 'light' : 'dark');
});

const currentMode = localStorage.getItem('veltrixMode');
if (currentMode === 'light') {
  body.classList.add('light-mode');
}

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    portfolioCards.forEach(card => {
      card.style.display = filter === 'all' || card.dataset.category === filter ? 'grid' : 'none';
    });
  });
});

faqButtons.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.closest('.faq-item');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    faqButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.faq-item')?.classList.remove('open');
    });
    if (!expanded) {
      button.setAttribute('aria-expanded', 'true');
      parent.classList.add('open');
    }
  });
});

const animateStats = () => {
  statCounters.forEach(counter => {
    const updateValue = () => {
      const target = +counter.dataset.target;
      const current = +counter.innerText;
      const increment = Math.ceil(target / 70);
      if (current < target) {
        counter.innerText = current + increment;
        requestAnimationFrame(updateValue);
      } else {
        counter.innerText = target + (counter.dataset.target === '99' ? '%' : '');
      }
    };
    updateValue();
  });
};

const statsSection = document.querySelector('.stats');
let statsStarted = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsStarted) {
      statsStarted = true;
      animateStats();
    }
  });
}, { threshold: 0.4 });

if (statsSection) observer.observe(statsSection);

const updateTestimonials = direction => {
  testimonialCards[activeTestimonial].classList.remove('active');
  activeTestimonial = (activeTestimonial + direction + testimonialCards.length) % testimonialCards.length;
  testimonialCards[activeTestimonial].classList.add('active');
};

testimonialNav.forEach(button => {
  button.addEventListener('click', () => {
    const direction = button.dataset.direction === 'next' ? 1 : -1;
    updateTestimonials(direction);
  });
});

setInterval(() => updateTestimonials(1), 8500);

const hero = document.querySelector('.hero');
hero?.addEventListener('mousemove', event => {
  const { width, height, left, top } = hero.getBoundingClientRect();
  const x = (event.clientX - left) / width - 0.5;
  const y = (event.clientY - top) / height - 0.5;
  document.querySelectorAll('.floating-card').forEach((card, index) => {
    const moveX = x * (index + 1) * 10;
    const moveY = y * (index + 1) * 10;
    card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index % 2 ? 4 : -4}deg)`;
  });
});

const heroLeave = () => {
  document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.style.transform = `translate(0, 0) rotate(${index % 2 ? 4 : -4}deg)`;
  });
};
hero?.addEventListener('mouseleave', heroLeave);

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
