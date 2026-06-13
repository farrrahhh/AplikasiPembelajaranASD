export async function POST(request, { params }) {
  const { slug } = await params;
  const body = await request.json();
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chat/${slug}`,
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
