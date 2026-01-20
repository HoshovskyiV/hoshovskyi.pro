export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email } = req.body;
  const amount = 50000;

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
        redirectUrl: 'https://hoshovskyi.pro/success',
        webHookUrl: 'https://hoshovskyi.pro/api/webhook',
        validity: 3600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errDescription || 'Помилка створення інвойсу');
    }

    return res.status(200).json({ pageUrl: data.pageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
