document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    const btn = document.getElementById('pay-btn');
    const errorMsg = document.getElementById('error-message');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            btn.disabled = true;
            btn.textContent = 'Генеруємо посилання...';
            errorMsg.style.display = 'none';
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
                btn.disabled = false;
                btn.textContent = 'Оплатити участь';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
            });
        });
    });

    const liquidBg = document.getElementById('liquidBg');
    if (liquidBg) {
        const mobileQuery = window.matchMedia('(max-width: 768px)');
        let scrollTicking = false;

        const updateLiquidByScroll = () => {
            if (!mobileQuery.matches) {
                return;
            }

const scrollElement = document.documentElement;
const maxScroll = scrollElement.scrollHeight - window.innerHeight;
const currentScroll = window.pageYOffset || scrollElement.scrollTop || 0;
const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
          
            const x = 50 + Math.sin(progress * Math.PI * 2) * 12;
            const y = 35 + progress * 30;

            liquidBg.style.setProperty('--x', `${x}%`);
            liquidBg.style.setProperty('--y', `${y}%`);
        };

        const onScroll = () => {
            if (scrollTicking) {
                return;
            }
            scrollTicking = true;
            requestAnimationFrame(() => {
                updateLiquidByScroll();
                scrollTicking = false;
            });
        };

        const handlePointerMove = (e) => {
            if (mobileQuery.matches) {
                return;
            }
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;

            liquidBg.style.setProperty('--x', `${x}%`);
            liquidBg.style.setProperty('--y', `${y}%`);
        };

        document.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateLiquidByScroll);
        updateLiquidByScroll();
    }

    const enablePixelTrail = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;
    if (enablePixelTrail) {
        const trailCount = 14;
        const trail = [];
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        for (let i = 0; i < trailCount; i += 1) {
            const dot = document.createElement('div');
            dot.classList.add('pixel-trail-dot');
            dot.style.opacity = `${1 - i / trailCount}`;
            dot.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.04})`;
            document.body.appendChild(dot);
            trail.push({ element: dot, x: mouseX, y: mouseY });
        }

        const handleMouseMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        };

        const animateTrail = () => {
            let prevX = mouseX;
            let prevY = mouseY;

            trail.forEach((dot, index) => {
                const dx = prevX - dot.x;
                const dy = prevY - dot.y;
                dot.x += dx * 0.35;
                dot.y += dy * 0.35;
                dot.element.style.left = `${dot.x}px`;
                dot.element.style.top = `${dot.y}px`;
                prevX = dot.x;
                prevY = dot.y;

                if (index === 0) {
                    dot.element.style.opacity = '1';
                }
            });

            requestAnimationFrame(animateTrail);
        };

        document.addEventListener('mousemove', handleMouseMove);
        animateTrail();
    }

});
