'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initServiceAccordion = () => {
        const accordion = qs('[data-service-accordion]');
        if (!accordion) return;

        const items = qsa('[data-service-accordion-item]', accordion);

        items.forEach((item) => {
            const button = qs('[data-service-accordion-button]', item);
            const panel = qs('[data-service-accordion-panel]', item);

            if (!button || !panel) return;

            const isOpen = item.classList.contains('is-open');

            button.setAttribute('aria-expanded', String(isOpen));
            panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';

            button.addEventListener('click', () => {
                const currentlyOpen = item.classList.contains('is-open');

                items.forEach((otherItem) => {
                    const otherButton = qs('[data-service-accordion-button]', otherItem);
                    const otherPanel = qs('[data-service-accordion-panel]', otherItem);

                    otherItem.classList.remove('is-open');

                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }

                    if (otherPanel) {
                        otherPanel.style.maxHeight = '0px';
                    }
                });

                if (!currentlyOpen) {
                    item.classList.add('is-open');
                    button.setAttribute('aria-expanded', 'true');
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                } else {
                    const firstItem = items[0];
                    const firstButton = firstItem ? qs('[data-service-accordion-button]', firstItem) : null;
                    const firstPanel = firstItem ? qs('[data-service-accordion-panel]', firstItem) : null;

                    if (firstItem && firstButton && firstPanel) {
                        firstItem.classList.add('is-open');
                        firstButton.setAttribute('aria-expanded', 'true');
                        firstPanel.style.maxHeight = `${firstPanel.scrollHeight}px`;
                    }
                }

                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        });

        window.addEventListener('resize', () => {
            items.forEach((item) => {
                const button = qs('[data-service-accordion-button]', item);
                const panel = qs('[data-service-accordion-panel]', item);

                if (!button || !panel) return;

                if (button.getAttribute('aria-expanded') === 'true') {
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                }
            });
        });
    };

    const initIssueSelector = () => {
        const selector = qs('[data-issue-selector]');
        if (!selector) return;

        const cards = qsa('[data-issue-card]', selector);
        const image = qs('[data-issue-image]', selector);
        const title = qs('[data-issue-title]', selector);
        const text = qs('[data-issue-text]', selector);
        const link = qs('[data-issue-link]', selector);

        if (!cards.length || !image || !title || !text || !link) return;

        const updateSelector = (card) => {
            const nextImage = card.dataset.image || image.getAttribute('src');
            const nextTitle = card.dataset.title || '';
            const nextText = card.dataset.text || '';
            const nextUrl = card.dataset.url || '#';

            cards.forEach((item) => {
                item.classList.remove('is-active');
                item.setAttribute('aria-pressed', 'false');
            });

            card.classList.add('is-active');
            card.setAttribute('aria-pressed', 'true');

            image.style.opacity = '0';

            setTimeout(() => {
                image.setAttribute('src', nextImage);
                image.setAttribute('alt', `${nextTitle} category visual for provider matching`);
                title.textContent = nextTitle;
                text.textContent = nextText;
                link.setAttribute('href', nextUrl);
                image.style.opacity = '1';
            }, 180);
        };

        cards.forEach((card) => {
            card.setAttribute('aria-pressed', card.classList.contains('is-active') ? 'true' : 'false');

            card.addEventListener('click', () => {
                updateSelector(card);
            });

            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;

                event.preventDefault();
                updateSelector(card);
            });
        });
    };

    const initAllServices = () => {
        initServiceAccordion();
        initIssueSelector();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllServices);
    } else {
        initAllServices();
    }
})();