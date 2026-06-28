'use strict';

(function () {
    const config = window.SiteConfig || {};

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const getValue = (path, fallback = '') => {
        if (!path) return fallback;

        return path.split('.').reduce((source, key) => {
            if (source && Object.prototype.hasOwnProperty.call(source, key)) {
                return source[key];
            }

            return undefined;
        }, config) ?? fallback;
    };

    const escapeHtml = (value = '') => {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };

    const telHref = () => `tel:${String(getValue('contact.phoneRaw')).replace(/[^\d+]/g, '')}`;
    const mailHref = () => `mailto:${getValue('contact.email')}`;

    const getCurrentFile = () => {
        const path = window.location.pathname.split('/').pop();
        return path || 'index.html';
    };

    const serviceLinks = () => {
        const services = config.services || [];

        return services.map((service) => {
            return `
                <a class="services-dropdown__link" href="${service.file}">
                    ${escapeHtml(service.title)}
                </a>
            `;
        }).join('');
    };

    const mobileServiceLinks = () => {
        const services = config.services || [];

        return services.map((service) => {
            return `
                <a class="mobile-menu__service-link" href="${service.file}">
                    ${escapeHtml(service.title)}
                </a>
            `;
        }).join('');
    };

    const footerServiceLinks = () => {
        const services = config.services || [];

        return services.map((service) => {
            return `
                <li>
                    <a class="footer-link" href="${service.file}">
                        ${escapeHtml(service.title)}
                    </a>
                </li>
            `;
        }).join('');
    };

    const navLinks = () => {
        const navigation = config.navigation || [];
        const currentFile = getCurrentFile();

        return navigation.map((item) => {
            const isServices = item.label.toLowerCase() === 'services';
            const activeClass = item.url === currentFile || (isServices && isServicePage()) ? ' is-active' : '';

            if (isServices) {
                return `
                    <li class="main-nav__item main-nav__item--services">
                        <a class="main-nav__link${activeClass}" href="${item.url}" data-services-trigger aria-haspopup="true" aria-expanded="false">
                            ${escapeHtml(item.label)}
                            <i data-lucide="chevron-down" aria-hidden="true"></i>
                        </a>

                        <div class="services-dropdown" data-services-dropdown>
                            ${serviceLinks()}
                        </div>
                    </li>
                `;
            }

            return `
                <li class="main-nav__item">
                    <a class="main-nav__link${activeClass}" href="${item.url}">
                        ${escapeHtml(item.label)}
                    </a>
                </li>
            `;
        }).join('');
    };

    const mobileNavLinks = () => {
        const navigation = config.navigation || [];

        return navigation.map((item) => {
            return `
                <a class="mobile-menu__link" href="${item.url}">
                    <span>${escapeHtml(item.label)}</span>
                    <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                </a>
            `;
        }).join('');
    };

    const isServicePage = () => {
        const currentFile = getCurrentFile();
        return (config.services || []).some((service) => service.file === currentFile);
    };

    const renderHeader = () => {
        const mount = qs('[data-site-header]');
        if (!mount) return;

        mount.className = 'site-header';
        mount.innerHTML = `
            <div class="pre-header">
                <div class="container-wide pre-header__inner">
                    <div class="pre-header__left">
                        <a class="pre-header__item" href="${telHref()}" data-phone-link>
                            <i data-lucide="phone" aria-hidden="true"></i>
                            <span data-config="contact.phoneDisplay">${escapeHtml(getValue('contact.phoneDisplay'))}</span>
                        </a>

                        <a class="pre-header__item" href="${mailHref()}" data-email-link>
                            <i data-lucide="mail" aria-hidden="true"></i>
                            <span data-config="contact.email">${escapeHtml(getValue('contact.email'))}</span>
                        </a>
                    </div>

                    <div class="pre-header__right">
                        <span class="pre-header__trust">
                            Independent provider-matching platform — availability may vary by location
                        </span>
                    </div>
                </div>
            </div>

            <div class="main-header">
                <div class="container-wide main-header__inner">
                    <a class="brand-link" href="index.html" aria-label="${escapeHtml(getValue('brand.name'))} home">
                        <img class="brand-link__logo" src="${getValue('brand.logo')}" alt="${escapeHtml(getValue('brand.logoAlt'))}" width="56" height="42">
                        <span class="brand-link__text">
                            <span class="brand-link__name" data-config="brand.name">${escapeHtml(getValue('brand.name'))}</span>
                            <span class="brand-link__tagline" data-config="brand.tagline">${escapeHtml(getValue('brand.tagline'))}</span>
                        </span>
                    </a>

                    <nav class="main-nav" aria-label="Main navigation">
                        <ul class="main-nav__list">
                            ${navLinks()}
                        </ul>
                    </nav>

                    <div class="header-actions">
                        <a class="btn btn--primary header-phone" href="contact.html">
                            ${escapeHtml(getValue('contact.phoneButtonText'))}
                        </a>

                        <a class="header-icon-btn" href="${telHref()}" aria-label="Call DryHouse Match" data-phone-link>
                            <i data-lucide="phone" aria-hidden="true"></i>
                        </a>

                        <a class="header-icon-btn" href="${mailHref()}" aria-label="Email DryHouse Match" data-header-email data-email-link>
                            <i data-lucide="mail" aria-hidden="true"></i>
                        </a>

                        <button class="burger-btn" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false" data-menu-toggle>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    const renderMobileMenu = () => {
        const mount = qs('[data-mobile-menu]');
        if (!mount) return;

        mount.className = 'mobile-menu';
        mount.id = 'mobile-menu';
        mount.setAttribute('aria-hidden', 'true');

        mount.innerHTML = `
            <div class="mobile-menu__panel">
                <div class="mobile-menu__brand">
                    <img src="${getValue('brand.logo')}" alt="${escapeHtml(getValue('brand.logoAlt'))}" width="56" height="42">
                    <div>
                        <strong data-config="brand.name">${escapeHtml(getValue('brand.name'))}</strong>
                        <p class="dark-lead">${escapeHtml(getValue('brand.tagline'))}</p>
                    </div>
                </div>

                <nav aria-label="Mobile navigation">
                    <div class="mobile-menu__grid">
                        ${mobileNavLinks()}
                    </div>
                </nav>

                <div class="mobile-menu__services">
                    <p class="mobile-menu__title">Service categories</p>
                    <div class="mobile-menu__service-list">
                        ${mobileServiceLinks()}
                    </div>
                </div>

                <div class="mobile-menu__contacts">
                    <a class="btn btn--primary" href="contact.html">
                        ${escapeHtml(getValue('contact.phoneButtonText'))}
                    </a>

                    <a class="btn btn--dark-ghost" href="${telHref()}" data-phone-link>
                        ${escapeHtml(getValue('contact.phoneDisplay'))}
                    </a>

                    <a class="btn btn--dark-ghost" href="${mailHref()}" data-email-link>
                        ${escapeHtml(getValue('contact.email'))}
                    </a>
                </div>
            </div>
        `;
    };

    const renderFooter = () => {
        const mount = qs('[data-site-footer]');
        if (!mount) return;

        const nav = config.navigation || [];

        mount.className = 'site-footer';
        mount.innerHTML = `
            <div class="footer-main">
                <div class="container-wide">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <div class="footer-brand__top">
                                <img src="${getValue('brand.logo')}" alt="${escapeHtml(getValue('brand.logoAlt'))}" width="62" height="46">
                                <div>
                                    <p class="footer-brand__name" data-config="brand.name">${escapeHtml(getValue('brand.name'))}</p>
                                    <p class="dark-lead" data-config="brand.tagline">${escapeHtml(getValue('brand.tagline'))}</p>
                                </div>
                            </div>

                            <p class="footer-text" data-config="footer.description">
                                ${escapeHtml(getValue('footer.description'))}
                            </p>

                            <p class="footer-text">
                                <strong>Company ID:</strong>
                                <span data-config="company.companyId">${escapeHtml(getValue('company.companyId'))}</span>
                            </p>
                        </div>

                        <div>
                            <p class="footer-title">Pages</p>
                            <ul class="footer-list">
                                ${nav.map((item) => `
                                    <li>
                                        <a class="footer-link" href="${item.url}">
                                            ${escapeHtml(item.label)}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div>
                            <p class="footer-title">Service categories</p>
                            <ul class="footer-list">
                                ${footerServiceLinks()}
                            </ul>
                        </div>

                        <div>
                            <p class="footer-title">Contact</p>

                            <div class="footer-contact">
                                <a class="footer-contact__item" href="${telHref()}" data-phone-link>
                                    <i data-lucide="phone" aria-hidden="true"></i>
                                    <span data-config="contact.phoneDisplay">${escapeHtml(getValue('contact.phoneDisplay'))}</span>
                                </a>

                                <a class="footer-contact__item" href="${mailHref()}" data-email-link>
                                    <i data-lucide="mail" aria-hidden="true"></i>
                                    <span data-config="contact.email">${escapeHtml(getValue('contact.email'))}</span>
                                </a>

                                <div class="footer-contact__item">
                                    <i data-lucide="map-pin" aria-hidden="true"></i>
                                    <span data-config="company.address">${escapeHtml(getValue('company.address'))}</span>
                                </div>

                                <div class="footer-contact__item">
                                    <i data-lucide="badge-info" aria-hidden="true"></i>
                                    <span data-config="company.serviceArea">${escapeHtml(getValue('company.serviceArea'))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer-disclaimer" data-config="legal.disclaimer">
                        ${escapeHtml(getValue('legal.disclaimer'))}
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="container-wide footer-bottom__inner">
                    <p data-config="footer.copyright">${escapeHtml(getValue('footer.copyright'))}</p>

                    <div class="footer-bottom__links">
                        <a href="${getValue('legal.privacyUrl')}">Privacy Policy</a>
                        <a href="${getValue('legal.termsUrl')}">Terms of Service</a>
                        <a href="${getValue('legal.cookieUrl')}">Cookie Policy</a>
                    </div>
                </div>
            </div>
        `;
    };

    const renderSharedCta = () => {
        qsa('[data-shared-cta]').forEach((mount) => {
            mount.className = 'shared-cta';
            mount.innerHTML = `
                <div class="container-wide shared-cta__inner">
                    <div class="shared-cta__content">
                        <p class="shared-cta__eyebrow">${escapeHtml(getValue('sharedCta.eyebrow'))}</p>
                        <h2 class="shared-cta__title">${escapeHtml(getValue('sharedCta.title'))}</h2>
                        <p class="shared-cta__text">${escapeHtml(getValue('sharedCta.text'))}</p>
                    </div>

                    <div class="shared-cta__actions">
                        <a class="btn btn--black" href="${getValue('sharedCta.primaryUrl')}">
                            ${escapeHtml(getValue('sharedCta.primaryLabel'))}
                        </a>
                        <a class="btn btn--white" href="${getValue('sharedCta.secondaryUrl')}">
                            ${escapeHtml(getValue('sharedCta.secondaryLabel'))}
                        </a>
                    </div>
                </div>
            `;
        });
    };

    const renderCookieBanner = () => {
        const mount = qs('[data-cookie-banner]');
        if (!mount) return;

        const savedChoice = localStorage.getItem('dryhouse_cookie_choice');

        if (savedChoice) {
            mount.remove();
            return;
        }

        mount.className = 'cookie-banner is-visible';
        mount.innerHTML = `
            <div class="cookie-banner__inner" role="dialog" aria-live="polite" aria-label="Cookie consent">
                <p class="cookie-banner__text">
                    DryHouse Match uses essential browser storage for preferences such as this notice.
                    Review our
                    <a href="${getValue('legal.privacyUrl')}">Privacy Policy</a>,
                    <a href="${getValue('legal.cookieUrl')}">Cookie Policy</a>,
                    and <a href="${getValue('legal.termsUrl')}">Terms</a>.
                </p>

                <div class="cookie-banner__actions">
                    <button class="btn btn--white" type="button" data-cookie-choice="declined">
                        Decline
                    </button>
                    <button class="btn btn--primary" type="button" data-cookie-choice="accepted">
                        Accept
                    </button>
                </div>
            </div>
        `;

        qsa('[data-cookie-choice]', mount).forEach((button) => {
            button.addEventListener('click', () => {
                localStorage.setItem('dryhouse_cookie_choice', button.dataset.cookieChoice || 'selected');
                mount.classList.remove('is-visible');

                setTimeout(() => {
                    mount.remove();
                }, 220);
            });
        });
    };

    const injectConfigValues = () => {
        const replacementGroups = [
            {
                path: 'brand.name',
                aliases: [
                    'DryHouse Match'
                ]
            },
            {
                path: 'company.name',
                aliases: [
                    'DryHouse Match'
                ]
            },
            {
                path: 'company.legalName',
                aliases: [
                    'DryHouse Match'
                ]
            },
            {
                path: 'company.companyId',
                aliases: [
                    'DHM-WD-2026'
                ]
            },
            {
                path: 'company.address',
                aliases: [
                    'USA Service Area'
                ]
            },
            {
                path: 'company.serviceArea',
                aliases: [
                    'Independent provider matching across selected service areas'
                ]
            },
            {
                path: 'contact.phoneDisplay',
                aliases: [
                    '(888) 555-0194',
                    '888-555-0194',
                    '888 555 0194'
                ]
            },
            {
                path: 'contact.phoneRaw',
                aliases: [
                    '+18885550194',
                    '18885550194'
                ]
            },
            {
                path: 'contact.email',
                aliases: [
                    'support@dryhousematch.com'
                ]
            },
            {
                path: 'contact.supportHours',
                aliases: [
                    'Request access available 24/7'
                ]
            },
            {
                path: 'contact.phoneButtonText',
                aliases: [
                    'Start Request'
                ]
            },
            {
                path: 'footer.description',
                aliases: [
                    'DryHouse Match is an independent provider-matching platform that helps homeowners submit water-damage request details and compare available local provider options.'
                ]
            },
            {
                path: 'footer.copyright',
                aliases: [
                    '© 2026 DryHouse Match. All rights reserved.'
                ]
            },
            {
                path: 'footer.shortDisclaimer',
                aliases: [
                    'DryHouse Match is not a contractor, restoration company, plumbing company, inspection company, insurer, or direct service provider.'
                ]
            },
            {
                path: 'legal.disclaimer',
                aliases: [
                    'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.'
                ]
            }
        ];

        const replacementPairs = replacementGroups
            .map((group) => {
                const newValue = getValue(group.path, '');

                return (group.aliases || [])
                    .filter((oldValue) => oldValue && newValue && oldValue !== newValue)
                    .map((oldValue) => ({
                        oldValue: String(oldValue),
                        newValue: String(newValue)
                    }));
            })
            .flat()
            .sort((a, b) => b.oldValue.length - a.oldValue.length);

        const replaceText = (value = '') => {
            let nextValue = String(value);

            replacementPairs.forEach(({ oldValue, newValue }) => {
                nextValue = nextValue.split(oldValue).join(newValue);
            });

            return nextValue;
        };

        const shouldSkipTextNode = (node) => {
            const parent = node.parentElement;

            if (!parent) return true;

            return Boolean(parent.closest(`
            script,
            style,
            noscript,
            template,
            svg,
            canvas,
            input,
            textarea,
            select
        `));
        };

        const replaceTextNodes = (root = document.body) => {
            if (!root) return;

            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (!node.nodeValue || !node.nodeValue.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (shouldSkipTextNode(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const nodes = [];

            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            nodes.forEach((node) => {
                const nextValue = replaceText(node.nodeValue);

                if (nextValue !== node.nodeValue) {
                    node.nodeValue = nextValue;
                }
            });
        };

        const replaceAttributes = () => {
            const attributesToReplace = [
                'title',
                'alt',
                'aria-label',
                'placeholder',
                'content'
            ];

            qsa('[title], [alt], [aria-label], [placeholder], meta[content]').forEach((element) => {
                attributesToReplace.forEach((attribute) => {
                    if (!element.hasAttribute(attribute)) return;

                    const currentValue = element.getAttribute(attribute);
                    const nextValue = replaceText(currentValue);

                    if (nextValue !== currentValue) {
                        element.setAttribute(attribute, nextValue);
                    }
                });
            });
        };

        const replaceHeadContent = () => {
            if (document.title) {
                document.title = replaceText(document.title);
            }

            qsa('script[type="application/ld+json"]').forEach((script) => {
                if (!script.textContent) return;

                const nextValue = replaceText(script.textContent);

                if (nextValue !== script.textContent) {
                    script.textContent = nextValue;
                }
            });
        };

        const injectExactConfigElements = () => {
            qsa('[data-config]').forEach((element) => {
                const path = element.dataset.config;
                element.textContent = getValue(path, element.textContent);
            });

            qsa('[data-config-html]').forEach((element) => {
                const path = element.dataset.configHtml;
                element.innerHTML = escapeHtml(getValue(path, element.innerHTML));
            });

            qsa('[data-config-href]').forEach((element) => {
                const path = element.dataset.configHref;
                element.setAttribute('href', getValue(path, element.getAttribute('href') || '#'));
            });

            qsa('[data-config-src]').forEach((element) => {
                const path = element.dataset.configSrc;
                element.setAttribute('src', getValue(path, element.getAttribute('src') || ''));
            });

            qsa('[data-config-alt]').forEach((element) => {
                const path = element.dataset.configAlt;
                element.setAttribute('alt', getValue(path, element.getAttribute('alt') || ''));
            });
        };

        const updateContactLinks = () => {
            qsa('[data-phone-link], a[href^="tel:"]').forEach((element) => {
                element.setAttribute('href', telHref());
            });

            qsa('[data-email-link], a[href^="mailto:"]').forEach((element) => {
                element.setAttribute('href', mailHref());
            });
        };

        const updateForms = () => {
            qsa('form[data-contact-form]').forEach((form) => {
                if (getValue('form.endpoint')) {
                    form.setAttribute('action', getValue('form.endpoint'));
                }
            });

            qsa('input[name="recipient"]').forEach((input) => {
                input.value = getValue('form.recipient', input.value);
            });

            qsa('.checkbox-field__text').forEach((element) => {
                const consentText = getValue('form.consentText');

                if (consentText) {
                    element.textContent = consentText;
                }
            });
        };

        injectExactConfigElements();
        replaceTextNodes(document.body);
        replaceAttributes();
        replaceHeadContent();
        updateContactLinks();
        updateForms();
    };

    const injectServiceOptions = () => {
        qsa('[data-service-select]').forEach((select) => {
            if (!select) return;

            const currentValue = select.value;
            const options = (config.services || []).map((service) => {
                return `<option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>`;
            }).join('');

            select.innerHTML = `
                <option value="">Select a service category</option>
                ${options}
            `;

            if (currentValue) {
                select.value = currentValue;
            }
        });
    };

    const initStickyHeader = () => {
        const header = qs('.site-header');
        if (!header) return;

        const update = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
    };

    const initDesktopDropdown = () => {
        const trigger = qs('[data-services-trigger]');
        const dropdown = qs('[data-services-dropdown]');

        if (!trigger || !dropdown) return;

        let closeTimer = null;

        const open = () => {
            clearTimeout(closeTimer);
            dropdown.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const close = () => {
            closeTimer = setTimeout(() => {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }, 180);
        };

        trigger.addEventListener('mouseenter', open);
        trigger.addEventListener('focus', open);
        dropdown.addEventListener('mouseenter', open);

        trigger.addEventListener('mouseleave', close);
        dropdown.addEventListener('mouseleave', close);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    };

    const initMobileMenu = () => {
        const toggle = qs('[data-menu-toggle]');
        const menu = qs('[data-mobile-menu]');

        if (!toggle || !menu) return;

        const openMenu = () => {
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close menu');
            menu.classList.add('is-open');
            menu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-open');
        };

        const closeMenu = () => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-open');
        };

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMenu() : openMenu();
        });

        qsa('a', menu).forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 980) {
                closeMenu();
            }
        });
    };

    const initFaqAccordions = (scope = document) => {
        qsa('.faq-question', scope).forEach((button) => {
            const item = button.closest('.faq-item');
            const answer = item ? qs('.faq-answer', item) : null;

            if (!item || !answer) return;

            const isOpen = button.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            } else {
                answer.style.maxHeight = '0px';
            }

            button.addEventListener('click', () => {
                const block = button.closest('[data-faq-accordion]');
                const shouldCloseOthers = block ? block.dataset.faqAccordion !== 'multiple' : true;
                const expanded = button.getAttribute('aria-expanded') === 'true';

                if (shouldCloseOthers && block) {
                    qsa('.faq-question', block).forEach((otherButton) => {
                        if (otherButton === button) return;

                        const otherItem = otherButton.closest('.faq-item');
                        const otherAnswer = otherItem ? qs('.faq-answer', otherItem) : null;

                        otherButton.setAttribute('aria-expanded', 'false');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0px';
                        }
                    });
                }

                button.setAttribute('aria-expanded', String(!expanded));
                answer.style.maxHeight = expanded ? '0px' : `${answer.scrollHeight}px`;
            });
        });
    };

    const initGenericAccordions = (scope = document) => {
        qsa('[data-accordion]', scope).forEach((accordion) => {
            const buttons = qsa('[data-accordion-button]', accordion);

            buttons.forEach((button) => {
                const item = button.closest('[data-accordion-item]');
                const panel = item ? qs('[data-accordion-panel]', item) : null;

                if (!item || !panel) return;

                const isOpen = item.classList.contains('is-open') || button.getAttribute('aria-expanded') === 'true';

                button.setAttribute('aria-expanded', String(isOpen));
                panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';

                button.addEventListener('click', () => {
                    const expanded = button.getAttribute('aria-expanded') === 'true';
                    const singleMode = accordion.dataset.accordion !== 'multiple';

                    if (singleMode) {
                        buttons.forEach((otherButton) => {
                            if (otherButton === button) return;

                            const otherItem = otherButton.closest('[data-accordion-item]');
                            const otherPanel = otherItem ? qs('[data-accordion-panel]', otherItem) : null;

                            otherButton.setAttribute('aria-expanded', 'false');
                            otherItem?.classList.remove('is-open');

                            if (otherPanel) {
                                otherPanel.style.maxHeight = '0px';
                            }
                        });
                    }

                    button.setAttribute('aria-expanded', String(!expanded));
                    item.classList.toggle('is-open', !expanded);
                    panel.style.maxHeight = expanded ? '0px' : `${panel.scrollHeight}px`;
                });
            });
        });
    };

    const initCounters = (scope = document) => {
        const counters = qsa('[data-counter]', scope);

        if (!counters.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const animateCounter = (counter) => {
            const targetRaw = counter.dataset.counter || counter.textContent.trim();
            const numericTarget = parseFloat(targetRaw.replace(/[^\d.]/g, ''));

            if (!Number.isFinite(numericTarget) || reduceMotion) {
                counter.textContent = targetRaw;
                return;
            }

            const suffix = targetRaw.replace(String(numericTarget), '').replace(/[0-9.]/g, '');
            const duration = 900;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(numericTarget * eased);

                counter.textContent = `${value}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = targetRaw;
                }
            };

            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                instance.unobserve(entry.target);
            });
        }, {
            threshold: 0.35
        });

        counters.forEach((counter) => observer.observe(counter));
    };

    const initSiteAnimations = () => {
        if (!window.AOS) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.AOS.init({
            duration: 650,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 70,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disable: prefersReducedMotion
        });

        window.addEventListener('load', () => {
            window.AOS.refresh();
        }, { once: true });
    };

    const initLibraries = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    const refreshDynamicHeights = () => {
        qsa('.faq-question[aria-expanded="true"]').forEach((button) => {
            const item = button.closest('.faq-item');
            const answer = item ? qs('.faq-answer', item) : null;

            if (answer) {
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });

        qsa('[data-accordion-button][aria-expanded="true"]').forEach((button) => {
            const item = button.closest('[data-accordion-item]');
            const panel = item ? qs('[data-accordion-panel]', item) : null;

            if (panel) {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    };

    const init = () => {
        renderHeader();
        renderMobileMenu();
        renderFooter();
        renderSharedCta();
        renderCookieBanner();

        injectConfigValues();
        injectServiceOptions();

        initStickyHeader();
        initDesktopDropdown();
        initMobileMenu();
        initFaqAccordions();
        initGenericAccordions();
        initCounters();
        initSiteAnimations();
        initLibraries();

        window.addEventListener('resize', refreshDynamicHeights);
    };

    window.DryHouse = {
        config,
        qs,
        qsa,
        getValue,
        initFaqAccordions,
        initGenericAccordions,
        initCounters,
        refreshDynamicHeights,
        injectConfigValues,
        injectServiceOptions
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
