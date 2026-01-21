# Hoshovskyi.pro

Персональний сайт креативного фахівця з відеовиробництва та AI-технологій!.

## Про проект

Цей сайт демонструє креативні послуги та портфоліо робіт у сферах:
- Створення відеоконтенту
- AI-генерація медіа
- Креативні концепції для рекламних кампаній
- Консультації з використання AI в креативних проектах

## Контакти

- Email: contact@hoshovskyi.pro
- Місце розташування: Івано-Франківська область, Україна

## Оплата та реєстрації

### Змінні середовища

- `MONOBANK_TOKEN` — токен Monobank Merchant API.
- `MONOBANK_AMOUNT` — сума в копійках (наприклад, `100` = 1 грн).
- `KV_REST_API_URL` та `KV_REST_API_TOKEN` — автоматично додаються після створення Vercel KV.
- `REGISTRATIONS_API_KEY` — ключ доступу до списку реєстрацій.
- `RESEND_API_KEY` — ключ Resend для відправки листів (опційно).
- `RESEND_FROM` — email відправника (наприклад, `noreply@hoshovskyi.pro`).
- `RESEND_NOTIFY_TO` — email(и) для копії, через кому (опційно).

### Отримання списку реєстрацій

Після створення KV у Vercel можна запитати список реєстрацій через ендпоінт:

```
GET /api/registrations
Authorization: Bearer <REGISTRATIONS_API_KEY>
```

### CSV для Google Sheets

Щоб підключити таблицю, використайте CSV-ендпоінт і передайте ключ як параметр:

```
GET /api/registrations-csv?key=<REGISTRATIONS_API_KEY>
```

У Google Sheets можна вставити формулу:

```
=IMPORTDATA("https://hoshovskyi.pro/api/registrations-csv?key=<REGISTRATIONS_API_KEY>")
```

## Додавання фото лектора

1. Завантажте фото на будь-який хостинг з прямим URL (наприклад, imgbb або Cloudinary).
2. Скопіюйте пряме посилання на зображення.
3. Відкрийте `index.html` і замініть URL у блоці лектора:

```html
<img class="lecturer-photo" src="https://ваше-посилання-на-фото" alt="Василь Гошовський">
```

Фото відобразиться на сторінці автоматично.
