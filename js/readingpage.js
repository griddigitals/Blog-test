// Standalone Blog - JavaScript for sidebar interaction and scroll tracking

(function() {
    'use strict';

    // Section IDs
    const sections = [
        'introduction',
        'choose-niche',
        'select-platform',
        'create-content',
        'design-blog',
        'promote-content',
        'monetize',
        'conclusion'
    ];

    let activeSection = '';
    let isMobileTocOpen = false;

    // DOM Elements
    const mobileTocButton = document.getElementById('mobileTocButton');
    const mobileTocIcon = document.getElementById('mobileTocIcon');
    const mobileTocContent = document.getElementById('mobileTocContent');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const mobileTocItems = document.querySelectorAll('.mobile-toc-item');

    // Initialize
    function init() {
        setupScrollTracking();
        setupClickHandlers();
        updateActiveSection(); // Set initial active section
    }

    // Setup scroll tracking
    function setupScrollTracking() {
        window.addEventListener('scroll', handleScroll);
    }

    // Handle scroll event
    function handleScroll() {
        const scrollPosition = window.scrollY + 120;

        // Find the current section
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPosition) {
                if (activeSection !== sections[i]) {
                    activeSection = sections[i];
                    updateActiveSection();
                }
                break;
            }
        }
    }

    // Update active section highlighting
    function updateActiveSection() {
        // Update sidebar items
        sidebarItems.forEach(item => {
            const sectionId = item.getAttribute('data-section');
            if (sectionId === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update mobile TOC items
        mobileTocItems.forEach(item => {
            const sectionId = item.getAttribute('data-section');
            if (sectionId === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Setup click handlers
    function setupClickHandlers() {
        // Mobile TOC toggle
        mobileTocButton.addEventListener('click', toggleMobileToc);

        // Sidebar items
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                scrollToSection(sectionId);
            });
        });

        // Mobile TOC items
        mobileTocItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                scrollToSection(sectionId);
                closeMobileToc();
            });
        });
    }

    // Toggle mobile TOC
    function toggleMobileToc() {
        isMobileTocOpen = !isMobileTocOpen;
        
        if (isMobileTocOpen) {
            mobileTocContent.classList.add('open');
            mobileTocIcon.classList.add('open');
        } else {
            mobileTocContent.classList.remove('open');
            mobileTocIcon.classList.remove('open');
        }
    }

    // Close mobile TOC
    function closeMobileToc() {
        isMobileTocOpen = false;
        mobileTocContent.classList.remove('open');
        mobileTocIcon.classList.remove('open');
    }

    // Smooth scroll to section
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 96; // Adjust based on header height
            const elementPosition = element.offsetTop - offset;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();




// Smart lazy swap with IntersectionObserver
(function(){
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const imgs = document.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      // swap src
      img.src = img.dataset.src;
      // if srcset data-srcset used, swap that too (not used in sample)
      img.addEventListener('load', () => img.classList.add('loaded'));
      obs.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  imgs.forEach(i => io.observe(i));
})();


// Related - smart lazy load + micro-parallax
(function(){
  'use strict';

  // Smart lazy-swap (data-src -> src)
  const lazyImgs = document.querySelectorAll('img.lazy[data-src]');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        // swap src if present
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) img.src = dataSrc;
        // if picture sources need dynamic swap, add data-srcset attributes and handle here
        img.addEventListener('load', () => img.classList.add('loaded'));
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImgs.forEach(img => io.observe(img));
  } else {
    // fallback: load all
    lazyImgs.forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) img.src = dataSrc;
    });
  }

  // Micro-parallax for featured image (very light, performant)
  const featured = document.querySelector('[data-parallax] .media .thumb');
  if (featured) {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = featured.getBoundingClientRect();
          const windowH = window.innerHeight || document.documentElement.clientHeight;
          // compute percent seen (0..1)
          const visible = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
          // map to translate range [-8px..8px] (small)
          const offset = (visible - 0.5) * 16 * 0.5; // smaller range
          featured.style.transform = `translateY(${offset}px) scale(${1})`;
          ticking = false;
        });
        ticking = true;
      }
    }

    // run on scroll & resize & initial
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

})();


const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
    backToTopBtn.classList.remove("hide");
  } else {
    backToTopBtn.classList.add("hide");
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


function calculateReadingTime() {
  const articles = document.querySelectorAll('article'); 
  const readingTimeElement = document.getElementById('reading-time');

  if (!articles.length || !readingTimeElement) return;

  let totalText = '';

  articles.forEach(a => {
    totalText += ' ' + a.innerText;
  });

  const words = totalText.trim().split(/\s+/).length;

  const wordsPerMinute = 220;
  const time = Math.ceil(words / wordsPerMinute);

  readingTimeElement.textContent = `${time} min read`;
}

calculateReadingTime();



// Copy link functionality
document.querySelector('.share-icons img[alt="Copy Link"]').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'));
});

// Dynamic Perplexity AI prompt
const perplexityLink = document.querySelector('.perplexity-link');
const articleText = encodeURIComponent(document.querySelector('#article').innerText);
perplexityLink.href = `https://www.perplexity.ai/search?q=Summarize this article: ${articleText}`;
