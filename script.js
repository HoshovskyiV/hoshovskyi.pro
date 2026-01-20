document.addEventListener('DOMContentLoaded', () => {
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
                btn.textContent = 'Оплатити через Monobank';
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
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;

            liquidBg.style.setProperty('--x', `${x}%`);
            liquidBg.style.setProperty('--y', `${y}%`);
        });
    }
});
