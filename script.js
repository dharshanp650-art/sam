// Single source of truth for sold paintings, tracked server-side (see sold_products.json
// and the /api/sold-products, /submit_order routes in app.py). A painting is added to this
// list automatically the moment a customer's order for it is successfully placed — nobody
// needs to edit this by hand. Starts empty and is populated by loadSoldProducts() below.
let SOLD_PRODUCT_IDS = [];

// Mark sold paintings with a badge, dimmed image, and struck-through price
// on any page that renders .product-card elements (homepage carousels, shop grid, etc.)
function markSoldProducts(){
  document.querySelectorAll('.product-card').forEach(card=>{
    const isSold = SOLD_PRODUCT_IDS.includes(card.dataset.productId);
    if(!isSold) return;

    const frame = card.querySelector('.product-frame');
    if(frame && !frame.querySelector('.sold-badge')){
      frame.classList.add('is-sold');
      const badge = document.createElement('span');
      badge.className = 'sold-badge';
      badge.textContent = 'Sold';
      frame.appendChild(badge);
    }

    const priceEl = card.querySelector('.product-price');
    if(priceEl && !priceEl.querySelector('.sold-label')){
      const priceText = priceEl.textContent.trim();
      priceEl.innerHTML = '<span class="price-was">' + priceText + '</span><span class="sold-label">Sold</span>';
    }
  });
}

// Builds a .product-card DOM node from a PRODUCTS entry (products-data.js), matching
// the exact markup/class/attribute contract every other system already expects
// (markSoldProducts, applyFilters, the shop-page click-to-detail handler, quick-view).
function buildProductCardElement(id){
  const p = PRODUCTS[id];
  if(!p) return null;
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = id;
  card.dataset.artist = p.artist;
  card.dataset.size = p.sizeCategory;
  card.dataset.frame = p.frame;
  card.dataset.price = String(p.price);
  card.dataset.category = p.category;

  card.innerHTML = `
    <div class="product-frame frame-${p.cardFrameStyle}">
      <img src="${p.image}" alt="${p.alt || p.title}">
      <div class="quick-view"><button>QUICK VIEW</button></div>
    </div>
    <div class="product-info">
      <p class="artist-name"></p>
      <p class="product-title">${p.title}</p>
      <p class="product-price">${formatPrice(p.price)}</p>
    </div>`;
  return card;
}

function renderProductCards(containerEl, ids){
  if(!containerEl) return;
  containerEl.innerHTML = '';
  ids.forEach(id=>{
    const card = buildProductCardElement(id);
    if(card) containerEl.appendChild(card);
  });
}

// Populate the shop grid and homepage carousels from the shared product data, before
// anything else on the page (filters, quick-view, sold badges) needs to query .product-card.
document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.querySelector('.shop-page .products-grid');
  if(grid) renderProductCards(grid, SHOP_GRID_ORDER);

  const featured = document.querySelector('.featured-carousel');
  const trending = document.querySelector('.trending-carousel');
  if(featured) renderProductCards(featured, FEATURED_CAROUSEL_ORDER);
  if(trending) renderProductCards(trending, TRENDING_CAROUSEL_ORDER);
});

// Fetch the live sold-products list from the server, then apply it to any product
// cards on the page and notify listeners (e.g. the product-detail page) it's ready.
async function loadSoldProducts(){
  try {
    const res = await fetch('/api/sold-products');
    if(res.ok){
      const data = await res.json();
      SOLD_PRODUCT_IDS = Array.isArray(data.sold) ? data.sold : [];
    }
  } catch(err){
    console.warn('Could not load sold products list', err);
  }
  markSoldProducts();
  document.dispatchEvent(new CustomEvent('sold-products-updated'));
}

document.addEventListener('DOMContentLoaded', loadSoldProducts);

// Video background initialization
document.addEventListener('DOMContentLoaded',()=>{
  const video=document.querySelector('.hero-video');
  if(video){
    video.playbackRate=1;
    video.play();
  }

  // Initialize quote overlay to be transparent initially
  const quoteOverlay = document.querySelector('.quote-overlay');
  if(quoteOverlay){
    quoteOverlay.style.opacity = '0';
  }

  // Ensure hero video is visible initially
  if(video){
    video.style.opacity = '1';
  }
  
  // Initialize header scroll effect
  initializeHeaderScroll();
  
  // Initialize hamburger menu
  initializeHamburgerMenu();
  
  // Prevent page scroll while intro is visible
  enforceIntroScroll();
  
  // Initialize dropdown menu
  initializeDropdownMenu();
  
  // Initialize 3D floating cards
  initializeFLoatingCards();
  
  // Initialize artistcloud scroll animation
  initializeArtistcloudAnimation();

  // Initialize footer accordion for mobile
  initializeFooterAccordion();
});

// Prevent scrolling while hero section is visible - unlock on scroll attempt
function enforceIntroScroll(){
  // Scroll lock disabled - allow smooth scrolling through all sections
  return;
}

// Scroll indicator functionality
function initializeScrollIndicator(){
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if(scrollIndicator){
    scrollIndicator.addEventListener('click', ()=>{
      window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
    });
  }
}

// Header scroll effect - change background when scrolled away from hero
function initializeHeaderScroll(){
  const header=document.querySelector('.site-header');
  const heroFadeSection=document.getElementById('heroFadeSection');

  if(!header) return;

  let isHeaderScrolled=false;
  let updateScheduled=false;

  function getThreshold(){
    // Stay blended over the whole pinned video/quote/artistcloud journey;
    // only switch to solid once that section has fully scrolled past.
    if(!heroFadeSection) return 50;
    return heroFadeSection.offsetTop + heroFadeSection.offsetHeight - window.innerHeight - 40;
  }

  window.addEventListener('scroll',()=>{
    if(updateScheduled) return;
    updateScheduled=true;

    requestAnimationFrame(()=>{
      const scrollPos = window.scrollY;
      const shouldBeScrolled = scrollPos > getThreshold();

      // Only update if state changed
      if(shouldBeScrolled && !isHeaderScrolled){
        header.classList.add('scrolled');
        isHeaderScrolled=true;
      }else if(!shouldBeScrolled && isHeaderScrolled){
        header.classList.remove('scrolled');
        isHeaderScrolled=false;
      }

      updateScheduled=false;
    });
  });
}

