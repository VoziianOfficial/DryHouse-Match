'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initAboutPhotoSwap = () => {
        const photoGroups = qsa('[data-about-photo-swap]');

        photoGroups.forEach((group) => {
            group.addEventListener('click', () => {
                group.classList.toggle('is-swapped');
            });

            group.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;

                event.preventDefault();
                group.classList.toggle('is-swapped');
            });

            group.setAttribute('tabindex', '0');
            group.setAttribute('role', 'button');
            group.setAttribute('aria-label', 'Swap platform story photos');
        });
    };

    const initAboutImageCards = () => {
        const cards = qsa('.matching-image-card');

        cards.forEach((card) => {
            card.addEventListener('focus', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-focused');
            });
        });
    };

    const initAbout = () => {
        initAboutPhotoSwap();
        initAboutImageCards();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAbout);
    } else {
        initAbout();
    }
})();