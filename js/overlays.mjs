/* Hamburger overlay setup */

function setupMenuOverlay() {
    const menuOverlay = document.getElementById('menuOverlay');
    const openBtn = document.getElementById('openMenuOverlay');
    const closeBtn = document.getElementById('closeMenuOverlay');

    if (menuOverlay && openBtn && closeBtn) {
        openBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            menuOverlay.style.transform = "translateY(0)"; 
        });

        closeBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            menuOverlay.style.transform = "translateY(-100%)"; 
        });
    }
}

// Insert hamburger menu overlay in all pages above footer

export function insertMenuOverlay() {
    const currentPath = window.location.pathname;
    const rootPath = currentPath === '/index.html' ? '.' : '..';
    
    const menuOverlayHTML = `
        <div id="menuOverlay" class="overlay">
            <a href="#" class="closebtn" id="closeMenuOverlay">
                <img src="${rootPath}/assets/SVGs/CloseButton.svg" alt="Close" />
            </a>
            <div class="overlay-content">
                <div class="overlay-links">
                    <a href="${rootPath}/account/register.html">Register</a>
                    <a href="${rootPath}/account/login.html">Login</a>
                </div>
                <h1 class="aboutTheBlog">ABOUT THE BLOG</h1>
                <div class="aboutTheBlogMobileContainer">
                    <a href="${rootPath}/pages/about_the_blog.html" class="aboutTheBlogMobile">About the blog</a>
                </div>
                <p class="dividerline blogDescription">Nomad Narrative is your go-to source for exploring the globe through the eyes of a remote-working adventurer. Each post is an invitation to journey with us, whether you're seeking practical advice for your next destination or simply indulging your wanderlust from the comfort of your home. Join us as we explore the world, one story at a time.</p>
                <div class="social-links">
                    <a href="#">
                        <img src="${rootPath}/assets/SVGs/instagram.svg" id="instagram-svg-overlay" alt="instagram link in overlay menu">
                    </a>
                    <a href="#">
                        <img src="${rootPath}/assets/SVGs/youtube.svg" id="youtube-svg-overlay" alt="youtube link in overlay menu">
                    </a>
                    <a href="#">
                        <img src="${rootPath}/assets/SVGs/facebook.svg" id="facebook-svg-overlay" alt="facebook link in overlay menu">
                    </a>
                </div>
                <div>
                    <a href="${rootPath}/index.html">
                        <img src="${rootPath}/assets/SVGs/LogoWithText.svg" id="facebook-svg-overlay" alt="homepage link in overlay menu">
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuOverlayHTML);
    setupMenuOverlay();
}

/* Terms and conditions overlay */

export function termsAndConditionsOverlay() {
    const termsLink = document.getElementById('termsLink');
    const termsOverlay = document.getElementById('termsOverlay');

    if (termsLink && termsOverlay) {
        termsLink.addEventListener('click', function(event) {
            event.preventDefault();
            termsOverlay.classList.add('active');
            event.stopPropagation();  
        });

        // Close the overlay on outside click
        document.addEventListener('click', function(event) {
            if (termsOverlay.classList.contains('active') && !termsOverlay.contains(event.target)) {
                termsOverlay.classList.remove('active');
            }
        });


        termsOverlay.addEventListener('click', function(event) {
            event.stopPropagation();
        });
        }           
}






