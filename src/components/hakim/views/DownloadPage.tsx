'use client';

import { DownloadSimple, DeviceMobile, Sparkle } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DownloadPageProps {
  darkMode: boolean;
  navigation: React.ReactNode;
  footer: React.ReactNode;
}

export function DownloadPage({ navigation, footer }: DownloadPageProps) {
  const [waitlistValue, setWaitlistValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitWaitlist = async () => {
    const value = waitlistValue.trim();
    if (!value) {
      toast.error('Enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: value }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to join waitlist.');
      }
      toast.success('You are on the waitlist. Check your email for confirmation.');
      setWaitlistValue('');
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {navigation}

      <section className="pt-12 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border border-primary/10">
                  <Sparkle size={14} className="mr-2" />
                  Mobile App
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Download the Hakim App
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  The Hakim mobile app is coming soon. We are polishing the experience so it is fast, reliable,
                  and built for Ethiopia.
                </p>
                <div className="rounded-2xl border border-border bg-background p-4 sm:p-5 max-w-xl">
                  <p className="text-sm font-semibold text-foreground">Join the waitlist</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get early access and priority app experience when we launch.
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="h-11"
                      value={waitlistValue}
                      onChange={(e) => setWaitlistValue(e.target.value)}
                    />
                    <Button
                      className="h-11 rounded-xl"
                      onClick={submitWaitlist}
                      disabled={submitting}
                    >
                      {submitting ? 'Joining...' : 'Join Waitlist'}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button size="lg" className="rounded-xl" disabled>
                    <DeviceMobile size={18} className="mr-2" />
                    iOS App (Coming Soon)
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl" disabled>
                    <DownloadSimple size={18} className="mr-2" />
                    Android App (Coming Soon)
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <DeviceMobile size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">App Status</p>
                    <p className="text-sm text-muted-foreground">In development</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We will announce the launch here. For now, you can book tokens using the web app.
                </p>
                <div className="mt-4">
                  <Button className="w-full rounded-xl" onClick={() => window.location.href = '/hospitals'}>
                    Book on Web
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
