'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const normalizePath = (path) => {
        const cleanPath = String(path || '').split('/').pop();

        return cleanPath || 'index.html';
    };

    const setActiveLegalLink = () => {
        const currentPage = normalizePath(window.location.pathname);
        const legalLinks = qsa('.legal-top-nav a');

        legalLinks.forEach((link) => {
            const linkPage = normalizePath(link.getAttribute('href'));
            const isActive = linkPage === currentPage;

            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const initLegalAnchors = () => {
        const anchorLinks = qsa('a[href^="#"]');

        anchorLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || targetId === '#') return;

                const target = qs(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    };

    const initLegalPage = () => {
        setActiveLegalLink();
        initLegalAnchors();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLegalPage);
    } else {
        initLegalPage();
    }
})();