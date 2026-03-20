import "./globals.css";
import "../components/styles/layout.css";
import { AuthProvider } from "@/context/AuthContext";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Maison de Parfum",
  description: "Where scent becomes artistry.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <AuthProvider>
          <SiteHeader />

            {children}

          <SiteFooter />

        </AuthProvider>
      </body>

    </html>
  );
}