export const runtime = "edge";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power Soul Fitness - Keep Your Body Fit & Strong",
  description: "Recognize your super powers with us. Build strength like superman, lift weight like thor's hammer.",
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
          precedence="default"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
