import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white min-h-screen">
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-bold">SSL Certificate Checker</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="bg-white text-center p-4 shadow mt-auto">
          <p>&copy; 2024 SSL Checker</p>
        </footer>
      </body>
    </html>
  );
}
