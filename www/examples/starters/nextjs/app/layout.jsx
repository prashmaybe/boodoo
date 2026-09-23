import 'boodoo/dist/css/boodoo.min.css';

export const metadata = {
  title: 'boodoo Next.js Starter',
  description: 'Next.js App Router starter configured with boodoo CSS framework.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-boodoo-theme="light">
      <body>{children}</body>
    </html>
  );
}
