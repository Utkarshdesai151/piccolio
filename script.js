/* =============================================================
   MAIN.JS — Merged & unified script
   Sections:
     1. Pre-init (scrollbar hide, overflow lock, hero/navbar hide)
     2. Lenis smooth scroll loader
     3. Text split / reveal helpers
     4. Intro animation sequence
     5. Mobile menu
     6. Collection animations
     7. Products grid + cart
     8. Parallax (comfort section)
     9. Blog grid
    10. Timeline intersection observer
    11. FAQ accordion
    12. Count-up stats
   ============================================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. PRE-INIT
     Hide scrollbar + lock scroll until intro done
  ───────────────────────────────────────────── */
  const scrollbarStyle = document.createElement('style');
  scrollbarStyle.textContent =
    'html { scrollbar-width: none; }' +
    'html::-webkit-scrollbar { display: none; }';
  document.head.appendChild(scrollbarStyle);

  document.documentElement.style.overflow = 'hidden';

  const heroImg = document.querySelector('.hero-main-img');
  const navbar  = document.querySelector('.navbar');

  if (heroImg) {
    heroImg.style.opacity   = '0';
    heroImg.style.transform = 'translateY(32px) scale(0.97)';
    heroImg.style.transition = 'none';
  }
  if (navbar) {
    navbar.style.opacity   = '0';
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'none';
  }

  /* ─────────────────────────────────────────────
     2. LENIS SMOOTH SCROLL
  ───────────────────────────────────────────── */
  let lenis = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function loadLenis(callback) {
    if (typeof Lenis !== 'undefined') { callback(); return; }
    const script = document.createElement('script');
    script.src   = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    script.onload  = callback;
    script.onerror = function () {
      const fallback = document.createElement('script');
      fallback.src    = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
      fallback.onload = callback;
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  }

  /* ─────────────────────────────────────────────
     3. TEXT SPLIT / REVEAL HELPERS
  ───────────────────────────────────────────── */
  function splitToSpans(el, type) {
    type = type || 'chars';
    const text = el.textContent.trim();
    el.textContent = '';
    const units = type === 'words'
      ? text.split(' ').map(function (w) { return w + '\u00A0'; })
      : [...text];

    return units.map(function (unit) {
      const wrapper = document.createElement('span');
      wrapper.style.cssText =
        'display:inline-block; overflow:hidden; vertical-align:bottom; line-height:1.1;';

      const inner = document.createElement('span');
      inner.textContent = unit;
      inner.style.cssText =
        'display:inline-block;' +
        'transform:translateY(115%) rotate(6deg);' +
        'opacity:0;' +
        'will-change:transform, opacity;' +
        'transition:transform 1.2s cubic-bezier(0.22,1,0.36,1), opacity 1.1s cubic-bezier(0.22,1,0.36,1);';

      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      return inner;
    });
  }

  function revealSpans(spans, baseDelay, stagger) {
    baseDelay = baseDelay || 0;
    stagger   = stagger   || 80;
    return new Promise(function (resolve) {
      spans.forEach(function (span, i) {
        setTimeout(function () {
          span.style.transform = 'translateY(0%) rotate(0deg)';
          span.style.opacity   = '1';
        }, baseDelay + i * stagger);
      });
      setTimeout(resolve, baseDelay + (spans.length - 1) * stagger + 1200);
    });
  }

  function setupScrollReveal(el, stagger) {
    stagger = stagger || 110;
    const words = splitToSpans(el, 'words');
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealSpans(words, 0, stagger);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }).observe(el);
  }

  /* ─────────────────────────────────────────────
     4. INTRO ANIMATION SEQUENCE
  ───────────────────────────────────────────── */
  function revealNavbar() {
    return new Promise(function (resolve) {
      if (!navbar) return resolve();
      navbar.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
      navbar.style.opacity    = '1';
      navbar.style.transform  = 'translateY(0)';
      setTimeout(resolve, 900);
    });
  }

  async function runIntroSequence() {
    const title       = document.querySelector('.hero-title');
    const description = document.querySelector('.hero-description');
    const hero        = document.querySelector('.hero');

    if (hero) {
      hero.style.opacity    = '0';
      hero.style.transition = 'opacity 1.4s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(function () { hero.style.opacity = '1'; }, 80);
    }

    if (title) {
      const chars = splitToSpans(title, 'chars');
      await revealSpans(chars, 700, 80);
    }

    // Unlock scroll
    document.documentElement.style.overflow = '';

    loadLenis(initLenis);
    await revealNavbar();

    if (heroImg) {
      heroImg.style.transition = 'opacity 1.8s cubic-bezier(0.22,1,0.36,1), transform 2s cubic-bezier(0.22,1,0.36,1)';
      heroImg.style.opacity    = '1';
      heroImg.style.transform  = 'translateY(0) scale(1)';
    }

    if (description) setupScrollReveal(description);

    initCollectionAnimations();
  }

  /* ─────────────────────────────────────────────
     5. MOBILE MENU
     Single authoritative handler — no duplicates
  ───────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn   = document.getElementById('mobile-close');
    if (!hamburger || !mobileMenu || !closeBtn) return;

    // Prepare slide-in animation
    mobileMenu.style.position   = 'fixed';
    mobileMenu.style.inset      = '0';
    mobileMenu.style.transform  = 'translateX(100%)';
    mobileMenu.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    mobileMenu.style.willChange = 'transform';

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.style.transform = 'translateX(0)';
      document.documentElement.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.style.transform = 'translateX(100%)';
      document.documentElement.style.overflow = '';
      if (lenis) lenis.start();
    }

    hamburger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click',  closeMenu);

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ─────────────────────────────────────────────
     6. COLLECTION ANIMATIONS
  ───────────────────────────────────────────── */
  function initCollectionAnimations() {
    const collectionTitle = document.querySelector('.collection-title');
    if (collectionTitle) {
      const chars = splitToSpans(collectionTitle, 'chars');
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealSpans(chars, 0, 55);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 }).observe(collectionTitle);
    }

    const collectionSubtitle = document.querySelector('.collection-subtitle');
    if (collectionSubtitle) setupScrollReveal(collectionSubtitle, 80);

    document.querySelectorAll('.collection-card').forEach(function (card, i) {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(60px) scale(0.96)';
      card.style.willChange = 'transform, opacity';

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              card.style.transition = 'opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0) scale(1)';
            }, i * 180);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }).observe(card);
    });

    document.querySelectorAll('.show-more-btn').forEach(function (btn, i) {
      btn.style.opacity   = '0';
      btn.style.transform = 'translateY(16px)';

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              btn.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
              btn.style.opacity    = '1';
              btn.style.transform  = 'translateY(0)';
            }, i * 180 + 350);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 }).observe(btn);
    });
  }

  /* ─────────────────────────────────────────────
     7. PRODUCTS GRID + CART
  ───────────────────────────────────────────── */
  const products = [
    { title: 'Piccolo Luna Bag',  image: './Assets/card/Bag-card.png',  swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$120' },
    { title: 'Piccolo Vero Bag',  image: './Assets/card/Bg-card2.png',  swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$138' },
    { title: 'Piccolo Amara Bag', image: './bag.png', swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$110' },
    { title: 'Bag Lock',          image: './Assets/card/Bag-card4.png', swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$15'  },
    { title: 'Piccolo Siena Bag', image: './Assets/card/Baf-card5.png', swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$141' },
    { title: 'Piccolo Aria Bag',  image: './Assets/card/Bag-card6.png', swatches: ['#A08060','#4A4A4A','#E07A5F','#6B3A3A'], originalPrice: '$200', currentPrice: '$80'  },
  ];

  const cart = [];

  function addToCart(product) {
    cart.push(product);
    console.log('Current Cart:', cart);
    alert(product.title + ' was added to your cart!');
  }

  function initProductGrid() {
    const gridContainer = document.getElementById('product-grid');
    if (!gridContainer) return;

    products.forEach(function (product, i) {
      const swatchesHtml = product.swatches.map(function (color) {
        return '<span class="swatch" style="background-color:' + color + '"></span>';
      }).join('');

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML =
        '<div class="image-container">' +
          '<img src="' + product.image + '" alt="' + product.title + '">' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-title">' + product.title + '</h3>' +
          '<div class="swatches">' + swatchesHtml + '</div>' +
          '<div class="price-container">' +
            '<span class="original-price">' + product.originalPrice + '</span>' +
            '<span class="current-price">'  + product.currentPrice  + '</span>' +
          '</div>' +
          '<button class="add-to-cart-btn">Add to Cart</button>' +
        '</div>';

      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.willChange = 'opacity, transform';

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              card.style.transition = 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 120);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 }).observe(card);

      card.querySelector('.add-to-cart-btn').addEventListener('click', function () {
        addToCart(product);
      });

      gridContainer.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────
     8. PARALLAX — comfort section
  ───────────────────────────────────────────── */
  function initParallax() {
    const section = document.getElementById('comfort');
    if (!section) return;
    const bg = section.querySelector('.comfort__bg');
    if (!bg) return;

    function applyParallax() {
      const rect    = section.getBoundingClientRect();
      const viewH   = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;

      const scrollPercent = (viewH - rect.top) / (viewH + rect.height);
      const progress      = scrollPercent - 0.5;
      const shift         = progress * 50; // maxShift = 50px
      bg.style.transform  = 'scale(1.12) translate3d(0, ' + shift + 'px, 0)';
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          applyParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    applyParallax();
  }

  /* ─────────────────────────────────────────────
     9. BLOG GRID
  ───────────────────────────────────────────── */
  const posts = [
    {
      title: 'Knack product capacity',
      desc:  'Designed with a large capacity to carry all your gear without feeling cramped. Perfect for long trips and outdoor adventures.',
      category: 'Design',   author: 'Audrian Borjas',  date: '07/25/2025',
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    {
      title: 'Brand details',
      desc:  'Each of our backpacks is designed with attention to detail from premium materials and precision stitching to functional design.',
      category: 'Branding', author: 'Amelia Bega',     date: '07/13/2025',
      img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
      avatar: 'https://i.pravatar.cc/40?img=5'
    },
    {
      title: 'Fabric texture',
      desc:  'Made of soft, textured fabric with a smooth touch. The fibres are dense and wrinkle-resistant, providing a luscious feel without sacrificing strength.',
      category: 'Materials', author: 'Alexander Silva', date: '07/15/2025',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      avatar: 'https://i.pravatar.cc/40?img=9'
    },
    {
      title: 'Made of waterproof material',
      desc:  'Designed with waterproof material to protect your belongings from rain and splashes. Perfect for everyday use without worrying about getting your belongings wet.',
      category: 'Features',  author: 'Diego Amatti',   date: '07/29/2025',
      img: './Assets/Waterproof.png',
      avatar: 'https://i.pravatar.cc/40?img=11'
    },
    {
      title: 'Bill Walsh leadership lessons',
      desc:  'Each product is crafted with precision details, the finest materials, and inserts in critical areas to accompany your activities at every occasion.',
      category: 'Lifestyle', author: 'Simon',           date: '07/29/2025',
      img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80',
      avatar: 'https://i.pravatar.cc/40?img=14'
    },
    {
      title: 'Manufacture of goods',
      desc:  'Each bag goes through a precise and high-quality manufacturing process. We ensure every bag that leaves our facility meets the highest standard.',
      category: 'Process',   author: 'Tiktok Aye',     date: '05/21/2025',
      img: './bag.png',
      avatar: 'https://i.pravatar.cc/40?img=20'
    },
  ];

  function initBlogGrid() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    posts.forEach(function (post, i) {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML =
        '<div class="card-img-wrap">' +
          '<img src="' + post.img + '" alt="' + post.title + '" loading="lazy"/>' +
          '<span class="card-badge">' + post.category + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-title">' + post.title + '</h3>' +
          '<p class="card-desc">' + post.desc + '</p>' +
          '<div class="card-meta">' +
            '<div class="card-author">' +
              '<img class="author-avatar" src="' + post.avatar + '" alt="' + post.author + '"/>' +
              '<div class="author-info">' +
                '<span class="author-name">' + post.author + '</span>' +
                '<span class="author-date">' + post.date   + '</span>' +
              '</div>' +
            '</div>' +
            '<span class="card-read">Read &rarr;</span>' +
          '</div>' +
        '</div>';

      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.willChange = 'opacity, transform';
      card.style.animation = 'none';

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              card.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 100);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 }).observe(card);

      grid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────
     10. TIMELINE INTERSECTION OBSERVER
  ───────────────────────────────────────────── */
  function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initFaqAccordion() {
    const faqList = document.getElementById('footerFaq');
    if (!faqList || faqList.dataset.initialized) return;
    faqList.dataset.initialized = 'true';

    const items = Array.from(faqList.querySelectorAll('.faq-item'));

    function openItem(trigger, panel) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
    }
    function closeItem(trigger, panel) {
      trigger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    }
    function closeAll() {
      items.forEach(function (item) {
        const t = item.querySelector('.faq-trigger');
        const p = item.querySelector('.faq-panel');
        if (t && p) closeItem(t, p);
      });
    }

    items.forEach(function (item) {
      const trigger = item.querySelector('.faq-trigger');
      const panel   = item.querySelector('.faq-panel');
      if (!trigger || !panel) return;

      panel.removeAttribute('hidden'); // allow CSS transitions

      trigger.addEventListener('click', function () {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!isOpen) openItem(trigger, panel);
      });
    });
  }

  function initCountUp() {
    const statsSection = document.querySelector('.story-stats');
    if (!statsSection) return;

    const statNums = Array.from(statsSection.querySelectorAll('.stat-num'));
    let hasAnimated = false;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function countUp(el, target, duration) {
      const end   = target.value;
      const suffix = target.suffix;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(easeOutQuart(progress) * end) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = end + suffix;
      }
      requestAnimationFrame(step);
    }

    function parseTarget(text) {
      const cleaned = text.trim();
      if (cleaned.endsWith('k')) return { value: parseFloat(cleaned) * 1000, suffix: 'k' };
      if (cleaned.endsWith('+')) return { value: parseInt(cleaned),           suffix: '+' };
      return { value: parseInt(cleaned), suffix: '' };
    }

    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNums.forEach(function (el, i) {
            const target = parseTarget(el.textContent);
            setTimeout(function () { countUp(el, target, 1800); }, i * 150);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 }).observe(statsSection);
  }

  function setupScrollFadeIn(el, opts) {
    if (!el) return;
    opts = opts || {};
    const offset = opts.offset || '24px';
    const duration = typeof opts.duration === 'number' ? opts.duration : 800;
    const delay = typeof opts.delay === 'number' ? opts.delay : 0;
    const easing = opts.easing || 'cubic-bezier(0.22,1,0.36,1)';
    const threshold = typeof opts.threshold === 'number' ? opts.threshold : 0.2;

    el.style.opacity = '0';
    el.style.transform = 'translateY(' + offset + ')';
    el.style.willChange = 'opacity, transform';
    el.style.animation = 'none';

    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            el.style.transition = 'opacity ' + duration + 'ms ' + easing + ', transform ' + duration + 'ms ' + easing;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: threshold }).observe(el);
  }

  function initScrollRevealSections() {
    setupScrollFadeIn(document.querySelector('.your-choice'));
    setupScrollFadeIn(document.querySelector('.all-products'));
    setupScrollFadeIn(document.querySelector('.comfort__title'));
    setupScrollFadeIn(document.querySelector('.comfort__body'));
    setupScrollFadeIn(document.querySelector('.blog-section .section-header'));
    setupScrollFadeIn(document.querySelector('.btn-all'), { delay: 120 });
    setupScrollFadeIn(document.querySelector('.story-top'));
    setupScrollFadeIn(document.querySelector('.story-bottom'));
    setupScrollFadeIn(document.querySelector('.footer-subscribe'));
    setupScrollFadeIn(document.querySelector('.footer-body'));
  }

  function boot() {
    runIntroSequence();  
    initMobileMenu();
    initProductGrid();
    initParallax();
    initBlogGrid();
    initTimeline();
    initFaqAccordion();
    initCountUp();
    initScrollRevealSections();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();