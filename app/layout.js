import { Fraunces, Karla, Special_Elite } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-special-elite",
  display: "swap",
});

export const metadata = {
  title: "Album Kenangan Rifaldi,Teman & Keluarga",
  description: "Buku kenangan digital Rifaldi,Teman & Keluarga — kumpulan foto dan cerita dari waktu ke waktu.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${karla.variable} ${specialElite.variable} font-body bg-cream text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
