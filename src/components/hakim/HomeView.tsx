'use client';

import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Ticket, 
  AlertTriangle, 
  Clock, 
  Users, 
  Phone,
  ArrowRight,
  Shield,
  CheckCircle
} from 'lucide-react';

export function HomeView() {
  const { setCurrentView, user } = useAppStore();

  const features = [
    {
      icon: Ticket,
      title: 'Book Queue Token',
      description: 'Get your place in line without waiting at the hospital',
      color: 'bg-teal-500',
      action: () => setCurrentView('hospitals'),
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Track your queue position and estimated wait time',
      color: 'bg-blue-500',
      action: () => setCurrentView('token-status'),
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Assist',
      description: 'Get instant triage guidance for medical emergencies',
      color: 'bg-red-500',
      action: () => setCurrentView('emergency'),
    },
    {
      icon: Phone,
      title: 'SMS Notifications',
      description: 'Receive alerts when your turn is approaching',
      color: 'bg-purple-500',
      action: () => setCurrentView('hospitals'),
    },
  ];

  const stats = [
    { label: 'Hospitals', value: '8+' },
    { label: 'Departments', value: '96+' },
    { label: 'Regions', value: '6' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
          🇪🇹 Ethiopian Healthcare System
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Skip the Wait,{' '}
          <span className="text-teal-600">Not Your Health</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Book queue tokens, track your position in real-time, and access emergency 
          medical guidance at Ethiopian public hospitals.
        </p>

        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => setCurrentView('hospitals')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Find Hospital
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setCurrentView('emergency')}
            >
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Emergency Assist
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => setCurrentView('hospitals')}
            >
              <Ticket className="mr-2 h-5 w-5" />
              Book Token
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setCurrentView('token-status')}
            >
              <Clock className="mr-2 h-5 w-5" />
              View My Tokens
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {stats.map((stat, i) => (
          <Card key={i} className="text-center border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-teal-600">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Card
              key={i} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-border"
              onClick={feature.action}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${feature.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How it Works */}
      <Card className="border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-center">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Select Hospital', desc: 'Choose from nearby hospitals' },
              { step: '2', title: 'Pick Department', desc: 'Select your required service' },
              { step: '3', title: 'Get Token', desc: 'Receive your queue number' },
              { step: '4', title: 'Track Position', desc: 'Get real-time updates' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-foreground flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Access */}
      <Card className="border-border bg-muted">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Hospital Administrator?</h3>
                <p className="text-sm text-muted-foreground">Access the admin portal to manage queues</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setCurrentView('admin-login')}
            >
              Admin Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
