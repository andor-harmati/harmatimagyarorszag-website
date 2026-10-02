// Vercel serverless function: forwards contact form submissions to a form backend (Basin or Formspree),
// which emails them to the address configured on the form.
// Requires the FORMSPREE_ENDPOINT environment variable (set in the Vercel project settings).

const clean = (v, max) => String(v ?? '').trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    console.error('FORMSPREE_ENDPOINT is not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const company = clean(body.company, 200);
  const project = clean(body.project, 5000);
  const services = Array.isArray(body.services)
    ? body.services.slice(0, 20).map((s) => clean(s, 100)).filter(Boolean)
    : [];

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Name and a valid email are required' });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Új kapcsolatfelvétel: ${name}`,
        name,
        email,
        company: company || '—',
        services: services.length ? services.join(', ') : '—',
        message: project || '—',
      }),
    });

    if (!upstream.ok) {
      console.error('Form backend responded', upstream.status, await upstream.text());
      return res.status(502).json({ error: 'Failed to send' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(502).json({ error: 'Failed to send' });
  }
};
