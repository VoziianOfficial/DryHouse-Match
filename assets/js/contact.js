'use strict';

(function () {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const showMessage = (element, message, type) => {
        if (!element) return;

        element.textContent = message;
        element.classList.remove('is-success', 'is-error');
        element.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
    };

    const hideMessage = (element) => {
        if (!element) return;

        element.textContent = '';
        element.classList.remove('is-visible', 'is-success', 'is-error');
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    };

    const validateForm = (form) => {
        const formData = new FormData(form);

        const fullName = String(formData.get('fullName') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const service = String(formData.get('service') || '').trim();
        const message = String(formData.get('message') || '').trim();
        const privacyConsent = formData.get('privacyConsent');

        if (fullName.length < 2) {
            return 'Please enter your full name.';
        }

        if (!isValidEmail(email)) {
            return 'Please enter a valid email address.';
        }

        if (phone.length < 7) {
            return 'Please enter a valid phone number.';
        }

        if (!service) {
            return 'Please select a service category.';
        }

        if (message.length < 10) {
            return 'Please add a short description of your request.';
        }

        if (!privacyConsent) {
            return 'Please confirm that you understand the provider-matching consent statement.';
        }

        return '';
    };

    const initContactForm = () => {
        const form = qs('[data-contact-form]');
        if (!form) return;

        const messageBox = qs('[data-form-message]', form);
        const startedInput = qs('[data-form-started]', form);
        const submitButton = qs('button[type="submit"]', form);

        if (startedInput) {
            startedInput.value = String(Date.now());
        }

        form.addEventListener('input', () => {
            hideMessage(messageBox);
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            hideMessage(messageBox);

            const validationError = validateForm(form);

            if (validationError) {
                showMessage(messageBox, validationError, 'error');
                return;
            }

            const formData = new FormData(form);
            const endpoint = form.getAttribute('action') || 'contact.php';

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                let result = null;

                try {
                    result = await response.json();
                } catch (jsonError) {
                    result = null;
                }

                if (!response.ok || !result || !result.success) {
                    const fallbackMessage = window.SiteConfig?.form?.errorMessage || 'Please check the required fields and try again.';
                    showMessage(messageBox, result?.message || fallbackMessage, 'error');
                    return;
                }

                const successMessage = result.message || window.SiteConfig?.form?.successMessage || 'Thank you. Your request has been received.';

                showMessage(messageBox, successMessage, 'success');
                form.reset();

                if (startedInput) {
                    startedInput.value = String(Date.now());
                }

                if (window.DryHouse && typeof window.DryHouse.injectServiceOptions === 'function') {
                    window.DryHouse.injectServiceOptions();
                }
            } catch (error) {
                const fallbackMessage = window.SiteConfig?.form?.errorMessage || 'Please check the required fields and try again.';
                showMessage(messageBox, fallbackMessage, 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit project details';
                }
            }
        });
    };

    const initProblemSlider = () => {
        const slider = qs('[data-contact-slider]');
        if (!slider) return;

        const slides = qsa('[data-contact-slide]', slider);
        const image = qs('[data-contact-slider-image]');
        const prevButton = qs('[data-contact-slider-prev]');
        const nextButton = qs('[data-contact-slider-next]');
        const dotsMount = qs('[data-contact-slider-dots]');

        if (!slides.length) return;

        let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
        let intervalId = null;

        const updateImage = (slide) => {
            if (!image || !slide) return;

            const nextImage = slide.dataset.image;

            if (!nextImage) return;

            image.style.opacity = '0';

            setTimeout(() => {
                image.setAttribute('src', nextImage);
                image.setAttribute('alt', `${qs('h3', slide)?.textContent || 'Water damage problem'} request category visual`);
                image.style.opacity = '1';
            }, 180);
        };

        const setActiveSlide = (index) => {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeIndex;

                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            qsa('[data-contact-slider-dot]', dotsMount || document).forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
                dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
            });

            updateImage(slides[activeIndex]);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        };

        const next = () => {
            setActiveSlide(activeIndex + 1);
        };

        const prev = () => {
            setActiveSlide(activeIndex - 1);
        };

        const stopAutoplay = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        const startAutoplay = () => {
            stopAutoplay();

            intervalId = setInterval(() => {
                next();
            }, 5200);
        };

        if (dotsMount) {
            dotsMount.innerHTML = slides.map((_, index) => {
                return `
                    <button class="problem-slider__dot" type="button" aria-label="Show problem category ${index + 1}" data-contact-slider-dot></button>
                `;
            }).join('');

            qsa('[data-contact-slider-dot]', dotsMount).forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    setActiveSlide(index);
                    startAutoplay();
                });
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prev();
                startAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                next();
                startAutoplay();
            });
        }

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', stopAutoplay);
        slider.addEventListener('focusout', startAutoplay);

        setActiveSlide(activeIndex);
        startAutoplay();
    };

    const initContact = () => {
        initContactForm();
        initProblemSlider();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (window.DryHouse && typeof window.DryHouse.refreshDynamicHeights === 'function') {
            window.DryHouse.refreshDynamicHeights();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact);
    } else {
        initContact();
    }
})();