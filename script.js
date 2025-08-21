document.addEventListener('DOMContentLoaded', () => {
    // --- Responsive Navigation ---
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.main-nav li');

        if (burger && nav && navLinks) {
            burger.addEventListener('click', () => {
                // Toggle nav active state
                nav.classList.toggle('nav-active');

                // Animate nav links
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = ''; // Reset animation if already set
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });

                // Burger animation
                burger.classList.toggle('toggle');
            });

            // Close nav when a link is clicked (for mobile)
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                        navLinks.forEach(item => item.style.animation = ''); // Reset animation
                    }
                });
            });
        }
    };

    // --- Smooth Scroll with Header Offset Correction ---
    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Added extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link immediately on click
                document.querySelectorAll('.main-nav a').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });
    };

    // --- Active Nav Link on Scroll ---
    const setActiveNavLinkOnScroll = () => {
        const sections = document.querySelectorAll('section');
        const navLi = document.querySelectorAll('.main-nav li a');
        const headerOffset = document.querySelector('header').offsetHeight;

        const observerOptions = {
            root: null, // viewport
            rootMargin: `-${headerOffset}px 0px -${window.innerHeight / 2}px 0px`, // Adjust based on header height
            threshold: 0 // As soon as it crosses the rootMargin, it's intersecting
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSectionId = entry.target.id;
                    navLi.forEach(a => {
                        a.classList.remove('active');
                        if (a.getAttribute('href').includes(currentSectionId)) {
                            a.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Set initial active link if page loaded with a hash or default to home
        if (window.location.hash) {
            const initialLink = document.querySelector(`.main-nav a[href="${window.location.hash}"]`);
            if (initialLink) {
                initialLink.classList.add('active');
            }
        } else {
            // Default to 'Home' if no hash
            const homeLink = document.querySelector('.main-nav a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    };

    // --- Scroll-triggered Animations using IntersectionObserver ---
    const setupScrollAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const heroAnimateElements = document.querySelectorAll('.animate-fade-slide-right, .animate-fade-slide-left, .animate-scale');

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Element is visible when 10% of it is in the viewport
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        // Observe elements for scroll reveal
        revealElements.forEach(el => observer.observe(el));

        // For hero elements, ensure they animate on page load
        heroAnimateElements.forEach(el => el.classList.add('is-visible'));
    };

    // --- Initialize all functions ---
    navSlide();
    smoothScroll();
    setActiveNavLinkOnScroll();
    setupScrollAnimations();
});