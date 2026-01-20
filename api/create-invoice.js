export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email } = req.body;
  const amount = Number.parseInt(process.env.MONOBANK_AMOUNT, 10) || 100;

  const registerParticipant = async () => {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return;
    }

    const { kv } = await import('@vercel/kv');
    await kv.lpush('registrations', {
      name,
      email,
      amount,
      createdAt: new Date().toISOString(),
    });
  };

  const sendRegistrationEmail = async () => {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
      return;
    }

    const payload = {
      from: process.env.RESEND_FROM,
      to: [email],
      subject: 'Реєстрація отримана',
      html: `
        <p>Привіт, ${name}!</p>
        <p>Ми отримали вашу реєстрацію. Дякуємо!</p>
        <p>Сума: ${amount / 100} грн.</p>
      `,
    };

    if (process.env.RESEND_NOTIFY_TO) {
      payload.bcc = process.env.RESEND_NOTIFY_TO.split(',').map((item) => item.trim()).filter(Boolean);
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  };

  try {
    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': process.env.MONOBANK_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        ccy: 980,
        merchantPaymInfo: {
          reference: `lecture_${Date.now()}`,
          destination: 'Оплата за лекцію: AI Video Generation',
          comment: `Учасник: ${name} (${email})`,
          basketOrder: [
            {
              name: 'Онлайн-лекція: AI Video Generation',
              qty: 1,
              sum: amount,
              icon: 'https://hoshovskyi.pro/favicon.ico',
              unit: 'шт.',
            },
          ],
        },
        redirectUrl: 'https://hoshovskyi.pro/success.html',
        webHookUrl: 'https://hoshovskyi.pro/api/webhook',
        validity: 3600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errDescription || 'Помилка створення інвойсу');
    }

    await registerParticipant();
    await sendRegistrationEmail();
    
    return res.status(200).json({ pageUrl: data.pageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}