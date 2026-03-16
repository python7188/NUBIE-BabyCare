document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Logic
  const header = document.getElementById('site-header');
  
  const handleScroll = () => {
    // Only add the background box when scrolling past the hero viewport (approx 90% of window height)
    if (window.scrollY > (window.innerHeight * 0.9)) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  // Initial check on load
  handleScroll();

  // Listen for scroll events with a slight throttle
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* =========================================================================
     Mobile Menu Logic
     ========================================================================= */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileOverlay = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileOverlay) {
    const openMenu = () => {
      mobileOverlay.classList.add('is-open');
      mobileOverlay.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scrolling underneath
    };

    const closeMenu = () => {
      mobileOverlay.classList.remove('is-open');
      mobileOverlay.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openMenu);
    
    if (mobileClose) {
      mobileClose.addEventListener('click', closeMenu);
    }

    // Close when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // Newsletter Logic
  const newsletterForm = document.getElementById('newsletter-form');
  const successMessage = document.getElementById('success-message');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate API call for newsletter
      const btn = newsletterForm.querySelector('button');
      const ogText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        newsletterForm.querySelector('.input-group').style.display = 'none';
        successMessage.removeAttribute('hidden');
        
        // Track event
        try{
          if(window.gtag) gtag('event','newsletter_signup',{event_category:'engagement'});
          if(window.dataLayer) dataLayer.push({event:'newsletter_signup'});
        }catch(e){}
      }, 800);
    });
  }

  // Floating CTA Analytics
  const shopFloat = document.getElementById('nubie-shop-float');
  if (shopFloat) {
    shopFloat.addEventListener('click', () => {
      try {
        if(window.gtag) gtag('event', 'floating_cta_click', { event_category: 'engagement', event_label: 'floating_cta', transport_type: 'beacon' });
        if(window.dataLayer) dataLayer.push({ event: 'floating_cta_click', label: 'floating_cta' });
      } catch(e) {}
    });
  }

  /* =========================================================================
     Products Section: Filter Pill Sliding Indicator
     ========================================================================= */
  const pillsContainer = document.querySelector('.filter-pills');
  const pills = document.querySelectorAll('.filter-pill');
  const activeBg = document.querySelector('.pill-active-bg');
  
  function updateActivePillBg(targetPill) {
    if (!activeBg || !targetPill) return;
    activeBg.style.width = `${targetPill.offsetWidth}px`;
    activeBg.style.transform = `translateX(${targetPill.offsetLeft}px)`;
  }

  const initialActive = document.querySelector('.filter-pill.active');
  if (initialActive) {
    setTimeout(() => updateActivePillBg(initialActive), 100);
  }

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      updateActivePillBg(e.target);
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.filter-pill.active');
    updateActivePillBg(currentActive);
  });

  /* =========================================================================
     Products Section: Grid vs List View Toggle
     ========================================================================= */
  const gridBtn = document.getElementById('view-grid');
  const listBtn = document.getElementById('view-list');
  const productGrid = document.getElementById('main-product-grid');

  if (gridBtn && listBtn && productGrid) {
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.add('active');
      gridBtn.setAttribute('aria-pressed', 'true');
      listBtn.classList.remove('active');
      listBtn.setAttribute('aria-pressed', 'false');
      productGrid.classList.remove('list-view');
    });

    listBtn.addEventListener('click', () => {
      listBtn.classList.add('active');
      listBtn.setAttribute('aria-pressed', 'true');
      gridBtn.classList.remove('active');
      gridBtn.setAttribute('aria-pressed', 'false');
      productGrid.classList.add('list-view');
    });
  }

  /* =========================================================================
     Products Section: Quick Preview Modal Logic
     ========================================================================= */
  const modal = document.getElementById('quick-view-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modTitle = document.getElementById('modal-title');
  const modImage = document.getElementById('modal-image');

  function openModal(cardElement) {
    if (!modal) return;
    if (cardElement) {
      const cardInfo = cardElement.closest('.prod-card');
      if (cardInfo) {
        const titleText = cardInfo.querySelector('.prod-title').innerText;
        const colorClass = Array.from(cardInfo.querySelector('.prod-placeholder').classList).find(c => c.startsWith('bg-'));
        
        modTitle.innerText = titleText;
        if (colorClass) {
          modImage.className = 'modal-image-main ' + colorClass;
        }
      }
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      closeBtn.focus();
    }, 260);
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      openModal(e.target);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = modal.querySelectorAll(focusableElements);
    if(focusableContent.length > 0) {
      const firstFocusableElement = focusableContent[0]; 
      const lastFocusableElement = focusableContent[focusableContent.length - 1]; 

      modal.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

        if (e.shiftKey) { 
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else { 
          if (document.activeElement === lastFocusableElement) { 
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      });
    }
  }

  /* =========================================================================
     About Section: Scroll Reveal Animations (Intersection Observer)
     ========================================================================= */
  
  // Select all elements that should animate in
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');

  const revealOptions = {
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the class that triggers the CSS transition
        entry.target.classList.add('is-revealed');
        
        // Handle staggered animations via inline custom properties
        if (entry.target.style.getPropertyValue('--stagger')) {
           const staggerDelay = parseInt(entry.target.style.getPropertyValue('--stagger')) * 150; // 150ms per item
           entry.target.style.transitionDelay = `${staggerDelay}ms`;
        }

        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Start observing
  revealElements.forEach(el => revealObserver.observe(el));

  // For elements already in viewport on load (like Hero text), trigger immediately
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.about-hero .reveal-up, .about-hero .reveal-scale');
    heroElements.forEach(el => {
      el.classList.add('is-revealed');
      // If staggered hero elements
      if (el.style.getPropertyValue('--stagger')) {
        const staggerDelay = parseInt(el.style.getPropertyValue('--stagger')) * 150;
        el.style.transitionDelay = `${staggerDelay}ms`;
      }
    });
  }, 100);

  /* =========================================================================
     About Section: Subtle Parallax Effect
     ========================================================================= */
  const parallaxElements = document.querySelectorAll('.parallax-bg');

  if (!prefersReducedMotion && parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          parallaxElements.forEach(el => {
            // Find parent to calculate when it's in viewport
            const parent = el.closest('section') || el.parentElement;
            const parentRect = parent.getBoundingClientRect();
            
            // Only animate if somewhat visible
            if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
              const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
              // Calculate Y offset based on scroll position relative to the element
              const distanceToCenter = parentRect.top - (window.innerHeight / 2) + (parentRect.height / 2);
              const yPos = distanceToCenter * speed;
              
              el.style.transform = `translateY(${yPos}px)`;
            }
          });
        });
      }
    });
  }

  /* =========================================================================
     Tips Section: Grid vs List View Toggle
     ========================================================================= */
  const tipsGridBtn = document.getElementById('tips-view-grid');
  const tipsListBtn = document.getElementById('tips-view-list');
  const tipsGrid = document.getElementById('main-tips-grid');

  if (tipsGridBtn && tipsListBtn && tipsGrid) {
    tipsGridBtn.addEventListener('click', () => {
      tipsGridBtn.classList.add('active');
      tipsGridBtn.setAttribute('aria-pressed', 'true');
      tipsListBtn.classList.remove('active');
      tipsListBtn.setAttribute('aria-pressed', 'false');
      tipsGrid.classList.remove('list-view');
    });

    tipsListBtn.addEventListener('click', () => {
      tipsListBtn.classList.add('active');
      tipsListBtn.setAttribute('aria-pressed', 'true');
      tipsGridBtn.classList.remove('active');
      tipsGridBtn.setAttribute('aria-pressed', 'false');
      tipsGrid.classList.add('list-view');
    });
  }

  /* =========================================================================
     Tips Section: Bookmark and Share Interactions
     ========================================================================= */
  const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
  const shareBtns = document.querySelectorAll('.share-btn');
  const interactionToast = document.getElementById('interaction-toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!interactionToast) return;
    const msgEl = interactionToast.querySelector('.toast-message');
    if (msgEl) msgEl.innerText = message;
    
    interactionToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      interactionToast.classList.remove('show');
    }, 3000);
  };

  if (bookmarkBtns.length > 0) {
    bookmarkBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const isSaved = this.classList.toggle('saved');
        this.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        
        showToast(isSaved ? 'Saved to My Tips' : 'Removed from My Tips');
        
        try{
          if(window.gtag) gtag('event', 'bookmark_toggle', { event_category: 'engagement', event_label: isSaved ? 'saved' : 'unsaved' });
          if(window.dataLayer) dataLayer.push({ event: 'bookmark_toggle', state: isSaved ? 'saved' : 'unsaved' });
        }catch(err){}
      });
    });
  }

  if (shareBtns.length > 0) {
    shareBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;
        
        if (navigator.share) {
          navigator.share({
            title: 'Nubie Care Tips',
            url: url
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard');
          });
        }
        
        try{
          if(window.gtag) gtag('event', 'share_click', { event_category: 'engagement' });
          if(window.dataLayer) dataLayer.push({ event: 'share_click' });
        }catch(err){}
      });
    });
  }

  /* =========================================================================
     Contact Section: Form Submission & Toasts
     ========================================================================= */
  const contactForm = document.getElementById('luxury-contact-form');
  const contactToast = document.getElementById('contact-toast');
  const scheduleCallBtn = document.getElementById('schedule-call-btn');
  const scheduleModal = document.getElementById('schedule-modal');
  const scheduleCloseMs = document.querySelectorAll('#schedule-close-btn, #schedule-close-btn-bottom');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic HoneyPot check
      const honey = contactForm.querySelector('[name="_honey"]').value;
      if (honey) return; // Silent fail for bots

      const submitBtn = document.getElementById('contact-submit-btn');
      const shopBtn = document.getElementById('contact-shop-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      // Loading state
      submitBtn.setAttribute('disabled', 'true');
      btnText.setAttribute('hidden', 'true');
      btnSpinner.removeAttribute('hidden');

      // Simulate network request
      setTimeout(() => {
        // Success state
        submitBtn.setAttribute('hidden', 'true');
        shopBtn.removeAttribute('hidden');
        
        // Show Toast
        if (contactToast) {
          contactToast.classList.add('show');
          setTimeout(() => {
            contactToast.classList.remove('show');
          }, 4000);
        }

        // Tracking
        try {
          if (window.gtag) gtag('event', 'contact_form_submit', { event_category: 'conversion' });
          if (window.dataLayer) dataLayer.push({ event: 'contact_form_submit' });
        } catch (err) {}

      }, 1200);
    });
  }

  /* =========================================================================
     Contact Section: Schedule Modal
     ========================================================================= */
  if (scheduleCallBtn && scheduleModal) {
    scheduleCallBtn.addEventListener('click', () => {
      scheduleModal.setAttribute('aria-hidden', 'false');
      scheduleModal.classList.add('active'); // Re-using modal overlay styles if applicable
      document.body.style.overflow = 'hidden';
      // Tracking
      try {
        if (window.dataLayer) dataLayer.push({ event: 'schedule_call_click' });
      } catch (err) {}
    });

    scheduleCloseMs.forEach(btn => {
      btn.addEventListener('click', () => {
        scheduleModal.setAttribute('aria-hidden', 'true');
        scheduleModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* =========================================================================
     Contact Section: Map Interactivity
     ========================================================================= */
  const openMapBtn = document.getElementById('open-map-btn');
  const mapStrip = document.getElementById('map-strip');
  
  if (openMapBtn && mapStrip) {
    openMapBtn.addEventListener('click', () => {
      mapStrip.removeAttribute('hidden');
      mapStrip.setAttribute('aria-hidden', 'false');
      // Scroll to map smoothly
      mapStrip.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
