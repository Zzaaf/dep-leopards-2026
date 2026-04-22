import "./globals.css";
import type { Metadata } from "next";
import { Nav, Footer } from "@/widgets";
import { ReduxProvider } from "@/app/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "Next.js Blog",
  description: "Next.js Blog",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <div className="app-shell">
            <Nav />
            <main className="app-main">{children}</main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
