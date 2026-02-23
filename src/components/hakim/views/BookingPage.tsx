'use client';

import { ArrowLeft, Stethoscope, MapPin } from '@phosphor-icons/react';
import type { Hospital, Department } from '@/types';
import type { ViewType } from '../routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BookingPageProps {
  darkMode: boolean;
  loading: boolean;
  selectedHospital: Hospital | null;
  selectedDepartment: Department | null;
  notes: string;
  setNotes: (value: string) => void;
  isAuthenticated: boolean;
  onBook: () => void;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  t: Record<string, string>;
}

export function BookingPage({
  darkMode,
  loading,
  selectedHospital,
  selectedDepartment,
  notes,
  setNotes,
  isAuthenticated,
  onBook,
  onNavigate,
  navigation,
  footer,
  t,
}: BookingPageProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-8 transition-colors duration-300 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Button
              onClick={() => onNavigate('departments')}
              variant="ghost"
              className="flex items-center gap-2 transition mb-6 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
              {t.backToDepartments}
            </Button>

            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
              {t.completeBooking}
            </h1>
            <p className="text-muted-foreground">
              {t.bookingSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hospital</p>
                  <p className="font-semibold text-foreground">{selectedHospital?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                  <Stethoscope size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-semibold text-foreground">{selectedDepartment?.name}</p>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <p className="text-sm font-semibold text-foreground">Sign in required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please sign in to book a token and receive queue updates.
                </p>
                <Button className="mt-4 rounded-xl" onClick={() => onNavigate('auth')}>
                  Sign In to Continue
                </Button>
              </div>
            )}

            <div className="mt-6">
              <Label className="text-sm font-medium mb-2" htmlFor="booking-notes">
                {t.notesOptional}
              </Label>
              <Textarea
                id="booking-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl min-h-[120px]"
                placeholder={t.notesPlaceholder}
              />
            </div>

            <div className="mt-8">
              <Button
                onClick={onBook}
                disabled={loading || !isAuthenticated}
                size="lg"
                className="w-full rounded-xl text-lg"
              >
                {loading ? t.bookingSubmitting : t.getMyToken}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
