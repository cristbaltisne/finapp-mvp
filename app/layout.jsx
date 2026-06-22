import "./globals.css";

export const metadata = {
  title: "FinApp MVP",
  description: "MVP digital de una app de finanzas personales para jóvenes chilenos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
