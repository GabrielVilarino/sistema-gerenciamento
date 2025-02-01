import { Inter } from 'next/font/google';
import "./globals.css";

// Configuração da fonte Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Templária",
  description: "Sistema de Gerenciamento de Usuários e Vendas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link
          rel="shortcut icon"
          href="/logo.ico"
          type="image/x-icon"
        />
      </head>
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}

