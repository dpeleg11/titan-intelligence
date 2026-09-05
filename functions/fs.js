export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const path   = url.searchParams.get('path') || '';
  const params = url.searchParams.get('params') || '';
  const token  = url.searchParams.get('token') || '';

  if (!path || !token) {
    return new Response(JSON.stringify({error:'missing params'}), {
      status: 400, headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }

  try {
    const finnhubUrl = `https://finnhub.io/api/v1/${path}?${params}&token=${token}`;
    const r = await fetch(finnhubUrl);
    const data = await r.text();
    return new Response(data, {
      status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
}
