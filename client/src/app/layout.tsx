import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/provider";

export const metadata: Metadata = {
  title: "GadgetGalaxy",
  description: "Make your own dream!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[rgba(247,245,245,0.93)] ">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
