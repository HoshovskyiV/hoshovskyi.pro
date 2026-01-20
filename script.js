// Мобільне меню
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Закриття мобільного меню при кліку на посилання
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Зміна розміру хедера при скролі
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
    } else {
        header.style.padding = '20px 0';
    }
});

// Фільтрація портфоліо
const tabBtns = document.querySelectorAll('.tab-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Видалення класу active з усіх кнопок
        tabBtns.forEach(btn => btn.classList.remove('active'));
        
        // Додавання класу active до натиснутої кнопки
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Фільтрація елементів портфоліо
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Автопрокрутка слайдера відгуків
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonials = document.querySelectorAll('.testimonial');
let currentIndex = 0;

function autoScroll() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    testimonialsSlider.scrollTo({
        left: testimonials[currentIndex].offsetLeft,
        behavior: 'smooth'
    });
}

// Запуск автопрокрутки кожні 5 секунд
setInterval(autoScroll, 5000);

// Обробка форми реєстрації
const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Збір даних форми
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Тут можна додати код для відправки даних на сервер
    
    // Відображення повідомлення про успішну реєстрацію
    alert('Дякуємо за реєстрацію! Ми зв’яжемося з вами найближчим часом.');
    
    // Очищення форми
    registrationForm.reset();
});

// Анімація при скролі
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 150) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Початкові стилі для анімації
document.querySelectorAll('section').forEach(section => {
    if (section !== document.querySelector('.hero')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
});

// Запуск анімації при завантаженні та скролі
window.addEventListener('load', revealOnScroll);
window.addEventListener('scroll', revealOnScroll);
