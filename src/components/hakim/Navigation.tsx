'use client';

import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building2, 
  Ticket, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  { id: 'token-status', label: 'My Tokens', icon: Ticket },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
] as const;

export function Navigation() {
  const { currentView, setCurrentView, user } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center gap-1 px-4 py-2 h-auto ${
                  isActive 
                    ? 'text-teal-600 bg-teal-50' 
                    : 'text-muted-foreground hover:text-teal-600'
                }`}
                onClick={() => setCurrentView(item.id as never)}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-teal-600' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
