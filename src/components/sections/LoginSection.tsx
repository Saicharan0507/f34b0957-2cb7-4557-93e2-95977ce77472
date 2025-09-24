import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginSectionProps {
  type: 'worker' | 'authority';
  onLogin?: (username: string, password: string, type: 'worker' | 'authority') => void;
}

const LoginSection = ({ type, onLogin }: LoginSectionProps) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onLogin) {
        onLogin(username, password, type);
      } else {
        // Mock authentication
        setMessage(`Welcome ${username}! Login successful.`);
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = type === 'worker' ? User : Shield;
  const title = type === 'worker' ? t('worker_login') : t('authority_login');
  const cardVariant = type === 'worker' ? 'bg-gradient-secondary' : 'bg-gradient-primary';

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className={`${cardVariant} border-0 shadow-xl`}>
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-card">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-card font-medium">
                {t('username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('username')}
                className="mt-1 bg-card/90 border-card/20"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-card font-medium">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('password')}
                className="mt-1 bg-card/90 border-card/20"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-card text-primary hover:bg-card/90 font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : t('login_button')}
            </Button>
          </form>
          
          {message && (
            <Alert className={message.includes('Welcome') ? 'border-success text-success' : 'border-destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSection;