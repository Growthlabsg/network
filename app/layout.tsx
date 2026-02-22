import type { Metadata } from 'next';
import './globals.css';
import { NetworkShell } from '@/components/network/network-shell';
import { MessagesProvider } from '@/contexts/messages-context';

export const metadata: Metadata = {
  title: 'Network | GrowthLab',
  description: 'Discover startups, find co-founders, connect with investors and mentors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MessagesProvider>
          <NetworkShell>{children}</NetworkShell>
        </MessagesProvider>
      </body>
    </html>
  );
}
