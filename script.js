 const hamburger = document.getElementById('hamburger');
    const mobileClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

const products = [
    {
        title: "Piccolo Luna Bag",
        image: "./Assets/card/Bag-card.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$120"
    },
    {
        title: "Piccolo Vero Bag",
        image: "./Assets/card/Bg-card2.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$138"
    },
    {
        title: "Piccolo Amara Bag",
        image: "./Assets/card/Bag-card3.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$110"
    },
    {
        title: "bag lock",
        image: "./Assets/card/Bag-card4.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$15"
    },
    {
        title: "Piccolo Siena Bag",
        image: "./Assets/card/Baf-card5.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$141"
    },
    {
        title: "Piccolo Aria Bag",
        image: "./Assets/card/Bag-card6.png",
        swatches: ["#A08060", "#4A4A4A", "#E07A5F", "#6B3A3A"],
        originalPrice: "$200",
        currentPrice: "$80"
    }
];
const gridContainer = document.getElementById('product-grid');
let cart = [];
function addToCart(product) {
    cart.push(product);
    console.log("Current Cart:", cart); 
    alert(`${product.title} was added to your cart!`);
}

products.forEach(product => {
    const swatchesHtml = product.swatches.map(color => 
        `<span class="swatch" style="background-color: ${color}"></span>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'product-card';

 card.innerHTML = `
        <div class="image-container">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="swatches">
                ${swatchesHtml}
            </div>
            <div class="price-container">
                <span class="original-price">${product.originalPrice}</span>
                <span class="current-price">${product.currentPrice}</span>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
        </div>
    `;
 const addToCartBtn = card.querySelector('.add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', () => {
        addToCart(product);
    });

    gridContainer.appendChild(card);
});
(function () {
  const section = document.getElementById('comfort');
  const bg      = section.querySelector('.comfort__bg');

  if (!section || !bg) return;

  function applyParallax() {
    const rect   = section.getBoundingClientRect();
    const viewH  = window.innerHeight;

    if (rect.bottom < 0 || rect.top > viewH) return;

    const scrollPercent = (viewH - rect.top) / (viewH + rect.height);
    const progress = scrollPercent - 0.5;
    const maxShift = 50; 
    const shift = progress * maxShift;
    
    bg.style.transform = `scale(1.12) translate3d(0, ${shift}px, 0)`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  applyParallax(); 
})();

// blog

const posts = [
    {
      title: "Knack product capacity",
      desc: "Designed with a large capacity to carry all your gear without feeling cramped. Perfect for long trips and outdoor adventures.",
      category: "Design",
      author: "Audrian Borjas",
      date: "07/25/2025",
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      avatar: "https://i.pravatar.cc/40?img=1"
    },
    {
      title: "Brand details",
      desc: "Each of our backpacks is designed with attention to detail from premium materials and precision stitching to functional design.",
      category: "Branding",
      author: "Amelia Bega",
      date: "07/13/2025",
      img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
      avatar: "https://i.pravatar.cc/40?img=5"
    },
    {
      title: "Fabric texture",
      desc: "Made of soft, textured fabric with a smooth touch. The fibres are dense and wrinkle-resistant, providing a luscious feel without sacrificing strength.",
      category: "Materials",
      author: "Alexander Silva",
      date: "07/15/2025",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      avatar: "https://i.pravatar.cc/40?img=9"
    },
    {
      title: "Made of waterproof material",
      desc: "Designed with waterproof material to protect your belongings from rain and splashes. Perfect for everyday use without worrying about getting your belongings wet.",
      category: "Features",
      author: "Diego Amatti",
      date: "07/29/2025",
      img: "./Assets/Waterproof.png",
      avatar: "https://i.pravatar.cc/40?img=11"
    },
    {
      title: "Bill Walsh leadership lessons",
      desc: "Each product is crafted with precision details, the finest materials, and inserts in critical areas to accompany your activities at every occasion.",
      category: "Lifestyle",
      author: "Simon",
      date: "07/29/2025",
      img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
      avatar: "https://i.pravatar.cc/40?img=14"
    },
    {
      title: "Manufacture of goods",
      desc: "Each bag goes through a precise and high-quality manufacturing process. We ensure every bag that leaves our facility meets the highest standard.",
      category: "Process",
      author: "Tiktok Aye",
      date: "05/21/2025",
      img: "./bag.png",
      avatar: "https://i.pravatar.cc/40?img=20"
    }
  ];
 
  const grid = document.getElementById('blogGrid');
 
  posts.forEach(post => {
    grid.innerHTML += `
      <article class="blog-card">
        <div class="card-img-wrap">
          <img src="${post.img}" alt="${post.title}" loading="lazy"/>
          <span class="card-badge">${post.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${post.title}</h3>
          <p class="card-desc">${post.desc}</p>
          <div class="card-meta">
            <div class="card-author">
              <img class="author-avatar" src="${post.avatar}" alt="${post.author}"/>
              <div class="author-info">
                <span class="author-name">${post.author}</span>
                <span class="author-date">${post.date}</span>
              </div>
            </div>
            <span class="card-read">Read &rarr;</span>
          </div>
        </div>
      </article>
    `;
  });

   const items = document.querySelectorAll('.tl-item');
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  items.forEach(item => observer.observe(item));

  (function () {
  'use strict';
 
  /**
   * Initialise the FAQ accordion inside the footer.
   * Safe to call multiple times — uses a guard flag.
   */
  function initFaqAccordion() {
    const faqList = document.getElementById('footerFaq');
    if (!faqList || faqList.dataset.initialized) return;
    faqList.dataset.initialized = 'true';
 
    const items = Array.from(faqList.querySelectorAll('.faq-item'));
 
    items.forEach(function (item) {
      const trigger = item.querySelector('.faq-trigger');
      const panel   = item.querySelector('.faq-panel');
 
      if (!trigger || !panel) return;
 
      // Remove the HTML `hidden` attribute so CSS transition can work
      panel.removeAttribute('hidden');
 
      trigger.addEventListener('click', function () {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
 
        // Close ALL items first (accordion — one open at a time)
        closeAll(items);
 
        // If it wasn't open, open it now
        if (!isOpen) {
          openItem(trigger, panel);
        }
      });
    });
  }
 
  /* ── helpers ── */
 
  function openItem(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
  }
 
  function closeItem(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
  }
 
  function closeAll(items) {
    items.forEach(function (item) {
      const t = item.querySelector('.faq-trigger');
      const p = item.querySelector('.faq-panel');
      if (t && p) closeItem(t, p);
    });
  }
 
  /* ── Boot ── */
 
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }
 
})();

(function () {
  'use strict';

  function countUp(el, target, duration) {
    const suffix = target.suffix || '';
    const end    = target.value;
    const start  = 0;
    const range  = end - start;
    let startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.floor(easeOutQuart(progress) * range + start);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function parseTarget(text) {
    // Handles formats: "26+", "180k", "42", "3"
    const cleaned = text.trim();
    let suffix = '';
    let value  = 0;

    if (cleaned.endsWith('k')) {
      value  = parseFloat(cleaned) * 1000;
      suffix = 'k';
    } else if (cleaned.endsWith('+')) {
      value  = parseInt(cleaned);
      suffix = '+';
    } else {
      value  = parseInt(cleaned);
    }

    return { value, suffix };
  }

  function initCountUp() {
    const statsSection = document.querySelector('.story-stats');
    if (!statsSection) return;

    const statNums = Array.from(statsSection.querySelectorAll('.stat-num'));
    let hasAnimated = false;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          statNums.forEach(function (el, i) {
            const target = parseTarget(el.textContent);
            // Stagger each counter slightly
            setTimeout(function () {
              countUp(el, target, 18);
            }, i * 150);
          });

          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountUp);
  } else {
    initCountUp();
  }

})();