import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "../components/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "On My Shelf",
  description: "Book tracker and stat web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
