export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  const key = url.searchParams.get('token');
  
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const r = await fetch(`https://finnhub.io/api/v1/${endpoint}&token=${key}`);
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
