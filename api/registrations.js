export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.REGISTRATIONS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing REGISTRATIONS_API_KEY' });
  }

  if (req.headers.authorization !== `Bearer ${apiKey}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ message: 'Missing Vercel KV configuration' });
  }

  try {
    const { kv } = await import('@vercel/kv');
    const registrations = await kv.lrange('registrations', 0, 199);
    return res.status(200).json({ registrations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch registrations' });
  }
}
