/* ========================================
   WOOLEN ART CO. — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            animateHeroOnLoad();
        }, 1200);
    });

    // Fallback to hide preloader if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            animateHeroOnLoad();
        }, 1200);
    }

    // ===== CUSTOM CURSOR =====
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (window.innerWidth > 768 && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX - 6 + 'px';
            cursor.style.top = mouseY - 6 + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX - 20) * 0.12;
            followerY += (mouseY - followerY - 20) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .product-card, .whyus-card, .contact-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // ===== HERO ANIMATION ON LOAD =====
    function animateHeroOnLoad() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');

        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateX(0)';
            }, 200);
        }

        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateX(50px)';
            setTimeout(() => {
                heroImage.style.transition = 'opacity 1s ease, transform 1s ease';
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(0)';
            }, 500);
        }

        // Trigger counter animation when hero loads
        setTimeout(animateCounters, 1200);
    }

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ===== TESTIMONIAL SLIDER =====
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (testimonialTrack) {
        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;
        let autoSlideInterval;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            currentSlide = index;
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        // Auto-slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Touch / Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
                btn.style.background = '#27ae60';

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');

            btn.innerHTML = '<i class="fas fa-check"></i>';
            input.value = 'Subscribed!';
            input.disabled = true;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
                input.value = '';
                input.disabled = false;
                btn.disabled = false;
            }, 2500);
        });
    }

    // ===== SMOOTH PARALLAX ON HERO =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroShapes = document.querySelectorAll('.shape');
        const floatingYarns = document.querySelectorAll('.floating-yarn');

        heroShapes.forEach((shape, i) => {
            const speed = (i + 1) * 0.03;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });

        floatingYarns.forEach((yarn, i) => {
            const speed = (i + 1) * 0.05;
            yarn.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ===== TILT EFFECT ON PRODUCT CARDS =====
    if (window.innerWidth > 768) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ===== MAGNETIC BUTTON EFFECT =====
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0) translateY(0)';
            });
        });
    }

    // ===== TEXT TYPING EFFECT ON HERO BADGE =====
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        const text = heroBadge.textContent;
        heroBadge.textContent = '';
        heroBadge.style.visibility = 'visible';

        let i = 0;
        function typeText() {
            if (i < text.length) {
                heroBadge.textContent += text.charAt(i);
                i++;
                setTimeout(typeText, 40);
            }
        }

        setTimeout(typeText, 1800);
    }

});
