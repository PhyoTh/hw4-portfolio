(function () {
    const THEME_KEY = 'portfolio-theme';
    // apply theme to current document
    function applyTheme(theme) {
        console.log('Applying theme:', theme);
        if (!document.body) {
            console.warn('Body not ready yet');
            return;
        }

        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        saveTheme(theme);
        
        // if we're on the main page, apply to iframe as well
        if (window.self === window.top) {
            const iframe = document.querySelector('iframe[name="content-frame"]');
            if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
                if (theme === 'light') {
                    iframe.contentDocument.body.classList.add('light-theme');
                } else {
                    iframe.contentDocument.body.classList.remove('light-theme');
                }
            }
        }
    }
    
    // get theme from localStorage or default to dark
    function getTheme() {
        return localStorage.getItem(THEME_KEY) || 'dark';
    }
    // save theme to localStorage
    function saveTheme(theme) {
        console.log('Saving theme:', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // check if browser supportsView Transition API
    function supportsViewTransitions() {
        return 'startViewTransition' in document;
    }
    // theme toggle with View Transition
    function toggleTheme() {
        const newTheme = document.body.classList.contains('light-theme')
            ? 'dark'
            : 'light';

        if (!supportsViewTransitions()) {
            // fallback for browsers that don't support View Transitions
            applyTheme(newTheme);
            return;
        }
        // View Transition API for smooth theme change
        document.startViewTransition(() => {
            applyTheme(newTheme);
        });
    }


    // initialize theme on page load
    function initTheme() {
        const currentTheme = getTheme();
        console.log('Initial theme:', currentTheme);
        applyTheme(currentTheme);
    }
    
    // listen for iframe load events (on main page)
    function setupIframeListener() {
        if (window.self !== window.top) return;
        
        const iframe = document.querySelector('iframe[name="content-frame"]');
        if (iframe) {
            iframe.addEventListener('load', () => {
                const currentTheme = getTheme();
                if (iframe.contentDocument && iframe.contentDocument.body) {
                    if (currentTheme === 'light') {
                        iframe.contentDocument.body.classList.add('light-theme');
                    } else {
                        iframe.contentDocument.body.classList.remove('light-theme');
                    }
                }});
        }
    }

    // apply theme when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            
            // toggle button on main page
            if (window.self === window.top) {
                const toggleBtn = document.getElementById('theme-toggle');
                console.log('Toggle button found:', !!toggleBtn);
                
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', toggleTheme);
                }
                
                setupIframeListener();
            }
        });
    } else {
        initTheme();

        // only add toggle functionality on main page (not in iframe)
        if (window.self === window.top) {
            const toggleBtn = document.getElementById('theme-toggle');
            console.log('Toggle button found:', !!toggleBtn);
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', toggleTheme);
            }
            
            setupIframeListener();
        }
    }
})();
