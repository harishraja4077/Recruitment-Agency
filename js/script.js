document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. GLASSMORPHISM HEADER ON SCROLL
    // ==========================================================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================================================
    // 2. MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    const closeNavMenu = () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    };

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking a nav link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNavMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeNavMenu();
            }
        });
    }

    // ==========================================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================================================
    // 4. STATS COUNTER ANIMATION
    // ==========================================================================
    const stats = document.querySelectorAll('.stat-num');
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = Math.ceil(target / (duration / 30));
                    
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            clearInterval(timer);
                            stat.innerHTML = target + suffix;
                        } else {
                            stat.innerHTML = count + suffix;
                        }
                    }, 30);
                    
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => statsObserver.observe(stat));
    }

    // ==========================================================================
    // 5. CLIENT-SIDE JOB FILTERING (Projects & Jobs Page / Home Page)
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const jobCards = document.querySelectorAll('.job-card[data-category]');
    
    if (filterButtons.length > 0 && jobCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                jobCards.forEach(card => {
                    // Fade out
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95) translateY(10px)';
                    
                    setTimeout(() => {
                        const cardCategory = card.getAttribute('data-category');
                        if (filterValue === 'all' || cardCategory === filterValue) {
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }

    // ==========================================================================
    // 6. BOOKMARK TOGGLE & ALERT POPUP
    // ==========================================================================
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (icon) {
                if (btn.classList.contains('active')) {
                    icon.classList.replace('far', 'fas');
                    showToast('Job Bookmarked', 'The job has been added to your dashboard bookmarks.');
                } else {
                    icon.classList.replace('fas', 'far');
                    showToast('Bookmark Removed', 'The job has been removed from your bookmarks.');
                }
            }
        });
    });

    // ==========================================================================
    // 7. CUSTOM TOAST SYSTEM
    // ==========================================================================
    function showToast(title, message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(a => a.remove());

        const alertContainer = document.createElement('div');
        alertContainer.className = 'custom-alert';
        alertContainer.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div class="custom-alert-content">
                <h5>${title}</h5>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(alertContainer);
        
        // Trigger reflow
        alertContainer.offsetHeight;
        
        // Slide in
        alertContainer.classList.add('active');
        
        // Slide out and remove after 3.5s
        setTimeout(() => {
            alertContainer.classList.remove('active');
            setTimeout(() => alertContainer.remove(), 400);
        }, 3500);
    }

    // Export function to window so we can trigger it in inline scripts if needed
    window.showToast = showToast;

    // ==========================================================================
    // 8. SIMULATED JOB APPLY / SUBMIT OPERATIONS
    // ==========================================================================
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Applied';
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                btn.style.borderColor = '#10b981';
                btn.style.color = '#ffffff';
                showToast('Application Submitted', 'Your profile has been forwarded to the employer.');
            }, 1500);
        });
    });

    // ==========================================================================
    // 9. SIGN-IN & SIGN-UP ROLE TOGGLE & SIMULATED SUBMISSION
    // ==========================================================================
    const roleToggleBtns = document.querySelectorAll('.auth-toggle-btn');
    let selectedRole = 'candidate'; // Default
    
    if (roleToggleBtns.length > 0) {
        roleToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                roleToggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedRole = btn.getAttribute('data-role');
                
                // If on signup page, customize labels/placeholders based on role
                const signupTitle = document.getElementById('signup-heading-role');
                if (signupTitle) {
                    signupTitle.textContent = selectedRole === 'employer' ? 'as an Employer' : 'as a Candidate';
                }
                
                // Show/hide company field
                const companyField = document.getElementById('company-field');
                if (companyField) {
                    if (selectedRole === 'employer') {
                        companyField.style.display = 'block';
                        companyField.querySelector('input').setAttribute('required', 'required');
                    } else {
                        companyField.style.display = 'none';
                        companyField.querySelector('input').removeAttribute('required');
                    }
                }
            });
        });
    }

    // Handle Auth Form Submission
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = authForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Save email to localStorage for dashboard
            const emailInput = document.getElementById('signin-email') || document.getElementById('signup-email');
            if (emailInput && emailInput.value) {
                localStorage.setItem('userEmail', emailInput.value);
            }
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showToast('Authentication Successful', `Welcome back to Stackly! Redirecting to dashboard...`);
                setTimeout(() => {
                    if (selectedRole === 'employer') {
                        window.location.href = 'employerdashboard.html';
                    } else {
                        window.location.href = 'candiatedashboard.html';
                    }
                }, 1200);
            }, 1200);
        });
    }

    // Handle General Forms (Contact, Newsletter, etc.)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showToast('Message Sent', 'Thank you! We will get back to you within 24 hours.');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast('Subscribed!', 'You have successfully subscribed to Stackly news.');
                emailInput.value = '';
            }
        });
    }
    
    // ==========================================================================
    // 10. DASHBOARD TOGGLES
    // ==========================================================================
    const dashboardNavToggle = document.querySelector('.dashboard-nav-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    
    if (dashboardNavToggle && dashboardSidebar) {
        dashboardNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dashboardSidebar.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!dashboardSidebar.contains(e.target) && !dashboardNavToggle.contains(e.target)) {
                dashboardSidebar.classList.remove('active');
            }
        });
    }

    // Populate dashboard user email if exists
    const dashboardEmailElem = document.getElementById('dashboard-user-email');
    if (dashboardEmailElem) {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            dashboardEmailElem.textContent = storedEmail;
        }
    }
});
