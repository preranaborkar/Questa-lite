// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Since we're using JWT tokens, signout is handled client-side
  // The client should remove the token from storage
  return NextResponse.json({
    message: 'Signed out successfully'
  });
}