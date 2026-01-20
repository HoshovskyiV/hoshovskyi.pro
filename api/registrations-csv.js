const escapeCsvValue = (value) => {
  const text = String(value ?? '');
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.REGISTRATIONS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing REGISTRATIONS_API_KEY' });
  }

  const headerAuth = req.headers.authorization === `Bearer ${apiKey}`;
  const queryAuth = req.query.key === apiKey;

  if (!headerAuth && !queryAuth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ message: 'Missing Vercel KV configuration' });
  }

  try {
    const { kv } = await import('@vercel/kv');
    const registrations = await kv.lrange('registrations', 0, 999);

    const rows = [
      ['name', 'email', 'amount_uah', 'created_at'],
      ...registrations.map((item) => [
        item?.name ?? '',
        item?.email ?? '',
        (Number(item?.amount || 0) / 100).toFixed(2),
        item?.createdAt ?? '',
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch registrations' });
  }
}
