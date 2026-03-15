import type { Metadata } from "next";
import "./globals.css";
import VortexBackground from "@/components/VortexBackground";

export const metadata: Metadata = {
  title: "DoctorBot — The Doctor Will See You Now",
  description: "An AI chatbot with the personality of The Doctor from Doctor Who",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <VortexBackground />
        {/* Vignette overlay for depth */}
        <div className="fixed inset-0 pointer-events-none z-10 vignette" />
        {children}
      </body>
    </html>
  );
}
