// Header Scroll Effect
const header = document.getElementById('header');

function handleScroll() {
    if (window.scrollY > 50 || document.documentElement.scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);
handleScroll(); // Run immediately in case the script loads late on a scrolled page

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

function closeMobileMenu() {
    navLinks.classList.remove('active');
    header.classList.remove('nav-open');
    mobileToggle.querySelector('i').classList.add('ri-menu-line');
    mobileToggle.querySelector('i').classList.remove('ri-close-line');
}

mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMobileMenuOpen = navLinks.classList.toggle('active');
    header.classList.toggle('nav-open', isMobileMenuOpen);
    mobileToggle.querySelector('i').classList.toggle('ri-menu-line');
    mobileToggle.querySelector('i').classList.toggle('ri-close-line');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            closeMobileMenu();

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation (Simple)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('section, .card, .comparison-image, .product-card').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});

// Create styles for reveal class dynamically
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
    .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(13, 2, 2, 0.98); /* Updated to match new dark red theme */
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        
        .nav-links.active li {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }

        .nav-links.active a {
            color: #F1FAEE !important;
        }

        .nav-links.active .nav-tel {
            border-color: #FFC107 !important;
            color: #FFC107 !important;
        }

        .nav-links.active .nav-tel:hover {
            background-color: #FFC107 !important;
            color: #1A0505 !important;
        }
    }
`;
document.head.appendChild(revealStyle);

// Secure Contact Form Handling (Production - Web3Forms)
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

// Simple client-side rate limiter
let lastSubmitTime = 0;
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

// Character counter for textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.style.cssText = 'font-size:0.8rem;color:var(--text-dim);text-align:right;display:block;margin-top:4px;';
    counter.textContent = '0 / 2000';
    messageTextarea.parentNode.appendChild(counter);
    messageTextarea.addEventListener('input', () => {
        const len = messageTextarea.value.length;
        counter.textContent = `${len} / 2000`;
        counter.style.color = len > 1800 ? 'var(--accent)' : 'var(--text-dim)';
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Rate limiting check
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
            showFeedback(`Veuillez patienter ${waitSec}s avant de renvoyer.`, 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Disable button to prevent double submission
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="ri-loader-4-line ri-spin"></i>';
        submitBtn.disabled = true;
        hideFeedback();

        try {
            const formData = new FormData(contactForm);

            // Construction d'un sujet d'e-mail dynamique et structuré pour plus de clarté dans la boîte mail
            const clientName = formData.get('Nom ou Société') || '';
            const clientPhone = formData.get('Téléphone') || '';
            const subjectLine = `Demande de Devis - ${clientName}${clientPhone ? ' - Tél: ' + clientPhone : ''}`;
            formData.set('subject', subjectLine);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                lastSubmitTime = Date.now();
                showFeedback('✅ Votre demande a été envoyée avec succès ! Nous vous contacterons très prochainement.', 'success');
                contactForm.reset();
                // Reset character counter
                if (messageTextarea) {
                    const counter = messageTextarea.parentNode.querySelector('.char-counter');
                    if (counter) counter.textContent = '0 / 2000';
                }
                // Scroll feedback into view
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                // Auto hide after 10 seconds
                setTimeout(hideFeedback, 10000);
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi.');
            }
        } catch (error) {
            showFeedback('❌ Erreur lors de l\'envoi. Veuillez réessayer ou nous appeler directement au 065 34 01 03.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    });
}

function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
}

function hideFeedback() {
    formFeedback.style.display = 'none';
    formFeedback.className = 'form-feedback';
}

// Product Carousel Logic
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slides img');
    const dots = carousel.querySelectorAll('.dot');
    const nextBtn = carousel.querySelector('.next');
    const prevBtn = carousel.querySelector('.prev');
    let currentSlide = 0;

    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide + 1);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide - 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index);
        });
    });

    // Auto-advance every 5 seconds
    let autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);
    });
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    initCarousel('ksenia-carousel');
    initCarousel('caddx-carousel');
    initCarousel('vanderbilt-carousel');
    initCarousel('hikvision-carousel');
    initCarousel('limotec-carousel');
});
