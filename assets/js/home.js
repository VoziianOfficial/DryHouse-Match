'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const initHomeServiceAccordion = () => {
        const accordion = qs('[data-home-service-accordion]');
        if (!accordion) return;

        const panels = qsa('[data-home-service-panel]', accordion);

        panels.forEach((panel) => {
            const trigger = qs('[data-home-service-trigger]', panel);

            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isOpen = panel.classList.contains('is-open');

                panels.forEach((otherPanel) => {
                    const otherTrigger = qs('[data-home-service-trigger]', otherPanel);

                    otherPanel.classList.remove('is-open');

                    if (otherTrigger) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });

                if (!isOpen) {
                    panel.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                } else {
                    const firstPanel = panels[0];
                    const firstTrigger = firstPanel ? qs('[data-home-service-trigger]', firstPanel) : null;

                    if (firstPanel && firstTrigger) {
                        firstPanel.classList.add('is-open');
                        firstTrigger.setAttribute('aria-expanded', 'true');
                    }
                }

                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        });
    };

    const initHexCardKeyboardSupport = () => {
        const cards = qsa('.hex-category');

        cards.forEach((card) => {
            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;

                event.preventDefault();
                card.click();
            });
        });
    };

    const initHome = () => {
        initHomeServiceAccordion();
        initHexCardKeyboardSupport();

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHome);
    } else {
        initHome();
    }
})();