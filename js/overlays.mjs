/* Hamburger overlay setup */

export function setupMenuOverlay() {
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






