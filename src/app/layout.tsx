import { Cormorant, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export default function RootLayout({ children }: any) {
  return (
    <html lang="fr">
      <body className={`${cormorant.className} ${sourceSans.className}`}>
        {children}
      </body>
    </html>
  );
}