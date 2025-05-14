import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const localeCookie = req.cookies.get("NEXT_LOCALE");
  const locale = process.env.APP_LANG || 'en';
  
  if (!localeCookie) {
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
