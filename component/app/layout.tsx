// app/layout.tsx
import './globals.css'; // Your global styles
import Header from '@/components/Header';

export const metadata = {
  title: 'TradeXpress App',
  description: 'Your ultimate trading assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Placed here so it is shared across all pages */}
        <Header /> 
        
        <main style={{ minHeight: '80vh', padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}