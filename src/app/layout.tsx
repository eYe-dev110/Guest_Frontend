import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { NextIntlClientProvider } from "next-intl";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <NextIntlClientProvider>
            <AuthProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
      {/* <Script
        src="./assets/vendor/preline/dist/preline.js"
        strategy="afterInteractive"
      /> */}
    </html>
  );
}
