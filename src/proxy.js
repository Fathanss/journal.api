import {NextRequest, NextResponse } from "next/server";

export function proxy(request ) {
  const { pathname } = request.nextUrl;
  console.log("Proxy executed:", request.nextUrl.pathname);

  // 1. Get the role from cookies
  const userRole = request.cookies.get("userRole")?.value;
  console.log("User role from cookies:", userRole);

  // 2. Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      // Redirect to login or unauthorized page if not an admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Protect Student routes
  if (pathname.startsWith("/student")) {
    if (userRole !== "student") {
      // Redirect to login or unauthorized page if not a student
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to continue if they have the right role
  return NextResponse.next();
}

// 4. Configure which paths trigger this middleware
export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
