document.addEventListener('DOMContentLoaded', () => {
    // Pixel morphing canvas (hero board)
    initPixelMorph();

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

    function initPixelMorph() {
        const canvas = document.getElementById('morphCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 26x26 silhouettes (solid pixel masses) for modern-retro morphing.
        const SHAPES = [
            {
                color: '#B7FF00',
                map: [
                    '00000000000111100000000000',
                    '00000000011111111000000000',
                    '00000000111111111100000000',
                    '00000001111111111110000000',
                    '00000011111111111111000000',
                    '00000111111111111111100000',
                    '00001111111111111111110000',
                    '00011111111111111111111000',
                    '00111111111111111111111100',
                    '00111111111111111111111100',
                    '00111111111111111111111100',
                    '00011111111111111111111000',
                    '00001111111111111111110000',
                    '00000111111111111111100000',
                    '00000011111111111111000000',
                    '00000001111111111110000000',
                    '00000000111111111100000000',
                    '00000000011111111000000000',
                    '00000000000111100000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000'
                ]
            },
            {
                color: '#00D0FF',
                map: [
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000011111111111111000000',
                    '00000011111111111111000000',
                    '00000011111111111111000000',
                    '00000011111111111111000000',
                    '00000011111111111111000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000111110000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000'
                ]
            },
            {
                color: '#FF2D9E',
                map: [
                    '00000000000000000000000000',
                    '00000000001100000011000000',
                    '00000000011110000111100000',
                    '00000000111111001111110000',
                    '00000001111111111111111000',
                    '00000011111111111111111100',
                    '00000111111111111111111110',
                    '00001111111111111111111111',
                    '00011111111111111111111111',
                    '00111111111111111111111111',
                    '01111111111111111111111110',
                    '01111111111111111111111100',
                    '00111111111111111111111000',
                    '00011111111111111111110000',
                    '00001111111111111111100000',
                    '00000111111111111111000000',
                    '00000011111111111110000000',
                    '00000001111111111100000000',
                    '00000000111111111000000000',
                    '00000000011111110000000000',
                    '00000000001111100000000000',
                    '00000000000111000000000000',
                    '00000000000010000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000',
                    '00000000000000000000000000'
                ]
            },
            {
                color: '#FFD400',
                map: [
                    '00000000000000000000000000',
                    '00000000000001100000000000',
                    '00000000000011110000000000',
                    '00000000000111111000000000',
                    '00000000001111111100000000',
                    '00000000011111111110000000',
                    '00000000111111111111000000',
                    '00000001111111111111100000',
                    '00000011111111111111110000',
                    '00000111111111111111111000',
                    '00001111111111111111111100',
                    '00011111111111111111111110',
                    '00111111111111111111111111',
                    '00111111111111111111111111',
                    '00011111111111111111111110',
                    '00001111111111111111111100',
                    '00000111111111111111111000',
                    '00000011111111111111110000',
                    '00000001111111111111100000',
                    '00000000111111111111000000',
                    '00000000011111111110000000',
                    '00000000001111111100000000',
                    '00000000000111111000000000',
                    '00000000000011110000000000',
                    '00000000000001100000000000',
                    '00000000000000000000000000'
                ]
            }
        ];

        const GRID = 26;

        const mapToPoints = (rows) => {
            const pts = [];
            for (let y = 0; y < rows.length; y++) {
                const row = rows[y];
                for (let x = 0; x < row.length; x++) {
                    if (row[x] === '1') pts.push({ x, y });
                }
            }
            // A stable ordering keeps morphs readable.
            pts.sort((a, b) => (a.y - b.y) || (a.x - b.x));
            return pts;
        };

        const normalize = (pts, n) => {
            if (pts.length === n) return pts.slice();
            if (pts.length > n) {
                const out = [];
                const step = pts.length / n;
                for (let i = 0; i < n; i++) out.push(pts[Math.floor(i * step)]);
                return out;
            }
            // Duplicate evenly (keeps silhouette density constant during morph).
            const out = pts.slice();
            let i = 0;
            while (out.length < n) {
                out.push(pts[i % pts.length]);
                i++;
            }
            return out;
        };

        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        let dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        let w = 0;
        let h = 0;
        let px = 12;
        let ox = 0;
        let oy = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            w = Math.max(320, Math.floor(rect.width));
            h = Math.max(320, Math.floor(rect.height));
            dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const size = Math.min(w, h);
            px = Math.max(8, Math.floor(size / (GRID + 6)));
            const gridW = GRID * px;
            const gridH = GRID * px;
            ox = Math.floor((w - gridW) / 2);
            oy = Math.floor((h - gridH) / 2);
        };

        const drawFrame = (mix, aPts, bPts, color) => {
            // flat background
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // outline frame (editorial)
            ctx.strokeStyle = '#262626';
            ctx.lineWidth = 2;
            ctx.strokeRect(8, 8, w - 16, h - 16);

            ctx.fillStyle = color;
            const n = Math.min(aPts.length, bPts.length);
            for (let i = 0; i < n; i++) {
                const ax = aPts[i].x;
                const ay = aPts[i].y;
                const bx = bPts[i].x;
                const by = bPts[i].y;
                const x = ax + (bx - ax) * mix;
                const y = ay + (by - ay) * mix;
                ctx.fillRect(ox + x * px, oy + y * px, px, px);
            }

            // micro pixel accents (not only silhouettes)
            ctx.fillStyle = '#00D0FF';
            ctx.fillRect(16, h - 34, 10, 10);
            ctx.fillStyle = '#FF2D9E';
            ctx.fillRect(32, h - 34, 10, 10);
            ctx.fillStyle = '#FFD400';
            ctx.fillRect(w - 42, 16, 10, 10);
        };

        const points = SHAPES.map(s => ({ color: s.color, pts: mapToPoints(s.map) }));
        const maxCount = Math.max(...points.map(p => p.pts.length));
        points.forEach(p => { p.pts = normalize(p.pts, maxCount); });

        let iA = 0;
        let iB = 1;
        let start = performance.now();
        const morphMs = prefersReduced ? 1 : 1700;
        const holdMs = prefersReduced ? 0 : 850;

        resize();
        const ro = new ResizeObserver(() => resize());
        ro.observe(canvas);

        const tick = (now) => {
            const t = now - start;
            const phase = t < morphMs ? 'morph' : (t < morphMs + holdMs ? 'hold' : 'next');

            if (phase === 'next') {
                iA = iB;
                iB = (iB + 1) % points.length;
                start = now;
            }

            const mix = phase === 'morph' ? ease(Math.min(1, t / morphMs)) : 1;
            const color = points[iB].color;
            drawFrame(mix, points[iA].pts, points[iB].pts, color);

            if (!prefersReduced) requestAnimationFrame(tick);
        };

        // One frame for reduced motion.
        if (prefersReduced) {
            drawFrame(1, points[iA].pts, points[iB].pts, points[iB].color);
        } else {
            requestAnimationFrame(tick);
        }
    }
});
