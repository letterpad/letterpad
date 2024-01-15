import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next')!;
  const origin = req.nextUrl.searchParams.get('origin')!;

  // Check if there is a 'next' URL
  if (next) {
    const response = NextResponse.redirect(decodeURIComponent(next), {
      status: 302,
    });
    response.cookies.delete('next-auth.session-token');
    return response;
  } else {
    // If no more 'next' URL, redirect back to the 'origin'
    const response = NextResponse.redirect(decodeURIComponent(origin), {
      status: 302,
    });
    response.cookies.delete('next-auth.session-token');
    return response;
  }
}
