import { NextResponse } from "next/server";

export function middleware(request) {
  const csrfToken = request.cookies.get("csrf_access_token");
  const url = request.nextUrl.clone();

  console.log("middleware test", csrfToken);

  if (!csrfToken && url.pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/users/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
