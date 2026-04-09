import { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params
  const indexNowKey = "83edeaacde3bee733f33bc9fbe324fd6"

  if (!indexNowKey || key !== indexNowKey) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(indexNowKey, {
    headers: { "Content-Type": "text/plain" },
  })
}
