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

        // Close mobile menu when clicking any nav link
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // 3. Navbar scroll effect & Active Link Spy
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('header[id], section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Elevate navbar when scrolled
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(56, 189, 248, 0.2)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
            navbar.style.boxShadow = 'none';
        }

        // Highlight current section in navbar
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
