import { useState, useEffect } from 'react';
import { Section, User } from '@/types';
import type { Notification } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import TickerNews from '@/components/TickerNews';
import HomeSection from '@/components/sections/HomeSection';
import LoginSection from '@/components/sections/LoginSection';
import LearnSection from '@/components/sections/LearnSection';
import QuizSection from '@/components/sections/QuizSection';
import GameSection from '@/components/sections/GameSection';
import TrackingSection from '@/components/sections/TrackingSection';
import GeoUploadSection from '@/components/sections/GeoUploadSection';
import PurchaseSection from '@/components/sections/PurchaseSection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        message: 'Waste collection scheduled for your area at 10:00 AM tomorrow',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'info'
      },
      {
        id: '2',
        message: 'New composting workshop available - join now!',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        type: 'success'
      },
      {
        id: '3',
        message: 'Vehicle WM002 is running 15 minutes late in Sector 23',
        date: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        type: 'warning'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You'll receive updates about waste collection and services.",
          });
        }
      });
    }
  }, [toast]);

  const handleLogin = (username: string, password: string, type: 'worker' | 'authority') => {
    // Mock authentication - in real app, this would call Supabase auth
    const mockUser: User = {
      id: `${type}_${Date.now()}`,
      username,
      type
    };
    
    setUser(mockUser);
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${username}!`,
    });

    // Add login notification
    const loginNotification: Notification = {
      id: Date.now().toString(),
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} ${username} logged in successfully`,
      date: new Date(),
      type: 'success'
    };
    
    setNotifications(prev => [loginNotification, ...prev]);
    
    // Navigate to home after login
    setActiveSection('home');
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    
    // Add some interactive feedback
    if (section === 'quiz') {
      toast({
        title: "Quiz Mode",
        description: "Test your waste management knowledge!",
      });
    } else if (section === 'game') {
      toast({
        title: "Game Zone",
        description: "Have fun while learning about waste sorting!",
      });
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection notifications={notifications} />;
      case 'worker-login':
        return <LoginSection type="worker" onLogin={handleLogin} />;
      case 'authority-login':
        return <LoginSection type="authority" onLogin={handleLogin} />;
      case 'learn':
        return <LearnSection />;
      case 'quiz':
        return <QuizSection />;
      case 'game':
        return <GameSection />;
      case 'tracking':
        return <TrackingSection />;
      case 'geo-upload':
        return <GeoUploadSection />;
      case 'purchase':
        return <PurchaseSection />;
      default:
        return <HomeSection notifications={notifications} />;
    }
  };

  const getSectionBackground = () => {
    const greenSections: Section[] = ['home', 'authority-login', 'quiz', 'tracking', 'purchase'];
    return greenSections.includes(activeSection) ? 'bg-accent/30' : 'bg-secondary/10';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
      <TickerNews />
      
      <main className={`${getSectionBackground()} min-h-[calc(100vh-200px)] transition-colors duration-300`}>
        <div className="container mx-auto py-8">
          {/* User Status Bar */}
          {user && (
            <div className="max-w-6xl mx-auto px-6 mb-6">
              <div className="bg-card rounded-lg p-4 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    Logged in as {user.type.charAt(0).toUpperCase() + user.type.slice(1)}: {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="animate-fadeIn">
            {renderActiveSection()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-primary mb-4">Smart Waste Management</h3>
              <p className="text-sm text-muted-foreground">
                Building a cleaner, greener future through intelligent waste management solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveSection('learn')} className="hover:text-primary transition-colors">Learn Waste Management</button></li>
                <li><button onClick={() => setActiveSection('tracking')} className="hover:text-primary transition-colors">Track Vehicles</button></li>
                <li><button onClick={() => setActiveSection('geo-upload')} className="hover:text-primary transition-colors">Report Issues</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: support@smartwaste.gov.in<br />
                Phone: 1800-123-WASTE<br />
                Emergency: 108
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
            © 2024 Smart Waste Management Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;