// Hamburger menu functionality
function initializeHamburgerMenu(){
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if(!hamburger || !mobileMenu) return;
  
  hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  
  // Close menu when clicking on a link (but not dropdown toggles)
  const mobileLinks = mobileMenu.querySelectorAll('a:not(.dropdown-toggle)');
  mobileLinks.forEach(link => {
    link.addEventListener('click', ()=>{
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e)=>{
    if(!hamburger.contains(e.target) && !mobileMenu.contains(e.target)){
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// Dropdown Menu functionality
function initializeDropdownMenu(){
  const dropdowns=document.querySelectorAll('.dropdown');
  
  if(dropdowns.length === 0) return;
  
  dropdowns.forEach((dropdown)=>{
    const dropdownToggle=dropdown.querySelector('.dropdown-toggle');
    if(!dropdownToggle) return;
    
    // Click handler to toggle dropdown
    dropdownToggle.addEventListener('click',(e)=>{
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click',(e)=>{
      if(!dropdown.contains(e.target)){
        dropdown.classList.remove('active');
      }
    });
    
    // Close dropdown when pressing Escape
    document.addEventListener('keydown',(e)=>{
      if(e.key==='Escape'){
        dropdown.classList.remove('active');
      }
    });
    
    // Menu item interactions
    const dropdownItems=dropdown.querySelectorAll('.dropdown-menu a');
    dropdownItems.forEach((item,index)=>{
      item.addEventListener('mouseover',(e)=>{
        // Add stagger effect to items
        dropdownItems.forEach((el,i)=>{
          el.style.opacity=i===index?'1':'0.6';
        });
      });
      
      item.addEventListener('mouseleave',()=>{
        dropdownItems.forEach(el=>{
          el.style.opacity='0.85';
        });
      });
      
      item.addEventListener('click',(e)=>{
        e.preventDefault();
        dropdown.classList.remove('active');
        
        // Navigate with delay
        setTimeout(()=>{
          window.location.href=item.href;
        },250);
      });
    });
  });
}

// 3D Floating Cards Animation
function initializeFLoatingCards(){
  const floatingCards=document.querySelectorAll('.floating-card');
  const uniqueGallery=document.querySelector('.unique-gallery-section');
  
  if(!uniqueGallery||floatingCards.length===0) return;
  
  document.addEventListener('mousemove',(e)=>{
    const rect=uniqueGallery.getBoundingClientRect();
    const mouseX=(e.clientX-rect.left)/rect.width;
    const mouseY=(e.clientY-rect.top)/rect.height;
    
    floatingCards.forEach((card,index)=>{
      const rotX=(mouseY-0.5)*25;
      const rotY=(mouseX-0.5)*25;
      card.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(50px)`;
    });
  });
  
  document.addEventListener('mouseleave',()=>{
    floatingCards.forEach(card=>{
      card.style.transform='rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
  
  // Scroll-based 3D transformation
  window.addEventListener('scroll',()=>{
    const scrollProgress=window.scrollY/document.documentElement.scrollHeight;
    floatingCards.forEach((card,index)=>{
      const rotationZ=scrollProgress*360*(index%2===0?1:-1);
      card.style.animation=`float 6s ease-in-out infinite, spin-${index} 20s linear infinite`;
    });
  });
}

// Helper: smoothly fade an <img> element to a new source
function fadeToImage(imgEl, newSrc){
  if(!imgEl || !newSrc) return;
  const cur = imgEl.getAttribute('data-current') || imgEl.src || '';
  if(cur && cur.indexOf(newSrc)!==-1) return;
  imgEl.style.transition = 'opacity 0.36s ease';
  imgEl.style.opacity = '0';
  const tmp = new Image();
  tmp.onload = () => {
    imgEl.src = newSrc;
    imgEl.setAttribute('data-current', newSrc);
    requestAnimationFrame(()=>{ imgEl.style.opacity = '1'; });
  };
  tmp.src = newSrc;
}

// NEW Carousel functionality with responsive behavior
let newIndex=0;
const newCarouselWrapper=document.querySelector('#newCarousel');
if(newCarouselWrapper){
  const newItems=newCarouselWrapper.querySelectorAll('.carousel-item');
  const newTotal=newItems.length;
  let newPerView=4;
  
  function getNewItemsPerView(){
    const width=window.innerWidth;
    if(width<=640) return 1;
    if(width<=900) return 2;
    if(width<=1024) return 3;
    return 4;
  }
  
  newPerView=getNewItemsPerView();
  
  function updateNewCarousel(){
    const itemWidth=100/newPerView;
    const offset=-newIndex*itemWidth;
    newCarouselWrapper.style.transform=`translateX(${offset}%)`;
  }
  
  window.addEventListener('resize',()=>{
    newPerView=getNewItemsPerView();
    newIndex=Math.min(newIndex,Math.max(0,newTotal-newPerView));
    updateNewCarousel();
  });
  
  document.getElementById('newPrevBtn')?.addEventListener('click',()=>{
    newIndex=Math.max(0,newIndex-1);
    updateNewCarousel();
  });
  
  document.getElementById('newNextBtn')?.addEventListener('click',()=>{
    newIndex=Math.min(newTotal-newPerView,newIndex+1);
    updateNewCarousel();
  });
  
  // Touch support for new carousel
  let newTouchStartX=0;
  let newTouchEndX=0;
  
  newCarouselWrapper.addEventListener('touchstart',(e)=>{
    newTouchStartX=e.changedTouches[0].screenX;
  });
  
  newCarouselWrapper.addEventListener('touchend',(e)=>{
    newTouchEndX=e.changedTouches[0].screenX;
    handleNewSwipe();
  });
  
  function handleNewSwipe(){
    const swipeThreshold=50;
    if(newTouchStartX-newTouchEndX>swipeThreshold){
      document.getElementById('newNextBtn')?.click();
    }
    if(newTouchEndX-newTouchStartX>swipeThreshold){
      document.getElementById('newPrevBtn')?.click();
    }
  }
}

// Featured Works Carousel functionality (show 4 items on desktop, 1 item on mobile, navigate by groups)
let featuredIndex=0;
const featuredCarousel=document.querySelector('.featured-carousel');
if(featuredCarousel){
  const featuredItems=featuredCarousel.querySelectorAll('.product-card');
  const featuredTotal=featuredItems.length;
  
  function getItemsPerView(){
    return window.innerWidth<480?1:4;
  }
  
  function getGap(){
    return window.innerWidth<480?0:48;
  }
  
  function updateFeaturedCarousel(){
    // Get the actual width of the first item element
    if(featuredItems.length>0){
      const itemElement=featuredItems[0];
      const itemWidth=itemElement.offsetWidth;
      const gap=getGap();
      // Scroll by (item width + gap) for each group
      const scrollAmount=(itemWidth+gap)*featuredIndex;
      featuredCarousel.scrollLeft=scrollAmount;
    }
  }
  
  function updateButtonStates(){
    const itemsPerView=getItemsPerView();
    const prevBtn=document.getElementById('featuredPrevBtn');
    const nextBtn=document.getElementById('featuredNextBtn');
    
    // Disable prev button when at start
    if(prevBtn){
      prevBtn.disabled=featuredIndex===0;
      prevBtn.style.opacity=featuredIndex===0?'0.3':'0.6';
      prevBtn.style.pointerEvents=featuredIndex===0?'none':'auto';
    }

    // Disable next button when at end
    if(nextBtn){
      const hasMore=featuredIndex+itemsPerView<featuredTotal;
      nextBtn.disabled=!hasMore;
      nextBtn.style.opacity=hasMore?'0.6':'0.3';
      nextBtn.style.pointerEvents=hasMore?'auto':'none';
    }
  }
  
  document.getElementById('featuredPrevBtn')?.addEventListener('click',()=>{
    const itemsPerView=getItemsPerView();
    if(featuredIndex>0){
      featuredIndex=Math.max(0,featuredIndex-itemsPerView);
      updateFeaturedCarousel();
      updateButtonStates();
    }
  });
  
  document.getElementById('featuredNextBtn')?.addEventListener('click',()=>{
    const itemsPerView=getItemsPerView();
    if(featuredIndex+itemsPerView<featuredTotal){
      featuredIndex=Math.min(featuredTotal-itemsPerView,featuredIndex+itemsPerView);
      updateFeaturedCarousel();
      updateButtonStates();
    }
  });
  
  // Update on resize
  window.addEventListener('resize',()=>{
    updateFeaturedCarousel();
    updateButtonStates();
  });
  
  // Initial setup
  setTimeout(()=>{
    updateFeaturedCarousel();
    updateButtonStates();
  },100);
  
  // Setup featured quick view buttons
  const modal=document.getElementById('quickViewModal');
  const featuredQuickViewButtons=document.querySelectorAll('.featured-carousel .quick-view button');
  
  featuredQuickViewButtons.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      
      // Close trending modal if it's open
      try{
        const trendingModal=document.getElementById('trendingQuickViewModal');
        if(trendingModal && trendingModal.classList.contains('active')){
          trendingModal.classList.remove('active');
        }
      }catch(e){}
      
      const productCard=btn.closest('.product-card');
      if(!productCard) return;
      
      const productId=productCard.getAttribute('data-product-id');
      const product=productId?PRODUCTS[productId]:null;

      if(product && modal){
        // Update modal content
        const modalGalleryImages=product.images||[product.image];
        const modalImgEl=document.getElementById('modalProductImage');

        if(modalImgEl) modalImgEl.src=modalGalleryImages[0];
        document.getElementById('modalArtistName').textContent=product.artist;
        document.getElementById('modalProductTitle').textContent=product.title;
        document.getElementById('modalPrice').textContent=formatPrice(product.price);
        document.getElementById('modalDescription').textContent=product.description;

        // Store modal gallery data on window for nav buttons to use
        window.featuredModalImages=modalGalleryImages;
        window.featuredModalIndex=0;
        window.currentFeaturedProductId=productId;

        modal.classList.add('active');
      }
    });
  });
  
  // Setup featured item frame clicks - navigate to product detail page
  const featuredProductCards=document.querySelectorAll('.featured-carousel .product-card');
  featuredProductCards.forEach((card)=>{
    card.style.cursor='pointer';
    
    // Add click handler to the product frame/image to ensure clicks on the image navigate
    const productFrame=card.querySelector('.product-frame');
    if(productFrame){
      productFrame.addEventListener('click',(e)=>{
        e.stopPropagation();
        const productId=card.getAttribute('data-product-id');
        if(productId){
          window.location.href=`product-detail.html?product=${productId}`;
        }
      });
    }
    
    // Also keep the card click handler for clicks on the product info
    card.addEventListener('click',(e)=>{
      // Don't navigate if quick-view button is clicked
      if(e.target.closest('.quick-view')) return;
      // Don't navigate if it was the product frame (already handled above)
      if(e.target.closest('.product-frame')) return;
      e.stopPropagation();
      const productId=card.getAttribute('data-product-id');
      if(productId){
        window.location.href=`product-detail.html?product=${productId}`;
      }
    });
  });
  
  // Featured modal close button
  const featuredCloseBtn=document.getElementById('closeModal');
  if(featuredCloseBtn){
    featuredCloseBtn.addEventListener('click',()=>{
      const featuredModal=document.getElementById('quickViewModal');
      if(featuredModal){
        featuredModal.classList.remove('active');
      }
    });
  }
  
  // Featured modal prev/next buttons
  const featuredModalPrev=document.querySelector('#quickViewModal .modal-prev');
  const featuredModalNext=document.querySelector('#quickViewModal .modal-next');
  const featuredModalImgEl=document.getElementById('modalProductImage');
  
  if(featuredModalPrev){
    featuredModalPrev.addEventListener('click',()=>{
      const images=window.featuredModalImages||[];
      if(!images.length) return;
      const index=(window.featuredModalIndex||0);
      window.featuredModalIndex=(index-1+images.length)%images.length;
      if(featuredModalImgEl) fadeToImage(featuredModalImgEl, images[window.featuredModalIndex]);
    });
  }
  
  if(featuredModalNext){
    featuredModalNext.addEventListener('click',()=>{
      const images=window.featuredModalImages||[];
      if(!images.length) return;
      const index=(window.featuredModalIndex||0);
      window.featuredModalIndex=(index+1)%images.length;
      if(featuredModalImgEl) fadeToImage(featuredModalImgEl, images[window.featuredModalIndex]);
    });
  }
}

// Trending Carousel functionality (show 4 items on desktop, 1 item on mobile, navigate by groups)
let trendingIndex=0;
const trendingCarousel=document.querySelector('.trending-carousel');
if(trendingCarousel){
  const trendingItems=trendingCarousel.querySelectorAll('.product-card');
  const trendingTotal=trendingItems.length;
  
  function getItemsPerView(){
    return window.innerWidth<480?1:4;
  }
  
  function getGap(){
    return window.innerWidth<480?0:48;
  }
  
  function updateTrendingCarousel(){
    // Get the actual width of the first item element
    if(trendingItems.length>0){
      const itemElement=trendingItems[0];
      const itemWidth=itemElement.offsetWidth;
      const gap=getGap();
      // Scroll by (item width + gap) for each group
      const scrollAmount=(itemWidth+gap)*trendingIndex;
      trendingCarousel.scrollLeft=scrollAmount;
    }
  }
  
  function updateButtonStates(){
    const itemsPerView=getItemsPerView();
    const prevBtn=document.getElementById('trendingPrevBtn');
    const nextBtn=document.getElementById('trendingNextBtn');
    
    // Disable prev button when at start
    if(prevBtn){
      prevBtn.disabled=trendingIndex===0;
      prevBtn.style.opacity=trendingIndex===0?'0.3':'0.6';
      prevBtn.style.pointerEvents=trendingIndex===0?'none':'auto';
    }
    
    // Disable next button when at end
    if(nextBtn){
      const hasMore=trendingIndex+itemsPerView<trendingTotal;
      nextBtn.disabled=!hasMore;
      nextBtn.style.opacity=hasMore?'0.6':'0.3';
      nextBtn.style.pointerEvents=hasMore?'auto':'none';
    }
  }
  
  document.getElementById('trendingPrevBtn')?.addEventListener('click',()=>{
    const itemsPerView=getItemsPerView();
    if(trendingIndex>0){
      trendingIndex=Math.max(0,trendingIndex-itemsPerView);
      updateTrendingCarousel();
      updateButtonStates();
    }
  });
  
  document.getElementById('trendingNextBtn')?.addEventListener('click',()=>{
    const itemsPerView=getItemsPerView();
    if(trendingIndex+itemsPerView<trendingTotal){
      trendingIndex=Math.min(trendingTotal-itemsPerView,trendingIndex+itemsPerView);
      updateTrendingCarousel();
      updateButtonStates();
    }
  });
  
  // Update on resize
  window.addEventListener('resize',()=>{
    updateTrendingCarousel();
    updateButtonStates();
  });
  
  // Initial setup
  setTimeout(()=>{
    updateTrendingCarousel();
    updateButtonStates();
  },100);
  
  // Setup trending quick view buttons
  const modal=document.getElementById('trendingQuickViewModal');
  const trendingQuickViewButtons=document.querySelectorAll('.trending-carousel .quick-view button');
  
  trendingQuickViewButtons.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      
      // Close featured modal if it's open
      try{
        const featuredModal=document.getElementById('quickViewModal');
        if(featuredModal && featuredModal.classList.contains('active')){
          featuredModal.classList.remove('active');
        }
      }catch(e){}
      
      const productCard=btn.closest('.product-card');
      if(!productCard) return;
      
      const productId=productCard.getAttribute('data-product-id');
      const product=productId?PRODUCTS[productId]:null;

      if(product && modal){
        // Update modal content
        const modalGalleryImages=product.images||[product.image];
        const modalImgEl=document.getElementById('trendingModalProductImage');

        if(modalImgEl) modalImgEl.src=modalGalleryImages[0];
        document.getElementById('trendingModalArtistName').textContent=product.artist;
        document.getElementById('trendingModalProductTitle').textContent=product.title;
        document.getElementById('trendingModalPrice').textContent=formatPrice(product.price);
        document.getElementById('trendingModalDescription').textContent=product.description;
        
        // Store modal gallery data on window for nav buttons to use
        window.trendingModalImages=modalGalleryImages;
        window.trendingModalIndex=0;
        
        modal.classList.add('active');
      }
    });
  });
  
  // Setup trending item frame clicks - navigate to product detail page
  const trendingProductCards=document.querySelectorAll('.trending-carousel .product-card');
  trendingProductCards.forEach((card)=>{
    card.style.cursor='pointer';
    
    // Add click handler to the product frame/image to ensure clicks on the image navigate
    const productFrame=card.querySelector('.product-frame');
    if(productFrame){
      productFrame.addEventListener('click',(e)=>{
        e.stopPropagation();
        const productId=card.getAttribute('data-product-id');
        if(productId){
          window.location.href=`product-detail.html?product=${productId}`;
        }
      });
    }
    
    // Also keep the card click handler for clicks on the product info
    card.addEventListener('click',(e)=>{
      // Don't navigate if quick-view button is clicked
      if(e.target.closest('.quick-view')) return;
      // Don't navigate if it was the product frame (already handled above)
      if(e.target.closest('.product-frame')) return;
      e.stopPropagation();
      const productId=card.getAttribute('data-product-id');
      if(productId){
        window.location.href=`product-detail.html?product=${productId}`;
      }
    });
  });
  
  // Trending modal close button
  const trendingCloseBtn=document.getElementById('trendingCloseModal');
  if(trendingCloseBtn){
    trendingCloseBtn.addEventListener('click',()=>{
      const trendingModal=document.getElementById('trendingQuickViewModal');
      if(trendingModal){
        trendingModal.classList.remove('active');
      }
    });
  }
  
  // Trending modal prev/next buttons
  const trendingModalPrev=document.querySelector('#trendingQuickViewModal .modal-prev');
  const trendingModalNext=document.querySelector('#trendingQuickViewModal .modal-next');
  const trendingModalImgEl=document.getElementById('trendingModalProductImage');
  
  if(trendingModalPrev){
    trendingModalPrev.addEventListener('click',()=>{
      const images=window.trendingModalImages||[];
      if(!images.length) return;
      const index=(window.trendingModalIndex||0);
      window.trendingModalIndex=(index-1+images.length)%images.length;
      if(trendingModalImgEl) fadeToImage(trendingModalImgEl, images[window.trendingModalIndex]);
    });
  }
  
  if(trendingModalNext){
    trendingModalNext.addEventListener('click',()=>{
      const images=window.trendingModalImages||[];
      if(!images.length) return;
      const index=(window.trendingModalIndex||0);
      window.trendingModalIndex=(index+1)%images.length;
      if(trendingModalImgEl) fadeToImage(trendingModalImgEl, images[window.trendingModalIndex]);
    });
  }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    e.preventDefault();
    const target=document.querySelector(this.getAttribute('href'));
    if(target){
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Product Showcase 3D Interaction
function initShowcase3D(){
  const showcase=document.querySelector('.product-showcase-section');
  const camera=document.querySelector('.camera-body');
  
  if(!showcase||!camera) return;
  
  document.addEventListener('mousemove',(e)=>{
    if(!isElementInViewport(showcase)) return;
    
    const rect=showcase.getBoundingClientRect();
    const mouseX=(e.clientX-rect.left)/rect.width;
    const mouseY=(e.clientY-rect.top)/rect.height;
    
    const rotX=(mouseY-0.5)*20;
    const rotY=(mouseX-0.5)*25;
    
    camera.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  
  document.addEventListener('mouseleave',()=>{
    camera.style.transform='rotateX(0deg) rotateY(0deg)';
  });
}

function isElementInViewport(el){
  const rect=el.getBoundingClientRect();
  return (rect.top<=window.innerHeight&&rect.bottom>=0);
}

document.addEventListener('DOMContentLoaded',()=>{
  initShowcase3D();
});


// Product Detail Page Loading
document.addEventListener('DOMContentLoaded',()=>{
  const isProductDetailPage = !!document.querySelector('.product-detail-page');
  
  if(isProductDetailPage){
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || urlParams.get('id') || 'ethereal-light';
    const product = PRODUCTS[productId];

    const statusEl = document.getElementById('productStatus');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    // Reflects SOLD_PRODUCT_IDS onto the status badge, Add to Cart, and Buy Now
    // buttons. Called once on load and again once the live sold list has loaded.
    function refreshSoldState(){
      const sold = !!product && SOLD_PRODUCT_IDS.includes(productId);
      if(statusEl){
        statusEl.textContent = sold ? 'Sold' : (product ? 'Available' : '');
        statusEl.classList.toggle('sold', sold);
      }
      if(addToCartBtn){
        addToCartBtn.disabled = sold;
        addToCartBtn.textContent = sold ? 'Sold Out' : 'Add to Cart';
      }
      if(buyNowBtn){
        buyNowBtn.disabled = sold;
      }
    }

    function buildCartItem(){
      const qtyInput = document.getElementById('qtyInput');
      const qty = parseInt(qtyInput?.value || 1);

      return {
        id: productId,
        productKey: productId,
        title: product.title,
        artist: product.artist,
        price: formatPrice(product.price),
        image: product.image,
        qty: qty,
        size: product.size,
        frame: product.frame
      };
    }

    if(product){
      document.getElementById('productTitle').textContent = product.title;
      document.getElementById('productTitleAbout').textContent = product.title + ' by ' + product.artist;
      document.getElementById('productArtist').textContent = 'by ' + product.artist;
      document.getElementById('productPrice').textContent = formatPrice(product.price);
      document.getElementById('productImage').src = product.image;
      document.getElementById('productDescription').textContent = product.description;
      document.getElementById('productMedium').textContent = product.medium;
      document.getElementById('productSize').textContent = product.size;
      document.title = product.title + ' - SAMANTHA';

      // Optional "Further Reading and Information" + "References" sections - only a
      // handful of exhibition pieces have researched background info for these, so the
      // "Read more" link and the panel it reveals stay hidden when a product has neither.
      const readMoreLink = document.getElementById('readMoreLink');
      const productExtra = document.getElementById('productExtra');
      const furtherReadingBlock = document.getElementById('furtherReadingBlock');
      const furtherReadingList = document.getElementById('productFurtherReading');
      const referencesBlock = document.getElementById('referencesBlock');
      const referencesList = document.getElementById('productReferences');

      const hasFurtherReading = Array.isArray(product.furtherReading) && product.furtherReading.length > 0;
      const hasReferences = Array.isArray(product.references) && product.references.length > 0;

      if(hasFurtherReading && furtherReadingList){
        furtherReadingList.innerHTML = product.furtherReading.map(item => {
          const label = (item && item.text) ? item.text : item;
          const url = item && item.url;
          return url
            ? `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`
            : `<li>${label}</li>`;
        }).join('');
        furtherReadingBlock.hidden = false;
      }

      if(hasReferences && referencesList){
        referencesList.innerHTML = product.references.map(ref => {
          const label = (ref && ref.text) ? ref.text : ref;
          const url = ref && ref.url;
          return url
            ? `<li>${label} Available from: <a href="${url}" target="_blank" rel="noopener">${url}</a></li>`
            : `<li>${label}</li>`;
        }).join('');
        referencesBlock.hidden = false;
      }

      if(readMoreLink && (hasFurtherReading || hasReferences)){
        readMoreLink.hidden = false;
        readMoreLink.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = !productExtra.hidden;
          productExtra.hidden = isOpen;
          readMoreLink.textContent = isOpen ? 'Read more' : 'Read less';
        });
      }
    }

    refreshSoldState();
    document.addEventListener('sold-products-updated', refreshSoldState);

    // Quantity controls
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyInput = document.getElementById('qtyInput');
    
    if(qtyPlus){
      qtyPlus.addEventListener('click',()=>{
        qtyInput.value = parseInt(qtyInput.value || 1) + 1;
      });
    }
    
    if(qtyMinus){
      qtyMinus.addEventListener('click',()=>{
        if(parseInt(qtyInput.value || 1) > 1){
          qtyInput.value = parseInt(qtyInput.value) - 1;
        }
      });
    }
    
    // Add to cart
    if(addToCartBtn){
      addToCartBtn.addEventListener('click',()=>{
        if(SOLD_PRODUCT_IDS.includes(productId)) return;
        addToCart(buildCartItem());
      });
    }

    // Buy Now - checkout with just this item, without touching the persistent cart
    // (previously called addToCart(), so checkout showed this item mixed in with
    // whatever else was already sitting in the cart)
    if(buyNowBtn){
      buyNowBtn.addEventListener('click',()=>{
        if(SOLD_PRODUCT_IDS.includes(productId)) return;
        sessionStorage.setItem('buyNowItem', JSON.stringify(buildCartItem()));
        window.location.href = 'checkout.html';
      });
    }
    
    // Image gallery navigation (placeholder - single image for now)
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    const productImgEl = document.getElementById('productImage');
    let productGalleryImages = [];
    let productGalleryIndex = 0;
    if(product){
      productGalleryImages = (Array.isArray(product.images) && product.images.length) ? product.images.slice() : [product.image, 'Picture2.jpg', 'Picture2.jpg'];
      productGalleryIndex = 0;
      if(productImgEl) fadeToImage(productImgEl, productGalleryImages[productGalleryIndex]);
    }

    if(prevBtn){
      prevBtn.addEventListener('click',()=>{
        if(!productGalleryImages.length) return;
        productGalleryIndex = (productGalleryIndex - 1 + productGalleryImages.length) % productGalleryImages.length;
        if(productImgEl) fadeToImage(productImgEl, productGalleryImages[productGalleryIndex]);
      });
    }

    if(nextBtn){
      nextBtn.addEventListener('click',()=>{
        if(!productGalleryImages.length) return;
        productGalleryIndex = (productGalleryIndex + 1) % productGalleryImages.length;
        if(productImgEl) fadeToImage(productImgEl, productGalleryImages[productGalleryIndex]);
      });
    }
  }
});

function drawRealisticCloud(cloud){}

// Quick View Modal Functionality (homepage carousels + shop grid quick-view popups).
// Must not run on product-detail.html: it looks up #addToCartBtn globally, which on
// that page is the real Add to Cart button - binding this handler there added a
// second, stale click listener that always added "Rodeo" (currentProductKey's unused
// default) alongside whatever painting was actually being purchased.
document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('.product-detail-page')) return;
  const isShopPage = !!document.querySelector('.shop-page');
  const modal = isShopPage ? null : document.getElementById('quickViewModal');
  const closeBtn = isShopPage ? null : document.getElementById('closeModal');
  // Only select quick-view buttons that are NOT in featured or trending carousels
  let quickViewButtons = isShopPage ? [] : document.querySelectorAll('.quick-view button');
  quickViewButtons = Array.from(quickViewButtons).filter(btn => !btn.closest('.featured-carousel') && !btn.closest('.trending-carousel'));
  const addToCartBtn = isShopPage ? null : document.getElementById('addToCartBtn');

  let currentProductKey=null;
  // Modal gallery state
  let modalGalleryImages = [];
  let modalGalleryIndex = 0;
  const modalImgEl = document.getElementById('modalProductImage');

  function openModal(){
    if(modal){
      modal.classList.add('active');
    }
  }

  function closeModal(){
    if(modal){
      modal.classList.remove('active');
    }
  }

  function updateModalContent(productKey){
    const product=productData[productKey];
    if(!product) return;
    // initialize gallery for modal
    modalGalleryImages = (Array.isArray(product.images) && product.images.length) ? product.images.slice() : [product.image];
    modalGalleryIndex = 0;
    if(modalImgEl) fadeToImage(modalImgEl, modalGalleryImages[modalGalleryIndex]);
    document.getElementById('modalArtistName').textContent=product.artist;
    document.getElementById('modalProductTitle').textContent=product.title;
    document.getElementById('modalPrice').textContent=product.price;
    document.getElementById('modalDescription').textContent=product.description;
  }

  // Setup quick view buttons
  quickViewButtons.forEach((btn, idx)=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const productCard=btn.closest('.product-card');
      if(!productCard) return;
      
      const title=productCard.querySelector('.product-title')?.textContent||'Rodeo';
      const productKey=Object.keys(productData).find(key=>productData[key].title===title)||'rodeo';
      currentProductKey=productKey;
      
      updateModalContent(productKey);
      openModal();
    });
  });

  // Modal prev/next handlers (cycle through modalGalleryImages or currentModalImages)
  const modalPrev = document.querySelector('#quickViewModal .modal-prev');
  const modalNext = document.querySelector('#quickViewModal .modal-next');
  if(modalPrev){
    modalPrev.addEventListener('click',()=>{
      const images=window.currentModalImages||modalGalleryImages;
      if(!images.length) return;
      const index=window.currentModalIndex||0;
      window.currentModalIndex = (index - 1 + images.length) % images.length;
      if(modalImgEl) fadeToImage(modalImgEl, images[window.currentModalIndex]);
    });
  }
  if(modalNext){
    modalNext.addEventListener('click',()=>{
      const images=window.currentModalImages||modalGalleryImages;
      if(!images.length) return;
      const index=window.currentModalIndex||0;
      window.currentModalIndex = (index + 1) % images.length;
      if(modalImgEl) fadeToImage(modalImgEl, images[window.currentModalIndex]);
    });
  }

  // Close button
  if(closeBtn){
    closeBtn.addEventListener('click',closeModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&modal?.classList.contains('active')){
      closeModal();
    }
  });

  // Quantity controls
  const qtyPlus=document.getElementById('qtyPlus');
  const qtyMinus=document.getElementById('qtyMinus');
  const qtyInput=document.getElementById('qtyInput');

  if(qtyPlus){
    qtyPlus.addEventListener('click',()=>{
      if(qtyInput) qtyInput.value=parseInt(qtyInput.value||1)+1;
    });
  }

  if(qtyMinus){
    qtyMinus.addEventListener('click',()=>{
      if(qtyInput&&parseInt(qtyInput.value||1)>1){
        qtyInput.value=parseInt(qtyInput.value)-1;
      }
    });
  }

  // Add to cart
  if(addToCartBtn){
    addToCartBtn.addEventListener('click',()=>{
      const productId=window.currentFeaturedProductId;
      const product=productId?PRODUCTS[productId]:null;
      if(!product) return;

      const qty=parseInt(qtyInput?.value||1);
      const size=document.getElementById('sizeSelect')?.value||'20cm x 30cm';
      const frame=document.getElementById('frameSelect')?.value||'Black';

      const cartItem={
        id:productId,
        productKey:productId,
        title:product.title,
        artist:product.artist,
        price:formatPrice(product.price),
        image:product.image,
        qty:qty,
        size:size,
        frame:frame
      };

      addToCart(cartItem);
      closeModal();
    });
  }

  // If this is the collection/shop page, enable inline quick view expansion instead of relying on modal elements
  if(document.querySelector('.shop-page')){
    setupInlineQuickViewForCollection();
    
    // Add click handler for product cards to navigate to detail page
    const shopProductCards = document.querySelectorAll('.shop-page .product-card');
    shopProductCards.forEach((card)=>{
      const frame = card.querySelector('.product-frame');
      if(frame){
        frame.style.cursor = 'pointer';
        frame.addEventListener('click',(e)=>{
          // Don't navigate if quick view button was clicked
          if(e.target.closest('.quick-view button')){
            return;
          }
          
          const productId = card.getAttribute('data-product-id');
          if(productId){
            window.location.href = `product-detail.html?id=${productId}`;
          }
        });
      }
    });
  }

  // Inline Quick View for Shop/Collection page
  function setupInlineQuickViewForCollection(){
    const grid=document.querySelector('.products-grid');
    if(!grid) return;

    let openPanel=null;

    function closeOpenPanel(){
      if(openPanel && openPanel.parentNode) openPanel.parentNode.removeChild(openPanel);
      openPanel=null;
    }

    grid.addEventListener('click', (e)=>{
      const btn = e.target.closest('.quick-view button');
      if(!btn) return; // not a quick view click
      e.preventDefault();

      const card = btn.closest('.product-card');
      if(!card) return;

      // If panel already open for this card, close it
      if(openPanel && openPanel.previousElementSibling===card){
        closeOpenPanel();
        return;
      }

      // Close any other open panel
      closeOpenPanel();

      // Build inline panel
      const title = card.querySelector('.product-title')?.textContent?.trim()||'Item';
      const artist = card.querySelector('.artist-name')?.textContent?.trim()||'';
      const priceText = card.querySelector('.product-price')?.textContent?.replace('From ','').trim()||'£0.00';
      const imgSrc = card.querySelector('img')?.src||'';

      const panel = document.createElement('div');
      // Use the existing modal classes so the inline panel matches the home-page modal design
      panel.className='modal-overlay active';
      panel.innerHTML = `
        <div class="quick-view-modal">
          <button class="modal-close panel-close-x" aria-label="Close">&times;</button>
          <div class="modal-image-section">
            <img class="modal-product-image" src="${imgSrc}" alt="${title}">
            <div class="modal-nav-buttons">
              <button class="modal-nav-btn modal-prev">‹</button>
              <button class="modal-nav-btn modal-next">›</button>
            </div>
          </div>
          <div class="modal-info-section">
            <p class="modal-artist-name">${artist}</p>
            <h3 class="modal-product-title">${title}</h3>
            <p class="modal-price">${priceText}</p>
            <div class="modal-options">
              <div class="option-group">
                <label>Size</label>
                <select class="option-select iv-size"><option>20cm x 30cm</option><option>30cm x 40cm</option><option>40cm x 60cm</option></select>
              </div>
              <div class="option-group">
                <label>Frame</label>
                <select class="option-select iv-frame"><option>Black</option><option>White</option><option>Gold</option></select>
              </div>
            </div>
            <div class="modal-quantity">
              <button class="qty-btn iv-qty-minus">−</button>
              <input type="number" value="1" min="1" class="qty-input iv-qty-input">
              <button class="qty-btn iv-qty-plus">+</button>
            </div>
            <button class="modal-add-to-cart iv-add-to-cart">ADD TO CART</button>
            <p class="modal-description iv-desc">A short description appears here.</p>
          </div>
        </div>`;

      // Insert panel after the last card in the same visual row so it spans the full row
      const allCards = Array.from(grid.querySelectorAll('.product-card'));
      const cardTop = card.offsetTop;
      const sameRow = allCards.filter(c => Math.abs(c.offsetTop - cardTop) < 6);
      const lastInRow = sameRow.length ? sameRow[sameRow.length - 1] : card;
      lastInRow.parentNode.insertBefore(panel, lastInRow.nextSibling);
      // Make the panel span the full grid row
      panel.style.gridColumn = '1 / -1';
      panel.style.width = '100%';
      openPanel = panel;

      // Hook up controls
      const ivPlus = panel.querySelector('.iv-qty-plus');
      const ivMinus = panel.querySelector('.iv-qty-minus');
      const ivInput = panel.querySelector('.iv-qty-input');
      const ivAdd = panel.querySelector('.iv-add-to-cart');
      const ivClose = panel.querySelector('.panel-close-x');

      ivPlus?.addEventListener('click', ()=>{ ivInput.value = parseInt(ivInput.value||1)+1; });
      ivMinus?.addEventListener('click', ()=>{ if(parseInt(ivInput.value||1)>1) ivInput.value = parseInt(ivInput.value)-1; });
      ivClose?.addEventListener('click', ()=>{ closeOpenPanel(); });

      const cardProductId = card.getAttribute('data-product-id');

      ivAdd?.addEventListener('click', ()=>{
        const qty = parseInt(ivInput.value||1);
        const size = panel.querySelector('.iv-size')?.value||'20cm x 30cm';
        const frame = panel.querySelector('.iv-frame')?.value||'Black';
        const cartItem = { id: cardProductId, productKey: cardProductId, title: title, artist: artist, price: priceText, image: imgSrc, qty: qty, size: size, frame: frame };
        addToCart(cartItem);
        closeOpenPanel();
      });

      // Setup gallery for the inline panel (prev/next inside the panel)
      const panelPrev = panel.querySelector('.modal-prev');
      const panelNext = panel.querySelector('.modal-next');
      const panelImgEl = panel.querySelector('.modal-product-image');
      let panelGallery = [];
      let panelIndex = 0;
      const matchedProduct = cardProductId ? PRODUCTS[cardProductId] : null;
      if(matchedProduct){
        panelGallery = (Array.isArray(matchedProduct.images) && matchedProduct.images.length) ? matchedProduct.images.slice() : [matchedProduct.image];
      }else{
        panelGallery = [imgSrc, 'picture2.jpg', 'picture2.jpg'];
      }
      panelIndex = 0;
      if(panelImgEl) fadeToImage(panelImgEl, panelGallery[panelIndex]);

      panelPrev?.addEventListener('click', ()=>{
        if(!panelGallery.length) return;
        panelIndex = (panelIndex - 1 + panelGallery.length) % panelGallery.length;
        if(panelImgEl) fadeToImage(panelImgEl, panelGallery[panelIndex]);
      });

      panelNext?.addEventListener('click', ()=>{
        if(!panelGallery.length) return;
        panelIndex = (panelIndex + 1) % panelGallery.length;
        if(panelImgEl) fadeToImage(panelImgEl, panelGallery[panelIndex]);
      });
    });

    // Card-click-to-detail-page navigation is handled by the shopProductCards
    // handler registered above (uses each card's own data-product-id directly).
  }

  // Commission Form Functionality - Removed, now uses separate page
});

// Cart Management System

// Only index.html has the #cartModal markup written out by hand; every other page
// (product-detail.html, shop-collection.html, ...) has a cart icon but no drawer
// behind it, so opening the cart there previously did nothing. Inject the same
// markup on demand so the cart modal exists everywhere script.js runs.
function ensureCartModal(){
  if(document.getElementById('cartModal')) return;
  const wrapper=document.createElement('div');
  wrapper.innerHTML=`
    <div id="cartModal" class="cart-modal">
      <button id="closeCartBtn" class="close-cart-btn">✕</button>
      <div class="cart-container">
        <div class="cart-left">
          <h1>Shopping Cart</h1>
          <div class="cart-table-header">
            <div class="col-product">Product</div>
            <div class="col-price">Price</div>
            <div class="col-quantity">Quantity</div>
            <div class="col-total">Total</div>
          </div>
          <div id="cartItems" class="cart-items">
            <p class="empty-cart">Your cart is empty</p>
          </div>
        </div>
        <div class="cart-right">
          <p class="free-shipping">Congratulations! Your order qualified for free shipping</p>
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span id="cartTotal">£0.00</span>
            </div>
            <p class="summary-note">Excluding taxes and shipping</p>
          </div>
          <div class="order-notes">
            <label>Order Notes</label>
            <textarea id="orderNotes" placeholder="Add any special instructions or notes here..."></textarea>
          </div>
          <label class="terms-checkbox">
            <input type="checkbox" id="termsCheck">
            <span>I agree with the terms and conditions</span>
          </label>
          <button class="checkout-btn">CHECKOUT</button>
          <button class="continue-shopping-btn">CONTINUE SHOPPING</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(wrapper.firstElementChild);
}
ensureCartModal();

function openCart(){
  ensureCartModal();
  const cartModal=document.getElementById('cartModal');
  if(!cartModal) return;
  updateCartDisplay();
  cartModal.classList.add('active');
  document.body.style.overflow='hidden';
}

let cart=loadCart();
updateCartBadge();

function loadCart(){
  const savedCart=localStorage.getItem('cart');
  return savedCart?JSON.parse(savedCart):[];
}

function saveCart(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

function addToCart(item){
  const existingItem=cart.find(c=>c.id===item.id&&c.size===item.size&&c.frame===item.frame);

  if(existingItem){
    existingItem.qty+=item.qty;
  }else{
    cart.push(item);
  }

  saveCart();
  updateCartBadge(true);
  openCart();
}

function removeFromCart(id){
  cart=cart.filter(item=>item.id!==id);
  saveCart();
  updateCartDisplay();
  updateCartBadge();
}

function increaseQty(id){
  const item=cart.find(item=>item.id===id);
  if(item){
    item.qty+=1;
    saveCart();
    updateCartDisplay();
    updateCartBadge();
  }
}

function decreaseQty(id){
  const item=cart.find(item=>item.id===id);
  if(item&&item.qty>1){
    item.qty-=1;
    saveCart();
    updateCartDisplay();
    updateCartBadge();
  }
}

// Cart badge: shows the number of distinct products in the cart on the header cart icon, on every page.
function updateCartBadge(shouldPop){
  const count=cart.length;
  const label=count>0?`Cart, ${count} product${count===1?'':'s'}`:'Cart';

  document.querySelectorAll('.cart-badge').forEach(badge=>{
    badge.textContent=count>99?'99+':String(count);
    badge.classList.toggle('visible',count>0);
    if(shouldPop&&count>0){
      badge.classList.remove('pop');
      void badge.offsetWidth; // restart animation
      badge.classList.add('pop');
    }
  });

  document.querySelectorAll('.cart-icon-btn').forEach(btn=>{
    btn.setAttribute('aria-label',label);
  });
}

function updateCartDisplay(){
  const cartModal=document.getElementById('cartModal');
  const cartItemsContainer=document.getElementById('cartItems');
  const cartTotal=document.getElementById('cartTotal');
  
  if(cart.length===0){
    cartItemsContainer.innerHTML='<p class="empty-cart">Your cart is empty</p>';
    cartTotal.textContent='£0.00';
  }else{
    cartItemsContainer.innerHTML=cart.map((item,index)=>`
      <div class="cart-item">
        <div class="cart-item-product">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-specs">${item.size} / ${item.frame}</div>
            <a class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</a>
          </div>
        </div>
        <div class="cart-item-price">${item.price}</div>
        <div class="cart-item-qty">
          <button onclick="decreaseQty('${item.id}')">−</button>
          <input type="number" value="${item.qty}" min="1" readonly>
          <button onclick="increaseQty('${item.id}')">+</button>
        </div>
        <div class="cart-item-total">${item.price}</div>
      </div>
    `).join('');
    
    // Calculate total price
    let total=0;
    cart.forEach(item=>{
      const price=parseFloat(item.price.replace(/[^0-9.]/g, ''));
      total+=price*item.qty;
    });
    cartTotal.textContent='£'+total.toFixed(2);
  }
}

// Cart Button Event Listeners
document.addEventListener('DOMContentLoaded',()=>{
  const cartBtn=document.querySelector('.cart-icon-btn');
  const cartModal=document.getElementById('cartModal');
  const closeCartBtn=document.getElementById('closeCartBtn');
  const checkoutBtn=document.querySelector('.checkout-btn');
  const continueShoppingBtn=document.querySelector('.continue-shopping-btn');
  
  if(cartBtn){
    cartBtn.addEventListener('click',()=>{
      cartModal.classList.add('active');
      updateCartDisplay();
      document.body.style.overflow='hidden';
    });
  }
  
  if(closeCartBtn){
    closeCartBtn.addEventListener('click',()=>{
      cartModal.classList.remove('active');
      document.body.style.overflow='auto';
    });
  }
  
  if(continueShoppingBtn){
    continueShoppingBtn.addEventListener('click',()=>{
      cartModal.classList.remove('active');
      document.body.style.overflow='auto';
    });
  }
  
  if(checkoutBtn){
    checkoutBtn.addEventListener('click',()=>{
      if(cart.length>0){
        // Going through the normal cart, not Buy Now - drop any leftover single-item
        // buy-now selection so checkout shows the full cart, not a stale one-off item.
        sessionStorage.removeItem('buyNowItem');
        window.location.href='checkout.html';
      }else{
        alert('Your cart is empty!');
      }
    });
  }
  
  // Close cart when pressing Escape
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&cartModal?.classList.contains('active')){
      cartModal.classList.remove('active');
      document.body.style.overflow='auto';
    }
  });
});

// Stripe integration removed – payment gateways disabled

// Initialize Stripe on checkout page
document.addEventListener('DOMContentLoaded', ()=>{
  const checkoutForm = document.getElementById('checkoutForm');
  if(checkoutForm){
    // Buy Now stashes a single item here instead of adding it to the persistent
    // cart, so checkout can show just that item without merging in whatever else
    // is already sitting in the cart.
    let isBuyNow = false;
    let checkoutItems = loadCart();
    const buyNowRaw = sessionStorage.getItem('buyNowItem');
    if(buyNowRaw){
      try {
        checkoutItems = [JSON.parse(buyNowRaw)];
        isBuyNow = true;
      } catch(e){
        checkoutItems = loadCart();
      }
    }

    // load cart overview so order summary is populated
    loadCheckoutCart(checkoutItems);

    checkoutForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      // gather data from visible inputs/selects/textareas
      const formData = new FormData();
      document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea').forEach(el=>{
        const key = el.name || el.id;
        if(!key) return;
        formData.append(key, el.value);
      });
      // attach cart JSON - just the buy-now item, or the whole cart otherwise
      formData.append('cart', JSON.stringify(checkoutItems));

      try {
        const res = await fetch('/submit_order', {
          method: 'POST',
          body: formData
        });
        if(!res.ok){
          const txt = await res.text();
          throw new Error(txt || res.statusText);
        }
        showSuccess('Order placed successfully!');
        setTimeout(()=>{
          if(isBuyNow){
            sessionStorage.removeItem('buyNowItem');
          } else {
            cart = [];
            saveCart();
          }
          window.location.href = 'index.html';
        }, 2000);
      } catch(err){
        console.error('order submission failed', err);
        showError('Failed to send order: '+err.message);
      }
    });
  }
});

// State/province lists for countries that use them; other countries fall back to free text
const STATES_BY_COUNTRY = {
  US: {
    label: 'State*',
    placeholder: 'Select State',
    options: [
      ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
      ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
      ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
      ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
      ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
      ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
      ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
      ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],
      ['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],
      ['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],
      ['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
    ]
  },
  CA: {
    label: 'Province/Territory*',
    placeholder: 'Select Province',
    options: [
      ['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],
      ['NL','Newfoundland and Labrador'],['NS','Nova Scotia'],['NT','Northwest Territories'],
      ['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],
      ['SK','Saskatchewan'],['YT','Yukon']
    ]
  },
  AU: {
    label: 'State/Territory*',
    placeholder: 'Select State',
    options: [
      ['ACT','Australian Capital Territory'],['NSW','New South Wales'],['NT','Northern Territory'],
      ['QLD','Queensland'],['SA','South Australia'],['TAS','Tasmania'],['VIC','Victoria'],['WA','Western Australia']
    ]
  }
};

// Rebuild the State field to match the selected country: a dropdown for countries
// with known states/provinces, otherwise a free-text field (previously it was
// always the US states list, so e.g. selecting Germany still showed Alabama..Wyoming)
function renderStateField(countryCode){
  const current = document.getElementById('state');
  if(!current) return;
  const group = current.closest('.form-group');
  const labelEl = group ? group.querySelector('.form-label') : null;
  const data = STATES_BY_COUNTRY[countryCode];
  const previousValue = current.value;
  let el;

  if(data){
    el = document.createElement('select');
    el.className = 'form-select';
    el.innerHTML = '<option value="">' + data.placeholder + '</option>' +
      data.options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
    if(labelEl) labelEl.textContent = data.label;
  } else {
    el = document.createElement('input');
    el.type = 'text';
    el.className = 'form-input';
    el.placeholder = 'State / Province / Region';
    if(labelEl) labelEl.textContent = 'State/Province/Region*';
  }

  el.id = 'state';
  el.required = true;
  current.replaceWith(el);

  // keep a manually-typed value when switching between two free-text countries
  if(!data && previousValue){
    el.value = previousValue;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const countryEl = document.getElementById('country');
  if(!countryEl) return;
  renderStateField(countryEl.value);
  countryEl.addEventListener('change', ()=> renderStateField(countryEl.value));
});

// Render the checkout order summary. `items` is the buy-now single item or the
// full cart (see the checkout DOMContentLoaded handler above); falls back to
// the persisted cart if called without one.
function loadCheckoutCart(items){
  const orderItems = document.getElementById('orderItems');
  if(!orderItems) return;

  const checkoutItems = items || loadCart();

  if(checkoutItems.length === 0){
    orderItems.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Your cart is empty</p>';
    return;
  }

  orderItems.innerHTML = '';
  checkoutItems.forEach(item=>{
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    const itemTotal = (priceNum * item.qty).toFixed(2);

    itemElement.innerHTML = `
      <div class="item-details">
        <div class="item-title">${item.title}</div>
        <div class="item-meta">${item.size} • ${item.frame}</div>
      </div>
      <div class="item-price">£${itemTotal}</div>
    `;
    orderItems.appendChild(itemElement);
  });

  updateCheckoutTotals(checkoutItems);
}

// Update totals on checkout page
function updateCheckoutTotals(items){
  const checkoutItems = items || loadCart();
  const subtotal = checkoutItems.reduce((sum, item)=>{
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + (price * item.qty);
  }, 0);

  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `£${total.toFixed(2)}`;
}

// Calculate total amount for payment
function calculateTotal(){
  const subtotal = cart.reduce((sum, item)=>{
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + (price * item.qty);
  }, 0);
  
  const tax = subtotal * 0.1;
  return Math.round((subtotal + tax) * 100); // Return in cents for Stripe
}

// Show error message
function showError(message){
  const errorDiv = document.getElementById('errorMessage');
  if(errorDiv){
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(()=>{
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

// Show success message
function showSuccess(message){
  const successDiv = document.getElementById('successMessage');
  if(successDiv){
    successDiv.textContent = message;
    successDiv.style.display = 'block';
  }
}

// Show coming soon modal for express payment methods
function showComingSoonModal(paymentMethod){
  // Create modal if it doesn't exist
  let modal = document.getElementById('comingSoonModal');
  
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'comingSoonModal';
    modal.className = 'coming-soon-modal';
    modal.innerHTML = `
      <div class="coming-soon-content">
        <button class="modal-close-btn" id="closeComingSoonBtn">×</button>
        <div class="coming-soon-icon">🚀</div>
        <h2 id="comingSoonTitle">Coming Soon</h2>
        <p id="comingSoonDesc">This payment method will be available very soon!</p>
        <p style="color: var(--muted); font-size: 0.9rem; margin-top: 16px;">For now, please use credit/debit card payment.</p>
        <button id="comingSoonOkBtn" class="coming-soon-btn">Use Card Payment Instead</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('closeComingSoonBtn').addEventListener('click', ()=>{
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
    
    document.getElementById('comingSoonOkBtn').addEventListener('click', ()=>{
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      document.querySelector('input[value="card"]').checked = true;
      document.getElementById('creditCardSection').style.display = 'block';
    });
  }
  
  // Update modal content
  document.getElementById('comingSoonTitle').textContent = `${paymentMethod} - Coming Soon`;
  document.getElementById('comingSoonDesc').textContent = `${paymentMethod} integration is being developed. We'll have it ready for you very soon!`;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Get billing details from form
function getBillingDetails(){
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const zip = document.getElementById('zip').value.trim();
  const country = document.getElementById('country').value.trim();
  
  // Validate required fields
  const missingFields = [];
  if (!firstName) missingFields.push('First Name');
  if (!lastName) missingFields.push('Last Name');
  if (!emailOrPhone) missingFields.push('Email or Phone');
  if (!address) missingFields.push('Street Address');
  if (!city) missingFields.push('City');
  if (!state) missingFields.push('State');
  if (!zip) missingFields.push('Postal Code');
  if (!country) missingFields.push('Country');
  
  if (missingFields.length > 0) {
    throw new Error('Missing required fields: ' + missingFields.join(', '));
  }
  
  return {
    name: firstName + ' ' + lastName,
    email: emailOrPhone,
    phone: phone || emailOrPhone,
    address: {
      line1: address,
      line2: document.getElementById('apartment')?.value?.trim() || '',
      city: city,
      state: state,
      postal_code: zip,
      country: country
    }
  };
}

// Process card payment (disabled)
async function processCardPayment(checkoutForm){
  console.warn('processCardPayment called but payment gateways have been removed');
}


// Process PayPal payment (disabled)
async function initiatePayPalPayment(){
  console.warn('initiatePayPalPayment called but payment gateways have been removed');
}


// Process Google Pay payment (disabled)
async function initiateGooglePay(){
  console.warn('initiateGooglePay called but payment gateways have been removed');
}

// Hero / Quote / Artistcloud combined section - scroll-scrubbed crossfades
// The section is pinned (position: sticky) for its scroll range. The first
// CROSSFADE_FRACTION of that range smoothly crossfades video -> quote ->
// artistcloud, with opacity computed directly from scroll position every
// frame (not a hard cut eased by a CSS transition, which would stutter and
// restart mid-fade on fast/continuous scrolling). The remaining range is a
// hold: the artistcloud frame stays frozen in place while "Inside The
// Studio" (a normal, later, opaque section) scrolls up over it and covers
// it — the same pinned-stack effect used by sites like Stripe/Apple/LTX.
function initializeArtistcloudAnimation(){
  const section = document.getElementById('heroFadeSection');
  const videoLayer = document.getElementById('videoLayer');
  const quoteLayer = document.getElementById('quoteLayer');
  const cloudLayer = document.getElementById('cloudLayer');
  const header = document.querySelector('.site-header');
  const commissionSection = document.getElementById('commission-section');

  if(!section || !videoLayer || !quoteLayer || !cloudLayer) return;

  // Centers of the crossfade, and how wide (in progress units, 0-1) each
  // crossfade overlap is. A wider fadeWidth = a longer, gentler blend.
  const videoCutAt = 1 / 3;
  const quoteCutAt = 2 / 3;
  const fadeWidth = 0.22;

  function smoothstep(edge0, edge1, x){
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function update(){
    const scrollableHeight = section.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - section.offsetTop;
    let rawProgress = scrollableHeight > 0 ? scrolled / scrollableHeight : 0;
    rawProgress = Math.max(0, Math.min(1, rawProgress));

    // The hold-and-cover phase must last exactly one viewport-height of
    // scroll — that's how long it physically takes the studio section
    // (pulled up by margin-top:-100vh in CSS) to slide from just-below-the-
    // viewport to fully covering it. Derive the fraction dynamically so it
    // stays exact regardless of breakpoint/section height.
    const CROSSFADE_FRACTION = scrollableHeight > 0
      ? Math.max(0, 1 - window.innerHeight / scrollableHeight)
      : 1;

    // Remap the crossfade portion of the range to 0-1; once past it, stay
    // clamped at 1 (artistcloud fully visible) for the hold-and-cover phase.
    const progress = Math.min(1, rawProgress / CROSSFADE_FRACTION);

    const videoFadeOut = smoothstep(videoCutAt - fadeWidth / 2, videoCutAt + fadeWidth / 2, progress);
    const quoteFadeOut = smoothstep(quoteCutAt - fadeWidth / 2, quoteCutAt + fadeWidth / 2, progress);

    const videoOpacity = 1 - videoFadeOut;
    const quoteOpacity = videoFadeOut * (1 - quoteFadeOut);
    const cloudOpacity = quoteFadeOut;

    videoLayer.style.opacity = videoOpacity;
    videoLayer.style.pointerEvents = videoOpacity > 0.5 ? 'auto' : 'none';
    quoteLayer.style.opacity = quoteOpacity;
    quoteLayer.style.pointerEvents = quoteOpacity > 0.5 ? 'auto' : 'none';
    cloudLayer.style.opacity = cloudOpacity;
    cloudLayer.style.pointerEvents = cloudOpacity > 0.5 ? 'auto' : 'none';

    // Also hide the header while "Your Sky, Your Story" is rising up over
    // the frozen Trending section — same hold-and-cover hide as the hero.
    // Covers the whole span: from when the rise begins (one viewport before
    // commission's own top) through commission fully covering, until
    // testimonials begins (one viewport after commission's top).
    let hideForCommission = false;
    if(commissionSection){
      const hideStart = commissionSection.offsetTop - window.innerHeight;
      const hideEnd = commissionSection.offsetTop + window.innerHeight;
      hideForCommission = window.scrollY > hideStart && window.scrollY < hideEnd;
    }

    // Let the video show through with no tint/blur while it's the dominant layer.
    if(header){
      header.classList.toggle('over-video', videoOpacity > 0.5);

      // Stay hidden for the entire pinned hero journey, including the
      // artistcloud hold-and-cover phase; only appear once the section has
      // fully scrolled past, in sync with the .scrolled solid-header threshold.
      header.classList.toggle('header-hidden', rawProgress < 1 || hideForCommission);
    }
  }

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
}

// Footer Accordion Functionality for Mobile
function initializeFooterAccordion(){
  // Only enable on mobile (max-width: 640px)
  if(window.innerWidth > 640) return;
  
  const footerCols = document.querySelectorAll('.footer-col:not(.footer-brand-right)');
  
  footerCols.forEach(col => {
    const heading = col.querySelector('h4');
    const list = col.querySelector('ul');
    
    if(heading && list){
      // Add click handler to toggle
      heading.addEventListener('click', () => {
        col.classList.toggle('active');
      });
    }
  });
  
  // Re-initialize on window resize
  window.addEventListener('resize', () => {
    if(window.innerWidth <= 640){
      footerCols.forEach(col => {
        const heading = col.querySelector('h4');
        if(heading && !heading.dataset.initialized){
          heading.addEventListener('click', () => {
            col.classList.toggle('active');
          });
          heading.dataset.initialized = 'true';
        }
      });
    }
  });
}