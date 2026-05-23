export async function POST(request) {
  const body = await request.json();
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/latihan/aplikasi/generate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await backendRes.json();
  if (!backendRes.ok) {
    return Response.json({ error: data.detail ?? 'Backend error' }, { status: 500 });
  }
  return Response.json(data);
}
