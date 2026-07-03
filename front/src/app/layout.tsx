import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import ChatBox from "@/features/chat/components/ChatBox";
import { CharacterProvider } from "@/shared/contexts/CharacterContext";
import { ToastProvider } from "@/shared/contexts/ToastContext";
import { AuthProvider } from "@/shared/hooks/useAuth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const starWars = localFont({
  src: [
    {
      path: "../../public/fonts/Starjedi.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-starwars",
});

export const metadata: Metadata = {
  title: {
    default: "Swor | Star Wars Roleplay",
    template: "%s | Swor"
  },
  description: "Rejoignez Swor, la plateforme de référence pour le roleplay Star Wars. Créez votre personnage, explorez la galaxie et participez à des aventures épiques dans une communauté passionnée.",
  keywords: ["Star Wars", "Roleplay", "Swor", "Jeu de rôle", "Forum RP", "Galaxie"],
  authors: [{ name: "Swor" }],
  openGraph: {
    title: "Swor | Star Wars Roleplay",
    description: "Vivez votre propre aventure Star Wars sur Swor.",
    url: "https://swor.fr",
    siteName: "Swor",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swor | Star Wars Roleplay",
    description: "Vivez votre propre aventure Star Wars sur Swor.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${outfit.variable} ${starWars.variable} font-sans bg-black min-h-screen text-gray-200 antialiased`}>
        <ToastProvider>
          <AuthProvider>
          <CharacterProvider>
            <div className="min-h-screen bg-black flex flex-col">
              <Header />
              <div className="forum-container flex-grow pt-4">
                <main className="px-4 py-8">
                  {children}
                </main>
                <Footer />
              </div>
              <ChatBox />
            </div>
          </CharacterProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

