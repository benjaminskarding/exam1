import { fetchPosts } from './fetchPosts.mjs';
import { showLoadingIndicator, hideLoadingIndicator } from './utils.mjs';

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

    carouselInner.innerHTML = '';
    postNavigator.innerHTML = '';

    posts.forEach((post, index) => {
        const isActive = index === 0 ? 'active' : '';
        const altText = post.media?.alt || 'Main image description';

        const carouselItem = `
            <div class="carousel-item ${isActive}" data-bg="${post.media.url}" aria-label="${altText}">
                <div class="hero-text" id="hero-text-${index}">
                    <div class="category-and-tags-container">
                        <div class="bold">${(post.tags[0] || 'CATEGORY').toUpperCase()}</div>
                        <div class="bold">X</div>
                        <div class="bold">${(post.tags[1] || 'TAG').toUpperCase()}</div>
                    </div>
                    <div class="post-title-and-date-container">
                        <div class="post-title semibold">${(post.title || 'TITLE').toUpperCase()}</div>
                        <div class="post-date light">${new Date(post.created).toLocaleDateString('en-GB').replace(/\//g, ' | ')}</div>
                    </div>
                    <div class="post-description-container">
                        <p>${post.body.split(' ').slice(0, 30).join(' ')}...</p>
                    </div>
                    <div class="read-share-container">
                        <a href="/post/index.html?id=${post.id}" class="read-share-landing">READ</a>
                        <a class="read-share-landing">|</a>
                        <a href="#" class="read-share-landing" post-id="${post.id}" onclick="copyLink(event)">SHARE</a>
                    </div>
                    <div class="read-share-container-mobile">
                        <a href="/post/index.html?id=${post.id}" class="read-share-landing">READ</a>
                        <a href="#" class="read-share-landing" post-id="${post.id}" onclick="copyLink(event)">SHARE</a>
                    </div>
                </div>
            </div>
        `;

        carouselInner.innerHTML += carouselItem;
    });

    const postNavigatorHTML = `
        <a href="#" id="arrow-left-post-nav">
            <img src="assets/SVGs/ArrowLeft.svg" alt="arrow-left-post-nav">
        </a>
        ${posts.map((_, index) => `
            <a href="#" data-slide="${index}">
                <img src="assets/SVGs/Dot indictaor — ${index + 1}.svg" alt="dot-ind-${index + 1}-post-nav">
            </a>
        `).join('')}
        <a href="#" id="arrow-right-post-nav">
            <img src="assets/SVGs/ArrowRight.svg" alt="arrow-right-post-nav">
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
                img.src = 'assets/SVGs/Dot indictaor — 1.svg';
            } else {
                dot.classList.remove('active');
                img.src = 'assets/SVGs/Dot indictaor — 2.svg';
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

    showSlide(currentIndex);
}
