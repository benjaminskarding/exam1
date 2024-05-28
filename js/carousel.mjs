import { fetchPosts } from './fetchPosts.mjs';
import { showLoadingIndicator, hideLoadingIndicator, getRootPath } from './utils.mjs';

// Homepage carousel 

export async function initializeCarousel() {
    showLoadingIndicator();
    try {
        const posts = await fetchPosts();
        if (posts && posts.data) {
            generateCarouselHTML(posts.data.slice(0, 3)); 
            setupCarouselNavigation();
        }
    } catch (error) {
        console.error('Error initializing carousel:', error);
    } finally {
        hideLoadingIndicator(); 
    }
}

function generateCarouselHTML(posts) {
    const carouselInner = document.getElementById('carousel-inner');
    const postNavigator = document.getElementById('post-navigator');
    const rootPath = getRootPath();

    carouselInner.innerHTML = '';
    postNavigator.innerHTML = '';

    posts.forEach((post, index) => {
        const isActive = index === 0 ? 'active' : '';
        const altText = post.media?.alt || 'Main image description';
        const bgImage = post.media?.url || 'default.jpg';

        const carouselItem = `
            <div class="carousel-item ${isActive}" data-bg="${bgImage}" aria-label="${altText}">
                <div class="hero-text" id="hero-text-${index}">
                    <div class="category-and-tags-container">
                        <div class="bold">${(post.tags[0] || 'CATEGORY').toUpperCase()}</div>
                        <div class="bold">X</div>
                        <div class="bold">${(post.tags[1] || 'TAG').toUpperCase()}</div>
                    </div>
                    <div class="post-title-and-date-container">
                        <h1 class="post-title semibold">${(post.title || 'TITLE').toUpperCase()}</h1>
                        <div class="post-date light">${new Date(post.created).toLocaleDateString('en-GB').replace(/\//g, ' | ')}</div>
                    </div>
                    <div class="post-description-container">
                        <p>${post.body.split(' ').slice(0, 30).join(' ')}...</p>
                    </div>
                    <div class="read-share-container">
                        <a href="${rootPath}/post/index.html?id=${post.id}" class="read-share-landing">READ</a>
                        <a class="read-share-landing">|</a>
                        <a href="#" class="read-share-landing" post-id="${post.id}" onclick="copyLink(event)">SHARE</a>
                    </div>
                    <div class="read-share-container-mobile">
                        <a href="${rootPath}/post/index.html?id=${post.id}" class="read-share-landing">READ</a>
                        <a href="#" class="read-share-landing" post-id="${post.id}" onclick="copyLink(event)">SHARE</a>
                    </div>
                </div>
            </div>
        `;

        carouselInner.innerHTML += carouselItem;
    });

    const postNavigatorHTML = `
        <a href="#" id="arrow-left-post-nav">
            <img src="./assets/SVGs/ArrowLeft.svg" alt="arrow-left-post-nav">
        </a>
        ${posts.map((_, index) => `
            <a href="#" data-slide="${index}" class="${index === 0 ? 'active' : ''}">
                <img src="./assets/SVGs/Dot_${index + 1}.svg" alt="dot-ind-${index + 1}-post-nav" class="${index === 0 ? 'active-dot' : ''}">
            </a>
        `).join('')}
        <a href="#" id="arrow-right-post-nav">
            <img src="./assets/SVGs/ArrowRight.svg" alt="arrow-right-post-nav">
        </a>
    `;

    postNavigator.innerHTML = postNavigatorHTML;
}

function setupCarouselNavigation() {
    const prevButton = document.getElementById('arrow-left-post-nav');
    const nextButton = document.getElementById('arrow-right-post-nav');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const landingSection = document.querySelector('.landing-section');
    const dotIndicators = document.querySelectorAll('.post-navigator a[data-slide]');
    let currentIndex = 0;

    const showSlide = (index) => {
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        dotIndicators.forEach((dot, i) => {
            const img = dot.querySelector('img');
            if (i === index) {
                dot.classList.add('active');
                img.src = 'assets/SVGs/Dot_1.svg';
            } else {
                dot.classList.remove('active');
                img.src = 'assets/SVGs/Dot_2.svg';
            }
        });

        const activeItem = carouselItems[index];
        const newBg = activeItem.getAttribute('data-bg');
        const newAlt = activeItem.getAttribute('aria-label');
        if (newBg) {
            landingSection.style.backgroundImage = `
                radial-gradient(419.8% 44.31% at 50% 44.31%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.75) 100%),
                url(${newBg})
            `;
            landingSection.setAttribute('aria-label', newAlt);
        }
    };

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
    });

    prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
    });

    dotIndicators.forEach((dot, index) => {
        dot.addEventListener('click', (event) => {
            event.preventDefault();
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Swipe functionality (yes, i'm proud of this one)
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwiping = false; // Initial swipe state

    const SWIPE_THRESHOLD = 30; // Minimum distance for a swipe to be registered. 
    // I wanted to see if i could avoid having the screen start scrolling downward if user was clearly just trying to left/right swipe the landing section carousel. Found it annoying.

    const handleTouchStart = (event) => {
        const interactiveElements = ['A', 'BUTTON']; // Targeting anchor tags and buttons in header and hero text. If these elements are clicked, carousel swiping functionality should not execute (thereby not blocking element interactivity)
        if (interactiveElements.includes(event.target.tagName)) {
            isSwiping = false; // Do not initiate swipe functionality if touch starts on an interactive element
        } else {
            isSwiping = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }
    };

    const handleTouchMove = (event) => {
        if (isSwiping) {
            endX = event.touches[0].clientX;
            endY = event.touches[0].clientY;
        }
    };

    const handleTouchEnd = (event) => {
        if (isSwiping) {
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) { // Retrieves _magnitude_ of swipe. Math.abs converts negative numbers to positive if present, 
                                                                                            // this conversion is done for consistency in outcome, as we only need the _magnitude_ of movement in this case, not direction, 
                                                                                            // Intention here is to only consider user input a swipe if horizontal movement is higher than the threshold
                                                                                            // AND vertical movement is less than the threshold
                if (deltaX > 0) { 
                    // Swipe right (moving backwards in carousel) if thresholds validated and swipe value positive
                    currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
                } else {
                    // Swipe left (moving forwards in carousel) if thresholds validated and swipe value negative
                    currentIndex = (currentIndex + 1) % carouselItems.length;
                }
                showSlide(currentIndex);

                // Prevent default to avoid scrolling
                event.preventDefault();
            }
        }
    };

    // Event listeners for the landing-section element
    landingSection.addEventListener('touchstart', handleTouchStart);
    landingSection.addEventListener('touchmove', handleTouchMove);
    landingSection.addEventListener('touchend', handleTouchEnd);


    showSlide(currentIndex);
}


document.addEventListener('DOMContentLoaded', initializeCarousel);