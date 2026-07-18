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
  
  const featuredProductData={
    'ifoundit':{title:'I Found It (2022)',artist:'Samantha Ellis',price:'£769.00',image:'ihavefoundit.webp',images:['ihavefoundit.webp','ihavefoundit.webp','ihavefoundit.webp'],description:'Discover the essence of finding what matters most in this stunning piece.'},
    'bliss':{title:'Bliss (2019)',artist:'Samantha Ellis',price:'£769.00',image:'bliss.png',images:['bliss.png','Bliss (2019)_frame.png','Bliss (2019)_pre.png'],description:'A serene exploration of pure happiness and peaceful moments.'},
    'findmethemoon':{title:'Find Me the Moon (2022)',artist:'Samantha Ellis',price:'£330.00',image:'find me the moon (2022).webp',images:['find me the moon (2022).webp','find me the moon (2022)_frame.png','find me the moon (2022)_pre.png'],description:'A dreamy nocturnal piece celebrating celestial beauty.'},
    'fordad':{title:'For Dad (2021)',artist:'Samantha Ellis',price:'£769.00',image:'fordad.webp',images:['fordad.webp','for dad (2021)_frame.png','for dad (2021)_pre.png'],description:'A tribute to cherished moments and special bonds.'},
    'beyondwords':{title:'Beyond Words (2019)',artist:'Samantha Ellis',price:'£300.00',image:'beyond words (2019).webp',images:['beyond words (2019).webp','beyond words (2019)_frame.png','beyond words (2019)_pre.png'],description:'Expressive artwork that transcends verbal communication.'},
    'wehope':{title:'We Hope (2020)',artist:'Samantha Ellis',price:'£260.00',image:'we can only hope.png',images:['we can only hope.png','we can only hope (2019)_pre.png','we can only hope (2019)_pre.png'],description:'An inspiring piece celebrating hope and possibilities.'},
    'candyclouds':{title:'Candy Floss Clouds (2019)',artist:'Samantha Ellis',price:'£380.00',image:'candy floss clouds (2019).webp',images:['candy floss clouds (2019).webp','candy floss clouds (2019)_frame.png','candy floss clouds (2019)_pre.png'],description:'Whimsical clouds rendered in delightful colors.'}
  };
  
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
      const product=productId?featuredProductData[productId]:null;
      
      if(product && modal){
        // Update modal content
        const modalGalleryImages=product.images||[product.image];
        const modalImgEl=document.getElementById('modalProductImage');
        
        if(modalImgEl) modalImgEl.src=modalGalleryImages[0];
        document.getElementById('modalArtistName').textContent=product.artist;
        document.getElementById('modalProductTitle').textContent=product.title;
        document.getElementById('modalPrice').textContent=product.price;
        document.getElementById('modalDescription').textContent=product.description;
        
        // Store modal gallery data on window for nav buttons to use
        window.featuredModalImages=modalGalleryImages;
        window.featuredModalIndex=0;
        
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
  
  const trendingProductData={
    'ifoundit':{title:'I Found It (2022)',artist:'Samantha Ellis',price:'£769.00',image:'ihavefoundit.webp',images:['ihavefoundit.webp','picture2.jpg','picture2.jpg'],description:'Discover the essence of finding what matters most in this stunning piece.'},
    'bliss':{title:'Bliss (2019)',artist:'Samantha Ellis',price:'£769.00',image:'bliss.png',images:['bliss.png','bliss (2019)_frame.png','bliss (2019)_pre.png'],description:'A serene exploration of pure happiness and peaceful moments.'},
    'findmethemoon':{title:'Find Me the Moon (2022)',artist:'Samantha Ellis',price:'£330.00',image:'find me the moon (2022).webp',images:['find me the moon (2022).webp','find me the moon (2022)_frame.png','find me the moon (2022)_pre.png'],description:'A dreamy nocturnal piece celebrating celestial beauty.'},
    'fordad':{title:'For Dad (2021)',artist:'Samantha Ellis',price:'£769.00',image:'fordad.webp',images:['fordad.webp','for dad (2021)_frame.png','for dad (2021)_pre.png'],description:'A tribute to cherished moments and special bonds.'},
    'beyondwords':{title:'Beyond Words (2019)',artist:'Samantha Ellis',price:'£300.00',image:'beyond words (2019).webp',images:['beyond words (2019).webp','beyond words (2019)_frame.png','beyond words (2019)_pre.png'],description:'Expressive artwork that transcends verbal communication.'},
    'wehope':{title:'We Hope (2020)',artist:'Samantha Ellis',price:'£260.00',image:'we can only hope.png',images:['we can only hope.png','we can only hope (2019)_pre.png','we can only hope (2019)_pre.png'],description:'An inspiring piece celebrating hope and possibilities.'},
    'candyclouds':{title:'Candy Floss Clouds (2019)',artist:'Samantha Ellis',price:'£380.00',image:'candy floss clouds (2019).webp',images:['candy floss clouds (2019).webp','candy floss clouds (2019)_frame.png','candy floss clouds (2019)_pre.png'],description:'Whimsical clouds rendered in delightful colors.'}
  };
  
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
      const product=productId?trendingProductData[productId]:null;
      
      if(product && modal){
        // Update modal content
        const modalGalleryImages=product.images||[product.image];
        const modalImgEl=document.getElementById('trendingModalProductImage');
        
        if(modalImgEl) modalImgEl.src=modalGalleryImages[0];
        document.getElementById('trendingModalArtistName').textContent=product.artist;
        document.getElementById('trendingModalProductTitle').textContent=product.title;
        document.getElementById('trendingModalPrice').textContent=product.price;
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
    const productDetailData={
      'ivefoundit':{title:"I've Found It (2022)",artist:'Samantha Ellis',price:'£769',image:'ihavefoundit.webp',images:['ihavefoundit.webp','ihavefoundit.webp','ihavefoundit.webp'],medium:'Oil on hand made Canvas',size:'100 × 100 cm',rating:'4.8',status:'Available',imageSize:'100x100',frameColor:'Black',description:"A striking representation of discovery and achievement. This piece captures a moment of realization with bold brushwork and vibrant color transitions that draw the viewer's eye to the central focal point."},
      'ifoundit':{title:'I Found It (2022)',artist:'Samantha Ellis',price:'£769',image:'ihavefoundit.webp',images:['ihavefoundit.webp','picture2.jpg','picture2.jpg'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.8',status:'Available',imageSize:'100x100',frameColor:'Black',description:'Discover the essence of finding what matters most in this stunning piece.'},
      'bliss':{title:'Bliss (2019)',artist:'Samantha Ellis',price:'£769',image:'bliss.png',images:['bliss.png','bliss (2019)_frame.png','bliss (2019)_pre.png'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.9',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A serene exploration of pure happiness and peaceful moments.'},
      'kourtney':{title:'Kourtney (2019)',artist:'Samantha Ellis',price:'£769',image:'kourtney.png',images:['kourtney.png','Kourtney (2019)_frame.png','Kourtney (2019)_pre.png'],medium:'Oil on hand made Canvas',size:'100 × 100 cm',rating:'4.7',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A vibrant portrait study that captures the essence of its subject with expressive brushwork and rich, dynamic colors that bring the figure to life.'},
      'fordad':{title:'For Dad (2021)',artist:'Samantha Ellis',price:'£769',image:'fordad.webp',images:['fordad.webp','for dad (2021)_frame.png','for dad (2021)_pre.png'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.8',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A tribute to cherished moments and special bonds.'},
      'ivefoundit-i':{title:"I've Found It I (2022)",artist:'Samantha Ellis',price:'£769',image:"i’ve found it i.webp",images:["i’ve found it i.webp","find me the moon i (2022) _frame.png","find me the moon i (2022)_pre.png"],medium:'Oil on Canvas',size:'120 × 100 cm',rating:'4.6',status:'Available',imageSize:'120x100',frameColor:'White',description:'A compelling variation on the discovery theme. This piece explores similar concepts through a different lens, with careful composition and thoughtful color choices.'},
      'european-championship':{title:'European Women\'s Championship (July 31st 2022)',artist:'Samantha Ellis',price:'£769',image:"european women’s championship.webp",images:["european women’s championship.webp","european women’s championship (july 31st 2022)_frame.png","european women’s championship (july 31st 2022)_pre.png"],medium:'Acrylic on Canvas',size:'100 × 100 cm',rating:'4.5',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A dynamic celebration of athletic achievement and female empowerment. The energetic brushwork and bold color palette convey movement and triumph.'},
      'illlookup':{title:"I'll Look Up Forever",artist:'Samantha Ellis',price:'£769',image:"i’ll look up forever.webp",images:["i’ll look up forever.webp","find me the moon i (2022) _frame.png","find me the moon i (2022)_pre.png"],medium:'Mixed Media on Canvas',size:'100 × 150 cm',rating:'4.7',status:'Available',imageSize:'100x150',frameColor:'Black',description:'An uplifting composition that speaks to hope and aspiration. The vertical composition draws the eye upward, creating a sense of reaching toward something meaningful.'},
      'wehope':{title:'We Hope (2020)',artist:'Samantha Ellis',price:'£260',image:'we can only hope.png',images:['we can only hope.png','we can only hope (2019)_frame.png','we can only hope (2019)_pre.png'],medium:'Oil on Canvas',size:'80 × 100 cm',rating:'4.6',status:'Available',imageSize:'80x100',frameColor:'White',description:'An inspiring piece celebrating hope and possibilities.'},
      'wecanhope':{title:'We Can Only Hope',artist:'Samantha Ellis',price:'£260',image:'we can only hope.png',images:['we can only hope.png','we can only hope (2019)_frame.png','we can only hope (2019)_pre.png'],medium:'Oil on Canvas',size:'80 × 100 cm',rating:'4.6',status:'Available',imageSize:'80x100',frameColor:'White',description:'A thoughtful meditation on optimism and possibility. The careful arrangement of forms and subtle color transitions create an atmosphere of quiet resilience.'},
      'kourtney-vertical':{title:'Kourtney (2019)',artist:'Samantha Ellis',price:'£769',image:'kourtney.png',images:['kourtney.png','picture2.jpg','picture2.jpg'],medium:'Watercolor on Paper',size:'80 × 120 cm',rating:'4.5',status:'Available',imageSize:'80x120',frameColor:'Black',description:'A portrait study rendered in luminous watercolor. The vertical orientation and fluid technique create an elegant and refined presentation.'},
      'beyond-words':{title:'Beyond Words (2019)',artist:'Samantha Ellis',price:'£300',image:'beyond words (2019).webp',images:['beyond words (2019).webp','beyond words (2019)_frame.png','beyond words (2019)_pre.png'],medium:'Mixed Media on Canvas',size:'100 × 120 cm',rating:'4.8',status:'Available',imageSize:'100x120',frameColor:'Black',description:'An abstract exploration that transcends literal representation. The layering of materials and techniques creates depth and visual interest that invites contemplation.'},
      'untitled-ii':{title:'Untitled II (2019)',artist:'Samantha Ellis',price:'£220',image:'untitled ii (2019).webp',images:['untitled ii (2019).webp','untitled ii (2019)_frame.png','untitled ii (2019)_pre.png'],medium:'Acrylic on Canvas',size:'80 × 120 cm',rating:'4.4',status:'Available',imageSize:'80x120',frameColor:'Black',description:'A minimalist composition that relies on form and color to convey meaning. The restrained palette allows the viewer to focus on the essential elements.'},
      'candyclouds':{title:'Candy Floss Clouds (2019)',artist:'Samantha Ellis',price:'£380',image:'candy floss clouds (2019).webp',images:['candy floss clouds (2019).webp','candy floss clouds (2019)_frame.png','candy floss clouds (2019)_pre.png'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.9',status:'Available',imageSize:'100x100',frameColor:'Black',description:'Whimsical clouds rendered in delightful colors.'},
      'candyfloss-clouds':{title:'Candy Floss Clouds (2019)',artist:'Samantha Ellis',price:'£380',image:'candy floss clouds (2019).webp',images:['candy floss clouds (2019).webp','picture2.jpg','picture2.jpg'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.9',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A dreamlike landscape capturing the ethereal beauty of the sky. The soft, pastel tones and flowing shapes create an atmosphere of wonder and beauty.'},
      'findmethemoon':{title:'Find Me the Moon (2022)',artist:'Samantha Ellis',price:'£330',image:'find me the moon (2022).webp',images:['find me the moon (2022).webp','find me the moon (2022)_frame.png','find me the moon (2022)_pre.png'],medium:'Oil on Canvas',size:'120 × 80 cm',rating:'4.7',status:'Available',imageSize:'120x80',frameColor:'Black',description:'A dreamy nocturnal piece celebrating celestial beauty.'},
      'findmethemoon-i':{title:'Find Me the Moon I (2022)',artist:'Samantha Ellis',price:'£340',image:'find me the moon i (2022).webp',images:['find me the moon i (2022).webp','find me the moon i (2022)_frame.png','find me the moon i (2022)_pre.png'],medium:'Oil on Canvas',size:'100 × 100 cm',rating:'4.8',status:'Available',imageSize:'100x100',frameColor:'Black',description:'A variation on the lunar theme with emphasis on romantic atmosphere. The composition and color harmony create an inviting and emotionally resonant work.'},
      'wellingborough':{title:'Wellingborough (2020)',artist:'Samantha Ellis',price:'£320',image:'wellingborough (2020).webp',images:['wellingborough (2020).webp','wellingborough (2020)_frame.png','wellingborough (2020)_pre.png'],medium:'Oil on Canvas',size:'120 × 90 cm',rating:'4.6',status:'Available',imageSize:'120x90',frameColor:'Black',description:'A landscape study inspired by the English countryside. The careful attention to light and atmosphere brings the scene to life with authenticity and charm.'},
      'hurricane-maria':{title:'Hurricane Maria (2020)',artist:'Samantha Ellis',price:'£400',image:'hurricane maria (2020).png',images:['hurricane maria (2020).png','hurricane maria (2020)_frame.png','hurricane maria (2020)_pre.png'],medium:'Oil on Canvas',size:'120 × 100 cm',rating:'4.9',status:'Available',imageSize:'120x100',frameColor:'Black',description:'A powerful and dynamic composition addressing themes of natural forces and resilience. The dramatic composition and intense colors convey movement and emotion.'},
      'hurricane-katrina':{title:'Hurricane Katrina (2020)',artist:'Samantha Ellis',price:'£360',image:'hurricane katrina (2020).webp',images:['hurricane katrina (2020).webp','hurricane katrina (2020)_frame.png','hurricane katrina (2020)_pre.png'],medium:'Mixed Media on Canvas',size:'100 × 120 cm',rating:'4.5',status:'Available',imageSize:'100x120',frameColor:'Black',description:'An impactful work exploring the aftermath and recovery from natural disaster. The composition reflects on themes of loss and renewal.'},
      'storm-andre':{title:'Storm André (2020)',artist:'Samantha Ellis',price:'£360',image:'storm andré (2020).png',images:['storm andré (2020).png','storm andré (2020)_frame.png','storm andré (2020)_pre.png'],medium:'Oil on Canvas',size:'100 × 120 cm',rating:'4.6',status:'Available',imageSize:'100x120',frameColor:'Black',description:'A dramatic depiction of atmospheric turbulence. The artist captures the raw power and beauty of nature\'s forces with commanding brushwork.'},
      'mount-lamington':{title:'Mount Lamington (2020)',artist:'Samantha Ellis',price:'£360',image:'mount lamington (2020).png',images:['mount lamington (2020).png','mount lamington (2020)_frame.png','mount lamington (2020)_pre.png'],medium:'Oil on Canvas',size:'120 × 100 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'A majestic landscape study of an iconic volcanic peak. The composition emphasizes the grandeur and geological significance of the mountain.'},
      'mount-sinabung':{title:'Mount Sinabung (2018)',artist:'Samantha Ellis',price:'£360',image:'mount sinabung (2018).png',images:['mount sinabung (2018).png','mount sinabung (2018)_frame.png','mount sinabung (2018)_pre.png'],medium:'Oil on Canvas',size:'100 × 120 cm',rating:'4.5',status:'Available',imageSize:'100x120',frameColor:'Black',description:'A contemplative rendering of an active volcano. The dynamic composition captures the tension between stillness and turbulent geological forces.'},
      'mount-st-helens':{title:'Mount St. Helens (2020)',artist:'Samantha Ellis',price:'£360',image:'mount st. helens (2020).webp',images:['mount st. helens (2020).webp','mount st. helens (2020)_frame.png','mount st. helens (2020)_pre.png'],medium:'Oil on Canvas',size:'120 × 90 cm',rating:'4.8',status:'Available',imageSize:'120x90',frameColor:'Black',description:'A historical landscape study of Mount St. Helens. The painting commemorates this significant natural landmark with reverence and artistic excellence.'},
      'great-smog-1952':{title:'The Great Smog of 1952 (2020)',artist:'Samantha Ellis',price:'£360',image:'the great smog of 1952 (2020).webp',images:['the great smog of 1952 (2020).webp','the great smog of 1952 (2020)_frame.png','the great smog of 1952 (2020)_pre.png'],medium:'Mixed Media on Canvas',size:'100 × 120 cm',rating:'4.6',status:'Available',imageSize:'100x120',frameColor:'Black',description:'A historically inspired work reflecting on the London smog event. The composition uses color and form to evoke the environmental and human impact of this tragedy.'},
      'australian-fires-2020':{title:'Australian Fires (2020)',artist:'Samantha Ellis',price:'£769',image:'australian fires (2020).webp',images:['australian fires (2020).webp','australian fires (2020)_frame.png','australian fires (2020)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Painted in response to the record-breaking fires of 2019–20, which killed over 25 people, destroyed 46 million acres, and wiped out over 1 billion animals. The work stands as both a tribute and a warning.'},
      'icant-lift-my-head-2021':{title:'I Can’t Lift My Head (2021)',artist:'Samantha Ellis',price:'£459',image:'i can’t lift my head (2021).webp',images:['i can’t lift my head (2021).webp','i can’t lift my head (2021)_frame.png','i can’t lift my head (2021)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Painted in response to the record-breaking fires of 2019–20, which killed over 25 people, destroyed 46 million acres, and wiped out over 1 billion animals. The work stands as both a tribute and a warning.'},
      'contrasting-waves-2017':{title:'contrasting-waves-2017',artist:'Samantha Ellis',price:'£219',image:'contrasting waves (2017).webp',images:['contrasting waves (2017).webp','contrasting waves (2017)_frame.png','contrasting waves (2017)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:': A vivid study of the meeting point between chaos and calm. Sweeping, energetic strokes capture the restless movement of waves, while the horizon offers a moment of stillness. The interplay of colour creates a rhythm that speaks to the eternal pull between motion and tranquillity.'},
      'untitled2019':{title:'untitled 2019',artist:'Samantha Ellis',price:'£120',image:'untitled (2019)_pre.png',images:['untitled (2019)_pre.png','untitled (2019)_frame.png','untitled (2019)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'A spontaneous composition where acrylic washes merge with the raw texture of chalk and the precision of graphite lines. This piece balances gestural freedom with delicate mark-making, allowing the paper’s surface to become an active participant in the work.'},
      'untitled-I-2019':{title:'untitled I 2019',artist:'Samantha Ellis',price:'£120',image:'untitled i (2019)_pre.png',images:['untitled i (2019)_pre.png','untitled i (2019)_frame.png','untitled i (2019)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Layered with shifting tones and tactile marks, these drawing captures the energy of movement and the pause of stillness in a single frame. The interplay between opaque acrylic passages and translucent chalk whispers creates a rhythm both fragile and assured.'},
      'Charles Darwin':{title:'Charles Darwin',artist:'Samantha Ellis',price:'£1,115',image:'charles darwin (24th november 1859) (2022).jpg',images:['charles darwin (24th november 1859) (2022).jpg','charles darwin (24th november 1859) (2022)_frame.png','charles darwin (24th november 1859) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'This work charts the stars on the day Charles Darwin published On the Origin of Species, a moment that reshaped humanity’s understanding of life itself. The composition evokes the vastness of time and discovery and remembers a moment that changed the world forever.  '},
      'Emily Davision':{title:'Emily Davision',artist:'Samantha Ellis',price:'£900',image:'emily davison (4th june 1913) (2022).webp',images:['emily davison (4th june 1913) (2022).webp','emily davison (4th june 1913) (2022)_frame.png','emily davison (4th june 1913) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Painted from the cloud formations present when suffragette Emily Davison stepped onto the racetrack at the Epsom Derby, this work honours a defining act of courage in the fight for women’s rights. Soft yet unyielding, the sky becomes a silent witness to a moment that would echo through history.'},
      'Emmett Till':{title:'Emmett Till',artist:'Samantha Ellis',price:'£900',image:'emmett till (21st august 1955) (2022).webp',images:['emmett till (21st august 1955) (2022).webp','emmett till (21st august 1955) (2022)_frame.png','emmett till (21st august 1955) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:' This piece reflects the clouds above on the day 14-year-old Emmett Till entered a Mississippi store, an event that would lead to his brutal murder and galvanise the civil rights movement, because of Emmett’s mother Mammie Till the world would see the devastating reactions to racisms in America and would never be the same again. '},
      'Yuri Gagarin':{title:'Yuri Gagarin',artist:'Samantha Ellis',price:'£899',image:'yuri gagarin (12th april 1961) (2022).webp',images:['yuri gagarin (12th april 1961) (2022).webp','yuri gagarin (12th april 1961) (2022)_frame.png','yuri gagarin (12th april 1961) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Capturing the precise star configuration at the moment Yuri Gagarin became the first human in space, this painting offers a cosmic vantage point on a triumph of exploration. It merges scientific precision with artistic interpretation, honouring humanity’s first steps beyond Earth.'},
      'Stonewall Riots':{title:'Stonewall Riots',artist:'Samantha Ellis',price:'£959',image:'stonewall riots (27th june 1969) (2022).webp',images:['stonewall riots (27th june 1969) (2022).webp','stonewall riots (27th june 1969) (2022)_frame.png','stonewall riots (27th june 1969) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Painted from the star chart above New York City on the night the Stonewall Riots began, this work commemorates a pivotal moment in LGBTQ+ history. Against the calm of the night sky, it speaks to defiance, resilience, and the enduring struggle for equality. A moment etched in time forever to be remembered for the braveness and strength of those involved. '},
      'Sarah Everard':{title:'sarah Everard',artist:'Samantha Ellis',price:'£1049',image:'sarah everard (12th march 2021) (2022).webp',images:['sarah everard (12th march 2021) (2022).webp','sarah everard (12th march 2021) (2022)_frame.png','sarah everard (12th march 2021) (2022)_pre.png'],medium:'Oil on Canvas',size:'50 × 50 cm',rating:'4.7',status:'Available',imageSize:'120x100',frameColor:'Black',description:'Based on the cloud formation from the day the artist learned of Sarah Everard’s murder, this painting is a poignant reminder of the ongoing fight for women’s safety. The painting was created as a time stamp for women to always remember Sarah and all other women who have been subjected to abuse and harm at the result of men'}
      
      
    
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || urlParams.get('id') || 'ethereal-light';
    const product = productDetailData[productId];
    
    if(product){
      document.getElementById('productTitle').textContent = product.title;
      document.getElementById('productTitleAbout').textContent = product.title + ' by ' + product.artist;
      document.getElementById('productArtist').textContent = 'by ' + product.artist;
      document.getElementById('productPrice').textContent = product.price;
      document.getElementById('productImage').src = product.image;
      document.getElementById('productDescription').textContent = product.description;
      document.getElementById('productMedium').textContent = product.medium;
      document.getElementById('productSize').textContent = product.size;
      
      // Add the new fields
      const ratingEl = document.getElementById('productRating');
      const statusEl = document.getElementById('productStatus');
      const imageSizeEl = document.getElementById('productImageSize');
      const frameColorEl = document.getElementById('productFrameColor');
      
      if(ratingEl) ratingEl.textContent = product.rating + ' / 5.0';
      if(statusEl) statusEl.textContent = product.status;
      if(imageSizeEl) imageSizeEl.textContent = product.imageSize + ' px';
      if(frameColorEl) frameColorEl.textContent = product.frameColor;
      
      document.title = product.title + ' - SAMANTHA';
    }
    
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
    const addToCartBtn = document.getElementById('addToCartBtn');
    if(addToCartBtn){
      addToCartBtn.addEventListener('click',()=>{
        const qty = parseInt(qtyInput?.value || 1);
        const size = document.getElementById('sizeSelect')?.value || '100 × 100 cm';
        const frame = document.getElementById('frameSelect')?.value || 'Black';
        
        const cartItem = {
          id: productId,
          productKey: productId,
          title: product.title,
          artist: product.artist,
          price: product.price,
          image: product.image,
          qty: qty,
          size: size,
          frame: frame
        };
        
        addToCart(cartItem);
        alert('Added to cart!');
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

// Quick View Modal Functionality
document.addEventListener('DOMContentLoaded',()=>{
  const isShopPage = !!document.querySelector('.shop-page');
  const modal = isShopPage ? null : document.getElementById('quickViewModal');
  const closeBtn = isShopPage ? null : document.getElementById('closeModal');
  // Only select quick-view buttons that are NOT in featured or trending carousels
  let quickViewButtons = isShopPage ? [] : document.querySelectorAll('.quick-view button');
  quickViewButtons = Array.from(quickViewButtons).filter(btn => !btn.closest('.featured-carousel') && !btn.closest('.trending-carousel'));
  const addToCartBtn = isShopPage ? null : document.getElementById('addToCartBtn');

  const productData={
    'rodeo':{title:'Rodeo',artist:'Sam Dougherty',price:'$200.00',image:'assets/rodeo.jpg',images:['assets/rodeo.jpg','Picture2.jpg','Picture2.jpg'],description:'Black and white film photograph capturing a moment at the rodeo.'},
    'teeber-rodeo':{title:'Teeber Rodeo',artist:'Sam Dougherty',price:'$350.00',image:'assets/teeber-rodeo.jpg',images:['assets/teeber-rodeo.jpg','Picture2.jpg','Picture2.jpg'],description:'A dynamic scene from the teeber rodeo event.'},
    'top-of-innsbruck':{title:'Top of Innsbruck',artist:'Sam Dougherty',price:'$280.00',image:'assets/top-of-innsbruck.jpg',images:['assets/top-of-innsbruck.jpg','Picture2.jpg','Picture2.jpg'],description:'Landscape photography from the top of Innsbruck mountains.'},
    'innsbruck':{title:'Innsbruck',artist:'Sam Dougherty',price:'$250.00',image:'assets/painting.jpg',images:['assets/painting.jpg','Picture2.jpg','Picture2.jpg'],description:'Artistic interpretation of the beautiful Innsbruck region.'},
    'gallery-frame':{title:'Gallery Frame',artist:'Mark Johnson',price:'$270.00',image:'Ihavefoundit2022.jpg',images:['Ihavefoundit2022.jpg','Picture2.jpg','Picture2.jpg'],description:'Elegant gallery-style framed piece with rich black frame and horizontal presentation.'},
    'vertical-frame':{title:'Vertical Frame',artist:'Lisa Wong',price:'$275.00',image:'Ihavefoundit2022.jpg',images:['Ihavefoundit2022.jpg','Picture2.jpg','Picture2.jpg'],description:'Stunning vertical frame composition with classic black frame and portrait orientation.'}
  };

  let currentProductKey='rodeo';
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

  // Setup product frame clicks for navigation on home page
  if(!isShopPage){
    const productTitleToId={
      'Rodeo':'rodeo',
      'Teeber Rodeo':'teeber-rodeo',
      'Top of Innsbruck':'top-of-innsbruck',
      'Sunset Dreams':'sunset-dreams',
      'Mountain Whispers':'mountain-whispers',
      'Urban Pulse':'urban-pulse',
      'Ethereal Light':'ethereal-light',
      'Ocean Serenity':'ocean-serenity'
    };
    
    const homeProductFrames=document.querySelectorAll(':not(.shop-page) .carousel-item .product-frame');
    homeProductFrames.forEach((frame)=>{
      frame.style.cursor = 'pointer';
      frame.addEventListener('click',(e)=>{
        if(e.target.closest('.quick-view button')){
          return;
        }
        
        const productCard=frame.closest('.product-card');
        const title=productCard?.querySelector('.product-title')?.textContent?.trim()||'Rodeo';
        const productId=productTitleToId[title]||'rodeo';
        window.location.href=`product-detail.html?id=${productId}`;
      });
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
      const qty=parseInt(qtyInput?.value||1);
      const size=document.getElementById('sizeSelect')?.value||'20cm x 30cm';
      const frame=document.getElementById('frameSelect')?.value||'Black';
      
      const product=productData[currentProductKey];
      const cartItem={
        id:currentProductKey,
        productKey:currentProductKey,
        title:product.title,
        artist:product.artist,
        price:product.price,
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

  // Trending Section Modal
  const modalTrending=document.getElementById('quickViewModalTrending');
  const closeBtnTrending=document.getElementById('closeModalTrending');
  const trendingQuickViewButtons=document.querySelectorAll('.trending-gallery-section .quick-view button');
  const addToCartBtnTrending=document.getElementById('addToCartBtnTrending');

  const trendingProductData={
    'sunset-dreams':{title:'Sunset Dreams',artist:'Elena Martinez',price:'$280.00',image:'assets/painting.jpg',description:'A breathtaking sunset artwork capturing the beauty of nature.'},
    'mountain-whispers':{title:'Mountain Whispers',artist:'James Chen',price:'$320.00',image:'assets/top-of-innsbruck.jpg',description:'Mountain landscape photography with stunning detail.'},
    'urban-pulse':{title:'Urban Pulse',artist:'Maya Patel',price:'$250.00',image:'assets/teeber-rodeo.jpg',description:'Contemporary urban art piece.'},
    'ethereal-light':{title:'Ethereal Light',artist:'Lucas Rivera',price:'$290.00',image:'assets/rodeo.jpg',description:'An ethereal and mystical artwork.'}
  };

  let currentTrendingProductKey='sunset-dreams';

  function openModalTrending(){
    if(modalTrending){
      modalTrending.classList.add('active');
    }
  }

  function closeModalTrending(){
    if(modalTrending){
      modalTrending.classList.remove('active');
    }
  }

  function updateModalContentTrending(productKey){
    const product=trendingProductData[productKey];
    if(!product) return;
    document.getElementById('modalProductImageTrending').src=product.image;
    document.getElementById('modalArtistNameTrending').textContent=product.artist;
    document.getElementById('modalProductTitleTrending').textContent=product.title;
    document.getElementById('modalPriceTrending').textContent=product.price;
    document.getElementById('modalDescriptionTrending').textContent=product.description;
  }

  // Setup trending quick view buttons
  trendingQuickViewButtons.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const productCard=btn.closest('.product-card');
      if(!productCard) return;
      
      const title=productCard.querySelector('.product-title')?.textContent||'Sunset Dreams';
      const productKey=Object.keys(trendingProductData).find(key=>trendingProductData[key].title===title)||'sunset-dreams';
      currentTrendingProductKey=productKey;
      
      updateModalContentTrending(productKey);
      openModalTrending();
    });
  });

  // Setup trending product frame clicks for navigation
  if(!isShopPage){
    const trendingProductTitleToId={
      'Sunset Dreams':'sunset-dreams',
      'Mountain Whispers':'mountain-whispers',
      'Urban Pulse':'urban-pulse',
      'Ethereal Light':'ethereal-light'
    };
    
    const trendingProductFrames=document.querySelectorAll('.trending-gallery-section .product-frame');
    trendingProductFrames.forEach((frame)=>{
      frame.style.cursor = 'pointer';
      frame.addEventListener('click',(e)=>{
        if(e.target.closest('.quick-view button')){
          return;
        }
        
        const productCard=frame.closest('.product-card');
        const title=productCard?.querySelector('.product-title')?.textContent?.trim()||'Sunset Dreams';
        const productId=trendingProductTitleToId[title]||'sunset-dreams';
        window.location.href=`product-detail.html?id=${productId}`;
      });
    });
  }

  // Close trending button
  if(closeBtnTrending){
    closeBtnTrending.addEventListener('click',closeModalTrending);
  }

  // Close trending modal on Escape key
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&modalTrending?.classList.contains('active')){
      closeModalTrending();
    }
  });

  // Trending quantity controls
  const qtyPlusTrending=document.getElementById('qtyPlusTrending');
  const qtyMinusTrending=document.getElementById('qtyMinusTrending');
  const qtyInputTrending=document.getElementById('qtyInputTrending');

  if(qtyPlusTrending){
    qtyPlusTrending.addEventListener('click',()=>{
      if(qtyInputTrending) qtyInputTrending.value=parseInt(qtyInputTrending.value||1)+1;
    });
  }

  if(qtyMinusTrending){
    qtyMinusTrending.addEventListener('click',()=>{
      if(qtyInputTrending&&parseInt(qtyInputTrending.value||1)>1){
        qtyInputTrending.value=parseInt(qtyInputTrending.value)-1;
      }
    });
  }

  // Add to cart - trending
  if(addToCartBtnTrending){
    addToCartBtnTrending.addEventListener('click',()=>{
      const qty=parseInt(qtyInputTrending?.value||1);
      const size=document.getElementById('sizeSelectTrending')?.value||'20cm x 30cm';
      const frame=document.getElementById('frameSelectTrending')?.value||'Black';
      
      const product=trendingProductData[currentTrendingProductKey];
      const cartItem={
        id:currentTrendingProductKey,
        productKey:currentTrendingProductKey,
        title:product.title,
        artist:product.artist,
        price:product.price,
        image:product.image,
        qty:qty,
        size:size,
        frame:frame
      };
      
      addToCart(cartItem);
      closeModalTrending();
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
      const priceText = card.querySelector('.product-price')?.textContent?.replace('From ','').trim()||'$0.00';
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

      ivAdd?.addEventListener('click', ()=>{
        const qty = parseInt(ivInput.value||1);
        const size = panel.querySelector('.iv-size')?.value||'20cm x 30cm';
        const frame = panel.querySelector('.iv-frame')?.value||'Black';
        const cartItem = { id: title, productKey: title, title: title, artist: artist, price: priceText, image: imgSrc, qty: qty, size: size, frame: frame };
        addToCart(cartItem);
        closeOpenPanel();
      });

      // Setup gallery for the inline panel (prev/next inside the panel)
      const panelPrev = panel.querySelector('.modal-prev');
      const panelNext = panel.querySelector('.modal-next');
      const panelImgEl = panel.querySelector('.modal-product-image');
      let panelGallery = [];
      let panelIndex = 0;
      // try to find product data by title
      const lookupTitle = title;
      const matchedKey = Object.keys(productData).find(k=>productData[k].title===lookupTitle);
      if(matchedKey && productData[matchedKey]){
        panelGallery = (Array.isArray(productData[matchedKey].images) && productData[matchedKey].images.length) ? productData[matchedKey].images.slice() : [productData[matchedKey].image];
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

    // Product card navigation to detail page (clicking the card itself, not quick-view)
    const productTitleToId={
      'Rodeo':'rodeo',
      'Teeber Rodeo':'teeber-rodeo',
      'Top of Innsbruck':'top-of-innsbruck',
      'Sunset Dreams':'sunset-dreams',
      'Mountain Whispers':'mountain-whispers',
      'Urban Pulse':'urban-pulse',
      'Ethereal Light':'ethereal-light',
      'Ocean Serenity':'ocean-serenity',
      'Gallery Frame':'gallery-frame',
      'Vertical Frame':'vertical-frame',
      'Abstract Dreams':'abstract-dreams',
      'Horizons':'horizons',
      'Moonlight':'moonlight',
      'Serenity':'serenity',
      'Wildflower':'wildflower',
      'Bamboo Grove':'bamboo-grove',
      'Lavender Fields':'lavender-fields',
      'Tuscan Hills':'tuscan-hills',
      'Nordic Lights':'nordic-lights',
      'Autumn Leaves':'autumn-leaves',
      'Sunset Beach':'sunset-beach',
      'Winter Snow':'winter-snow',
      'Forest Path':'forest-path',
      'Garden Paradise':'garden-paradise',
      'City Lights':'city-lights',
      'Ocean Waves':'ocean-waves',
      'Mountain Peak':'mountain-peak',
      'Summer Breeze':'summer-breeze',
      'Midnight Stars':'midnight-stars',
      'Starry Night':'starry-night',
      'Desert Mirage':'desert-mirage'
    };

    const allProductCards=grid.querySelectorAll('.product-card');
    allProductCards.forEach((card)=>{
      const frame=card.querySelector('.product-frame');
      if(frame){
        frame.style.cursor = 'pointer';
        frame.addEventListener('click',(e)=>{
          // Skip if quick-view button area was clicked
          if(e.target.closest('.quick-view button')){
            return;
          }
          
          const title=card.querySelector('.product-title')?.textContent?.trim()||'Rodeo';
          const productId=productTitleToId[title]||'rodeo';
          window.location.href=`product-detail.html?id=${productId}`;
        });
      }
    });
  }

  // Commission Form Functionality - Removed, now uses separate page
});

// Cart Management System
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
  updateCartDisplay();
  updateCartBadge(true);
  showCartNotification();
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
    cartTotal.textContent='$0.00';
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
      const price=parseFloat(item.price.replace('$',''));
      total+=price*item.qty;
    });
    cartTotal.textContent='$'+total.toFixed(2);
  }
}

function showCartNotification(){
  // Optional: Show a brief notification that item was added
  const cartItem=cart[cart.length-1];
  console.log(`Added ${cartItem.qty}x ${cartItem.title} to cart`);
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
        // Navigate to checkout page
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
    // load cart overview so order summary is populated
    loadCheckoutCart();

    checkoutForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      // gather data from visible inputs/selects/textareas
      const formData = new FormData();
      document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea').forEach(el=>{
        const key = el.name || el.id;
        if(!key) return;
        formData.append(key, el.value);
      });
      // attach cart JSON
      formData.append('cart', JSON.stringify(cart));

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
          cart = [];
          saveCart();
          window.location.href = 'index.html';
        }, 2000);
      } catch(err){
        console.error('order submission failed', err);
        showError('Failed to send order: '+err.message);
      }
    });
  }
});

// Load cart items on checkout page
function loadCheckoutCart(){
  const orderItems = document.getElementById('orderItems');
  if(!orderItems) return;
  
  cart = loadCart();
  
  if(cart.length === 0){
    orderItems.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Your cart is empty</p>';
    return;
  }
  
  orderItems.innerHTML = '';
  cart.forEach(item=>{
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    const itemTotal = (priceNum * item.qty).toFixed(2);
    
    itemElement.innerHTML = `
      <div class="item-details">
        <div class="item-title">${item.title}</div>
        <div class="item-meta">${item.size} • ${item.frame}</div>
      </div>
      <div class="item-price">$${itemTotal}</div>
    `;
    orderItems.appendChild(itemElement);
  });
  
  updateCheckoutTotals();
}

// Update totals on checkout page
function updateCheckoutTotals(){
  const subtotal = cart.reduce((sum, item)=>{
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + (price * item.qty);
  }, 0);
  
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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

// Hero / Quote / Artistcloud combined section - scroll-linked hard cuts
// The section is pinned (position: sticky) for its scroll range. The first
// CUT_FRACTION of that range switches instantly between video -> quote ->
// artistcloud (no crossfade, just a hard cut at each threshold). The
// remaining range is a hold: the artistcloud frame stays frozen in place
// while "Inside The Studio" (a normal, later, opaque section) scrolls up
// over it and covers it — the same pinned-stack effect used by sites like
// Stripe/Apple/LTX.
function initializeArtistcloudAnimation(){
  const section = document.getElementById('heroFadeSection');
  const videoLayer = document.getElementById('videoLayer');
  const quoteLayer = document.getElementById('quoteLayer');
  const cloudLayer = document.getElementById('cloudLayer');
  const header = document.querySelector('.site-header');
  const commissionSection = document.getElementById('commission-section');

  if(!section || !videoLayer || !quoteLayer || !cloudLayer) return;

  // Hard-cut thresholds within the cut phase (0-1): video shows first,
  // switches straight to quote, then straight to artistcloud — no fading.
  const videoCutAt = 0.33;
  const quoteCutAt = 0.66;

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
    const CUT_FRACTION = scrollableHeight > 0
      ? Math.max(0, 1 - window.innerHeight / scrollableHeight)
      : 1;

    // Remap the cut portion of the range to 0-1; once past it, stay
    // clamped at 1 (artistcloud fully visible) for the hold-and-cover phase.
    const progress = Math.min(1, rawProgress / CUT_FRACTION);

    let videoOpacity, quoteOpacity, cloudOpacity;

    if(progress <= videoCutAt){
      videoOpacity = 1; quoteOpacity = 0; cloudOpacity = 0;
    } else if(progress <= quoteCutAt){
      videoOpacity = 0; quoteOpacity = 1; cloudOpacity = 0;
    } else {
      videoOpacity = 0; quoteOpacity = 0; cloudOpacity = 1;
    }

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