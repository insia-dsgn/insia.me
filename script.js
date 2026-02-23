window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    
    // Minimal delay to ensure the user sees the animation 
    // and the layout is fully settled
    setTimeout(() => {
        loader.classList.add("hidden");
        
        setTimeout(() => {
            loader.style.display = "none";
        }, 600); // Wait for the CSS transition to finish
    }, 1000); 
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- VARIABLES ---
    const video = document.getElementById("intro-video");
    const introContainer = document.getElementById("intro-container");
    const mainContent = document.getElementById("main-content");
    
    // --- FUNCTIONS ---

    // reveal site
    const showSite = () => {
        document.body.classList.add("video-finished");
        
        // CHECK if element exists before styling it
        if (introContainer) {
            introContainer.style.display = 'none';
        }
        
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }
    };

    // when video ends
    const finishVideo = () => {
        document.body.classList.add("video-finished");
        
        // Save the flag so it doesn't play again this session
        sessionStorage.setItem('introPlayed', 'true');
        
        setTimeout(() => {
            if (introContainer) introContainer.style.display = 'none';
        }, 500);
    };

    // --- INTRO LOGIC ---

    // detect if the page was just reloaded
    if (video) {
        const navEntry = performance.getEntriesByType("navigation")[0];
        if (navEntry && navEntry.type === 'reload') {
            sessionStorage.removeItem('introPlayed');
        }
    }

    // check storage to decide: Play or Skip?
    if (sessionStorage.getItem('introPlayed')) {
        showSite();
        if(video) video.pause(); 
        
    } else {
        if (video) {
            video.addEventListener("ended", finishVideo);
            video.play().catch(error => {
                console.log("Autoplay prevented. Skipping intro.");
                finishVideo();
            });
        } else {
            showSite();
        }
    }

    // --- INTERACTIVE SHAPES LOGIC ---
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(el => {
        let isDragging = false;
        let startX, startY, initialTranslateX, initialTranslateY;

        const getTranslateValues = (element) => {
            const style = window.getComputedStyle(element);
            const matrix = new WebKitCSSMatrix(style.transform);
            return { x: matrix.m41, y: matrix.m42 };
        };

        const onMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const currentTransform = getTranslateValues(el);
            initialTranslateX = currentTransform.x;
            initialTranslateY = currentTransform.y;
            el.style.transition = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.transform = `translate(${initialTranslateX + dx}px, ${initialTranslateY + dy}px)`;
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            el.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            el.style.transform = 'translate(0px, 0px)';
        };

        el.addEventListener('mousedown', onMouseDown);
    });
});

function toggleMenu() {
    document.getElementById('mobile-nav').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('open');
}