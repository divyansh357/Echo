import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { PermissionScreen } from './components/PermissionScreen';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { UserCredentials } from './types';
import { ThemeProvider } from './ThemeContext';

type AppStep = 'LANDING' | 'LOGIN' | 'PERMISSIONS' | 'DASHBOARD';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('LANDING');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [credentials, setCredentials] = useState<UserCredentials>({});

  const handleGetStarted = () => {
    setStep('LOGIN');
  };

  const handleLogin = (name: string) => {
    setUser({ name });
    setStep('PERMISSIONS');
  };

  const handlePermissionContinue = (creds: UserCredentials) => {
    setCredentials(creds);
    setStep('DASHBOARD');
  };

  return (
    <ThemeProvider>
      {step === 'LANDING' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {step === 'LOGIN' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {step === 'PERMISSIONS' && (
        <PermissionScreen onContinue={handlePermissionContinue} />
      )}

      {step === 'DASHBOARD' && user && (
        <Dashboard userName={user.name} credentials={credentials} />
      )}
    </ThemeProvider>
  );
};

export default App;