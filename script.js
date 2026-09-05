document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // 3. Hardware-Accelerated 60FPS Cursor Follower (requestAnimationFrame)
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let isMoving = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                cursorGlow.style.opacity = '1';
                isMoving = true;
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
            isMoving = false;
        });

        // Smooth physics-based interpolation on GPU composite layer
        function animateCursor() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);
    }

    // 4. Throttled Navbar & Scrollspy (Zero layout thrashing)
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('header[id], section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Navbar elevation class
                if (scrollY > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active section spy
                const scrollPosition = scrollY + 180;
                let currentId = '';

                sections.forEach((section) => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        currentId = section.getAttribute('id');
                    }
                });

                if (currentId) {
                    allNavLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                    });
                }

                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
});
