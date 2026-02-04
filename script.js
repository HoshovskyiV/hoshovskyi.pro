document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.documentElement.classList.add('is-ready');
    });

    const form = document.getElementById('payment-form');
    const btn = document.getElementById('pay-btn');
    const errorMsg = document.getElementById('error-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            btn.disabled = true;
            btn.textContent = 'Генеруємо посилання...';
            errorMsg.style.display = 'none';
            errorMsg.classList.remove('is-visible');
            errorMsg.textContent = '';

            try {
                const response = await fetch('/api/create-invoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                const data = await response.json();

                if (response.ok && data.pageUrl) {
                    window.location.href = data.pageUrl;
                    return;
                }

                throw new Error(data.message || 'Щось пішло не так');
            } catch (error) {
                console.error('Error:', error);
                errorMsg.textContent = 'Помилка при створенні оплати. Спробуйте пізніше.';
                errorMsg.style.display = 'block';
                errorMsg.classList.add('is-visible');
                btn.disabled = false;
                btn.textContent = 'Оплатити участь';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetSelector = anchor.getAttribute('href');
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (!target) {
                return;
            }

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });

    const carousel = document.querySelector('[data-carousel]');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const items = Array.from(carousel.querySelectorAll('.carousel__item'));
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        let currentIndex = 0;

        const updatePosition = () => {
            if (!track) {
                return;
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        prevButton?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updatePosition();
        });

        nextButton?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            updatePosition();
        });

        updatePosition();
    }
});
