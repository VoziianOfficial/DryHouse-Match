'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initWarningSwitcher = () => {
        const switchers = qsa('[data-service-warning-switcher]');

        switchers.forEach((switcher) => {
            const cards = qsa('[data-warning-card]', switcher);
            const image = qs('[data-warning-image]', switcher);
            const title = qs('[data-warning-title]', switcher);
            const text = qs('[data-warning-text]', switcher);

            if (!cards.length || !image || !title || !text) return;

            const updateWarning = (card) => {
                const nextTitle = card.dataset.title || '';
                const nextText = card.dataset.text || '';
                const nextImage = card.dataset.image || image.getAttribute('src');

                cards.forEach((item) => {
                    item.classList.remove('is-active');
                    item.setAttribute('aria-pressed', 'false');
                });

                card.classList.add('is-active');
                card.setAttribute('aria-pressed', 'true');

                image.style.opacity = '0';

                setTimeout(() => {
                    image.setAttribute('src', nextImage);
                    image.setAttribute('alt', `${nextTitle} visual for water damage provider matching`);
                    title.textContent = nextTitle;
                    text.textContent = nextText;
                    image.style.opacity = '1';
                }, 180);
            };

            cards.forEach((card) => {
                card.setAttribute('aria-pressed', card.classList.contains('is-active') ? 'true' : 'false');

                card.addEventListener('click', () => {
                    updateWarning(card);
                });

                card.addEventListener('keydown', (event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;

                    event.preventDefault();
                    updateWarning(card);
                });
            });
        });
    };

    const initServicePage = () => {
        initWarningSwitcher();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServicePage);
    } else {
        initServicePage();
    }
})();