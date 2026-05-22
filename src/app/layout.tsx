import { Roboto } from 'next/font/google';
import './globals.css'; 
import ReduxProvider from '@/store/ReduxProvider';


const roboto = Roboto({
  weight: ['400', '500', '700'], 
  subsets: ['latin', 'cyrillic'], 
  variable: '--font-roboto',      
  display: 'swap',                
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">     
      <body className={roboto.className}>
        <ReduxProvider>
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}