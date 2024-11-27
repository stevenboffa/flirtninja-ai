"use client";

import { MessageSquare, Heart, Camera, FileText, MessagesSquare, LogOut, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/auth-provider';
import { signOut } from '@/lib/auth-service';
import { toast } from 'sonner';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading || !user) return null;

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-base sm:text-lg nav-title">Ice Breaker</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 sm:h-9 sm:w-9 nav-button"
            >
              {theme === 'dark' ? (
                <span className="text-lg sm:text-xl">🌞</span>
              ) : (
                <span className="text-lg sm:text-xl">🌙</span>
              )}
            </Button>

            <Link href="/premium">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 nav-button text-yellow-500 hover:text-yellow-600 transition-colors"
              >
                <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 nav-button"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 sm:h-9 sm:w-9 nav-button"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bottom-nav">
        <div className="container h-full">
          <div className="flex items-center justify-around h-full">
            <Link href="/" className="flex-1">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 sm:py-2 sm:px-4"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Generate</span>
              </Button>
            </Link>

            <Link href="/conversations" className="flex-1">
              <Button
                variant={pathname === "/conversations" ? "default" : "ghost"}
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 sm:py-2 sm:px-4"
              >
                <MessagesSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Chats</span>
              </Button>
            </Link>

            <Link href="/scan" className="flex-1">
              <Button
                variant={pathname === "/scan" ? "default" : "ghost"}
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 sm:py-2 sm:px-4"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Scan</span>
              </Button>
            </Link>

            <Link href="/generate-profile" className="flex-1">
              <Button
                variant={pathname === "/generate-profile" ? "default" : "ghost"}
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 sm:py-2 sm:px-4"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Profile</span>
              </Button>
            </Link>

            <Link href="/saved" className="flex-1">
              <Button
                variant={pathname === "/saved" ? "default" : "ghost"}
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 sm:py-2 sm:px-4"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Saved</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}