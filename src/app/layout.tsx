import type { Metadata } from "next";
import "./globals.css";
import { StateProvider } from "../context/StateContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "BookRumors | Discover and Promote Books Online",
  description: "The ultimate marketing and promotion platform for published authors, publishers, and enthusiastic readers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StateProvider>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <Footer />
        </StateProvider>
      </body>
    </html>
  );
}
