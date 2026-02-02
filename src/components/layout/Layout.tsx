import { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Navigation */}
        {showNavigation && <Navigation />}

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
