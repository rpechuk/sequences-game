import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onStatsClick?: () => void;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onHowToPlayClick?: () => void;
  currentPlayingDate?: string | null;
}

export function Layout({ children, onStatsClick, onMenuClick, onSettingsClick, onHowToPlayClick, currentPlayingDate }: LayoutProps) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-background text-primary">
      <Header 
        onStatsClick={onStatsClick} 
        onMenuClick={onMenuClick} 
        onSettingsClick={onSettingsClick} 
        onHowToPlayClick={onHowToPlayClick}
        currentPlayingDate={currentPlayingDate}
      />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center justify-between overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
