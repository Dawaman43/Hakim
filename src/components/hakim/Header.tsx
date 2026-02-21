'use client';

import Image from 'next/image';
import { useAppStore, type ViewType } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const { user, logout, currentView, setCurrentView } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    if (user && (user.role === 'HOSPITAL_ADMIN' || user.role === 'SUPER_ADMIN')) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-login');
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-teal-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/logo.png" 
              alt="Hakim Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-teal-700">Hakim</h1>
              <p className="text-xs text-teal-600">Healthcare Queue Manager</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role === 'PATIENT' ? 'Patient' : user.role === 'HOSPITAL_ADMIN' ? 'Admin' : 'Super Admin'}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleAdminClick}>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Portal
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleAdminClick}>
                <Shield className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={handleAdminClick}
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Admin Portal
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={handleAdminClick}
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Admin Portal
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
