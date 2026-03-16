/**
 * Nubie About Page JavaScript
 * Handles scroll reveals and parallax imagery.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================================
     1. Scroll Reveal Animations (Intersection Observer)
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
     2. Subtle Parallax Effect
     ========================================================================= */
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;

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

          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
