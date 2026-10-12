document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Icons & Utility Helpers
    // =========================================================================
    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
    refreshIcons();

    // Global Toast Notification Helper
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, iconName = 'check-circle') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        refreshIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // 2. Mobile Navigation Menu Toggle
    // =========================================================================
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

    // =========================================================================
    // 3. Hardware-Accelerated 60FPS Cursor Follower (Desktop Only)
    // =========================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursorGlow && isPointerFine) {
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

        function animateCursor() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);
    }

    // =========================================================================
    // 4. Throttled Navbar & Scrollspy (Zero layout thrashing)
    // =========================================================================
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

    // =========================================================================
    // 5. One-Click Email Copy
    // =========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('contact-email-text');

    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = emailText.textContent.trim();
            try {
                await navigator.clipboard.writeText(email);
                showToast('Email copied to clipboard: ' + email, 'copy');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Email copied to clipboard!', 'copy');
            }
        });
    }

    // =========================================================================
    // 6. Interactive Contact Form Handler
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'alert-circle');
                return;
            }

            // Construct mailto intent
            const mailtoUrl = `mailto:christiantapales1@gmail.com?subject=${encodeURIComponent(
                `[Portfolio Contact] ${subject} - from ${name}`
            )}&body=${encodeURIComponent(
                `From: ${name} (${email})\n\nMessage:\n${message}`
            )}`;

            window.location.href = mailtoUrl;
            showToast('Opening mail client... Thanks for reaching out!', 'send');
            contactForm.reset();
        });
    }

    // =========================================================================
    // 7. Info Modal: Resume & Architecture Breakdowns
    // =========================================================================
    const infoModal = document.getElementById('info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalBody = document.getElementById('info-modal-body');
    const infoModalClose = document.getElementById('info-modal-close');
    const resumeBtn = document.getElementById('resume-btn');

    function openInfoModal(title, htmlContent) {
        if (!infoModal) return;
        infoModalTitle.textContent = title;
        infoModalBody.innerHTML = htmlContent;
        infoModal.classList.add('active');
        infoModal.setAttribute('aria-hidden', 'false');
        refreshIcons();
    }

    function closeInfoModal() {
        if (!infoModal) return;
        infoModal.classList.remove('active');
        infoModal.setAttribute('aria-hidden', 'true');
    }

    if (infoModalClose) {
        infoModalClose.addEventListener('click', closeInfoModal);
    }

    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfoModal();
        });
    }

    // Resume Modal Handler
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            openInfoModal(
                'Christian Kyle Tapales — Resume & Profile',
                `
                <div style="margin-bottom: 16px;">
                    <p style="color: var(--flame-amber); font-weight: 700; font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 6px;">
                        BSIT 4th Year • Cebu Institute of Technology - University
                    </p>
                    <p style="margin-bottom: 12px;">
                        Full-Stack & Mobile Developer specializing in Java, Spring Boot, React, and modular system design.
                    </p>
                    <div style="background: rgba(9, 10, 15, 0.7); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px; margin-bottom: 16px; font-family: var(--font-mono); font-size: 0.85rem;">
                        <p style="color: var(--flame-bright); margin-bottom: 6px;">⚡ Core Competencies:</p>
                        <p>• Backend: Java, Spring Boot, Spring Security (JWT), RESTful APIs</p>
                        <p>• Frontend: React.js, JavaScript (ES6+), TypeScript, Tailwind CSS</p>
                        <p>• Databases: MySQL, PostgreSQL, Relational Schema Design</p>
                        <p>• Practices: OOP Architecture, Design Patterns, Git Workflow</p>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="mailto:christiantapales1@gmail.com?subject=Resume%20Request" class="btn btn-primary btn-sm">
                            <i data-lucide="mail"></i> Request Official PDF
                        </a>
                        <a href="https://github.com/christian-tapales" target="_blank" class="btn btn-secondary btn-sm">
                            <i data-lucide="github"></i> View GitHub Profile
                        </a>
                    </div>
                </div>
                `
            );
        });
    }

    // Project Details Modals
    document.querySelectorAll('.project-details-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const projectType = btn.getAttribute('data-project');
            if (projectType === 'canteencoders') {
                openInfoModal(
                    'CanteenCoders — System Architecture',
                    `
                    <div style="font-size: 0.95rem; line-height: 1.6;">
                        <p style="color: var(--flame-amber); font-weight: 600; margin-bottom: 8px;">
                            Full-Stack Ordering System & REST Architecture
                        </p>
                        <p style="margin-bottom: 14px;">
                            Designed as an end-to-end digital ordering solution for campus canteens to eliminate long physical queues and streamline vendor order processing.
                        </p>
                        <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                            <li>🔐 <strong>Security:</strong> Stateless JWT authentication with role-based access control (Student vs Vendor).</li>
                            <li>🛒 <strong>State Management:</strong> Real-time shopping cart and synchronized checkout pipeline.</li>
                            <li>🗄️ <strong>Database Architecture:</strong> Relational schema with normalized tables for Users, Menus, Orders, and OrderItems.</li>
                            <li>⚡ <strong>API Design:</strong> RESTful endpoints created using Spring Boot controllers and service layer abstraction.</li>
                        </ul>
                        <a href="https://github.com/christian-tapales" target="_blank" class="btn btn-primary btn-sm">
                            <i data-lucide="github"></i> View Repository
                        </a>
                    </div>
                    `
                );
            } else if (projectType === 'beyond') {
                openInfoModal(
                    "Beyond Journey's End — Software Design",
                    `
                    <div style="font-size: 0.95rem; line-height: 1.6;">
                        <p style="color: var(--flame-amber); font-weight: 600; margin-bottom: 8px;">
                            Java OOP Game Architecture & Engine Patterns
                        </p>
                        <p style="margin-bottom: 14px;">
                            Engineered from scratch to master clean software architecture, decoupling game systems from console rendering.
                        </p>
                        <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                            <li>⚔️ <strong>Polymorphic Combat:</strong> Turn-based combat engine utilizing inheritance and abstract class hierarchies.</li>
                            <li>🛡️ <strong>Modular Character Classes:</strong> Extensible hero archetypes each with custom ability progression.</li>
                            <li>🎒 <strong>Inventory System:</strong> Clean item composition pattern allowing reusable consumables and gear.</li>
                            <li>📐 <strong>Design Goals:</strong> State machine progression, error resilience, and high testability.</li>
                        </ul>
                        <a href="https://github.com/christian-tapales" target="_blank" class="btn btn-primary btn-sm">
                            <i data-lucide="github"></i> View Repository
                        </a>
                    </div>
                    `
                );
            }
        });
    });

    // =========================================================================
    // 8. Interactive Cyber Terminal CLI
    // =========================================================================
    const terminalModal = document.getElementById('terminal-modal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const terminalCloseBtn = document.getElementById('terminal-close-btn');
    const terminalCloseIcon = document.getElementById('terminal-close-icon');

    const terminalTriggers = [
        document.getElementById('terminal-trigger'),
        document.getElementById('terminal-hero-btn'),
        document.getElementById('footer-terminal-btn')
    ];

    function openTerminal() {
        if (!terminalModal) return;
        terminalModal.classList.add('active');
        terminalModal.setAttribute('aria-hidden', 'false');
        if (terminalInput) {
            terminalInput.focus();
        }
        refreshIcons();
    }

    function closeTerminal() {
        if (!terminalModal) return;
        terminalModal.classList.remove('active');
        terminalModal.setAttribute('aria-hidden', 'true');
    }

    terminalTriggers.forEach((trigger) => {
        if (trigger) trigger.addEventListener('click', openTerminal);
    });

    if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminal);
    if (terminalCloseIcon) terminalCloseIcon.addEventListener('click', closeTerminal);

    if (terminalModal) {
        terminalModal.addEventListener('click', (e) => {
            if (e.target === terminalModal) closeTerminal();
        });
    }

    // Keyboard Shortcuts: Ctrl+K / Cmd+K to toggle, Esc to close
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (terminalModal.classList.contains('active')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        } else if (e.key === 'Escape') {
            closeTerminal();
            closeInfoModal();
        }
    });

    // Terminal Command Processing
    const commandHistory = [];
    let historyIndex = -1;

    const COMMANDS = {
        help: `Available commands:
  about       - Display background and academic profile
  skills      - List programming languages, frameworks, and tools
  projects    - Summary of featured engineering projects
  contact     - View contact coordinates and email
  resume      - Display resume snapshot
  clear       - Clear the terminal screen
  sudo        - Elevate privileges
  date        - Display current session time
  exit        - Close the terminal window`,

        about: `Christian Kyle Tapales
• 4th Year BSIT Student at Cebu Institute of Technology - University (CIT-U)
• Focus: Full-Stack Web Development, Java OOP, Spring Boot, React
• Location: Philippines 🇵🇭
• Philosophy: "Learning by building, improving through consistency."`,

        skills: `Technical Stack:
• Languages:  Java, JavaScript (ES6+), TypeScript, C, Python, HTML5/CSS3
• Frameworks: Spring Boot, React.js, Spring Security (JWT), Node.js, Express.js
• Databases:  MySQL, PostgreSQL, Relational Architecture
• Tools:      Git, GitHub, VS Code, Postman, Maven, Vite`,

        projects: `Featured Projects:
1. CanteenCoders
   - Full-stack online ordering system with React, Spring Boot, JWT & MySQL.
2. Beyond Journey's End
   - Java-based text RPG mastering Object-Oriented Architecture and Game Design.
3. Flame Cyber Portfolio Hub
   - 60FPS high-performance developer hub with GPU-accelerated interactive spotlight.`,

        contact: `Contact Coordinates:
• Email:    christiantapales1@gmail.com
• GitHub:   https://github.com/christian-tapales
• LinkedIn: https://www.linkedin.com/in/christian-kyle-tapales-64b47a286/`,

        resume: `Resume Snapshot:
Christian Kyle Tapales — Software Developer
CIT-University BSIT (2026)
Type 'contact' to request the official PDF or click 'Resume / CV' on the page.`,

        sudo: `root: User 'visitor' is already granted full visitor privileges on this system.`
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = terminalInput.value.trim();
                terminalInput.value = '';

                if (!inputVal) return;

                commandHistory.push(inputVal);
                historyIndex = commandHistory.length;

                // Append user command to output
                const cmdLine = document.createElement('div');
                cmdLine.innerHTML = `<span class="term-user">visitor@tapales</span><span class="term-colon">:</span><span class="term-path">~</span><span class="term-dollar">$</span> <span class="term-cmd">${escapeHtml(inputVal)}</span>`;
                terminalOutput.appendChild(cmdLine);

                const lowerCmd = inputVal.toLowerCase();

                if (lowerCmd === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (lowerCmd === 'exit' || lowerCmd === 'quit') {
                    closeTerminal();
                } else if (lowerCmd === 'date') {
                    const res = document.createElement('div');
                    res.className = 'term-res';
                    res.textContent = new Date().toString();
                    terminalOutput.appendChild(res);
                } else if (lowerCmd.startsWith('echo ')) {
                    const res = document.createElement('div');
                    res.className = 'term-res';
                    res.textContent = inputVal.substring(5);
                    terminalOutput.appendChild(res);
                } else if (COMMANDS[lowerCmd]) {
                    const res = document.createElement('div');
                    res.className = 'term-res';
                    res.textContent = COMMANDS[lowerCmd];
                    terminalOutput.appendChild(res);
                } else {
                    const res = document.createElement('div');
                    res.className = 'term-res';
                    res.style.color = '#ff6b6b';
                    res.textContent = `Command not recognized: '${inputVal}'. Type 'help' for valid commands.`;
                    terminalOutput.appendChild(res);
                }

                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
                e.preventDefault();
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
