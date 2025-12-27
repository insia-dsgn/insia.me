document.addEventListener("DOMContentLoaded", () => {
    
    // --- VARIABLES ---
    const video = document.getElementById("intro-video");
    const introContainer = document.getElementById("intro-container");
    const mainContent = document.getElementById("main-content");
    
    // --- FUNCTIONS ---

    // 1. Function to reveal the site
    const showSite = () => {
        document.body.classList.add("video-finished");
        introContainer.style.display = 'none';
        // Ensure content is visible immediately
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    };

    // 2. Function to run when video ends naturally
    const finishVideo = () => {
        document.body.classList.add("video-finished");
        
        // Save the flag so it doesn't play again this session
        sessionStorage.setItem('introPlayed', 'true');
        
        setTimeout(() => {
            introContainer.style.display = 'none';
        }, 500);
    };

    // --- LOGIC ---

    // CHECK: Has the video already been played in this session?
    if (sessionStorage.getItem('introPlayed')) {
        // YES: Skip video completely and show site immediately
        console.log("Intro already played. Skipping.");
        showSite();
        
        // Optional: Pause video just in case it tried to buffer
        if(video) video.pause(); 
        
    } else {
        // NO: Play the video logic
        if (video) {
            // Listen for the end of the video
            video.addEventListener("ended", finishVideo);
            
            // Attempt to play
            video.play().catch(error => {
                console.log("Autoplay prevented. Skipping intro.");
                finishVideo();
            });
        } else {
            // If on a page without video (like project pages), just show site
            showSite();
        }
    }

    // --- PART 2: INTERACTIVE SHAPES LOGIC (Unchanged) ---
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