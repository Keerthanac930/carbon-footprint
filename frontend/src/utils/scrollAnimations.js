// INSANE scroll animations and effects
export const initScrollAnimations = () => {
  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Add explosion effect
        createExplosionEffect(entry.target);
      }
    });
  }, observerOptions);

  // Add reveal classes to elements
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  revealElements.forEach(el => observer.observe(el));

  // Create explosion effect function
  const createExplosionEffect = (element) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: explode 1s ease-out forwards;
      `;
      
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 50 + Math.random() * 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--vx', vx + 'px');
      particle.style.setProperty('--vy', vy + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  // Smooth scroll to top with momentum
  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  // Add scroll progress indicator
  const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: linear-gradient(90deg, #4CAF50, #45a049, #2E8B57);
      z-index: 9999;
      transition: width 0.1s ease;
      box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  };

  // Add parallax effect to background
  const addParallaxEffect = () => {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  };

  // Add floating scroll indicators
  const addScrollIndicators = () => {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.innerHTML = `
      <div style="
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      ">
        <div class="scroll-dot" style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.3);
          border: 2px solid rgba(76, 175, 80, 0.6);
          transition: all 0.3s ease;
          cursor: pointer;
        "></div>
        <div class="scroll-dot" style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.3);
          border: 2px solid rgba(76, 175, 80, 0.6);
          transition: all 0.3s ease;
          cursor: pointer;
        "></div>
        <div class="scroll-dot" style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.3);
          border: 2px solid rgba(76, 175, 80, 0.6);
          transition: all 0.3s ease;
          cursor: pointer;
        "></div>
      </div>
    `;
    
    document.body.appendChild(scrollIndicator);
    
    // Update active dot based on scroll position
    window.addEventListener('scroll', () => {
      const dots = document.querySelectorAll('.scroll-dot');
      const sections = document.querySelectorAll('.scroll-section, .form-section, .result-section');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const dot = dots[index];
        
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          dots.forEach(d => d.style.background = 'rgba(76, 175, 80, 0.3)');
          if (dot) {
            dot.style.background = 'rgba(76, 175, 80, 0.8)';
            dot.style.transform = 'scale(1.2)';
          }
        } else if (dot) {
          dot.style.transform = 'scale(1)';
        }
      });
    });
  };

  // Add smooth scroll behavior for anchor links
  const addSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // Add INSANE scroll-triggered animations
  const addScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScroll = () => {
      animatedElements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animated');
          
          // Add random crazy effects
          const effects = ['scroll-wave', 'scroll-bounce', 'scroll-spin', 'scroll-shake', 'scroll-zoom', 'scroll-flip', 'scroll-glow-pulse', 'scroll-rainbow', 'scroll-elastic'];
          const randomEffect = effects[Math.floor(Math.random() * effects.length)];
          
          element.classList.add(randomEffect);
          
          // Remove effect after animation
          setTimeout(() => {
            element.classList.remove(randomEffect);
          }, 2000);
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
  };

  // Add CRAZY scroll momentum with physics
  const addCrazyScrollMomentum = () => {
    let lastScrollY = 0;
    let scrollVelocity = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      if (!isScrolling) {
        requestAnimationFrame(() => {
          // Add crazy momentum effects
          const momentum = scrollVelocity * 0.1;
          document.body.style.transform = `translateY(${momentum}px) rotate(${momentum * 0.1}deg)`;
          
          // Add color shifting based on scroll speed
          const hue = Math.abs(scrollVelocity) * 2;
          document.body.style.filter = `hue-rotate(${hue}deg) saturate(${1 + Math.abs(scrollVelocity) * 0.01})`;
          
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
  };

  // Add SCROLL PARTICLE SYSTEM
  const addScrollParticles = () => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 10}px;
        width: ${Math.random() * 8 + 2}px;
        height: ${Math.random() * 8 + 2}px;
        background: linear-gradient(45deg, #4CAF50, #45a049, #2E8B57);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: particleFloat ${Math.random() * 3 + 2}s linear forwards;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };
    
    // Create particles on scroll
    let particleTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(particleTimer);
      particleTimer = setTimeout(() => {
        if (Math.random() > 0.7) {
          createParticle();
        }
      }, 100);
    });
  };

  // Add SCROLL SOUND EFFECTS (visual feedback)
  const addScrollSoundEffects = () => {
    let lastScrollTime = 0;
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 100) {
        // Create visual "sound" effect
        const soundWave = document.createElement('div');
        soundWave.style.cssText = `
          position: fixed;
          right: 20px;
          top: 50%;
          width: 4px;
          height: ${Math.random() * 50 + 20}px;
          background: linear-gradient(180deg, #4CAF50, #45a049);
          border-radius: 2px;
          pointer-events: none;
          z-index: 1000;
          animation: soundWave 0.5s ease-out forwards;
          opacity: 0.8;
        `;
        
        document.body.appendChild(soundWave);
        
        setTimeout(() => {
          soundWave.remove();
        }, 500);
        
        lastScrollTime = now;
      }
    });
  };

  // Initialize all INSANE scroll effects
  createScrollProgress();
  addParallaxEffect();
  addScrollIndicators();
  addSmoothScroll();
  addScrollAnimations();
  addCrazyScrollMomentum();
  addScrollParticles();
  addScrollSoundEffects();

  // Add scroll momentum effect
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        // Add momentum effect
        document.body.style.transform = `translateY(${window.scrollY * 0.02}px)`;
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Add scroll bounce effect
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollY > maxScroll - 100) {
      document.body.style.transform = `translateY(${Math.sin((scrollY - maxScroll + 100) * 0.1) * 5}px)`;
    } else {
      document.body.style.transform = 'translateY(0)';
    }
  });
};

// Export scroll utilities
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};
