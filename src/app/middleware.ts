import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  // Handle simple requests
  const response = NextResponse.next();
  return response;
}
