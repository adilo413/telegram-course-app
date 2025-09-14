'use client';

import { useEffect, useState, useCallback } from 'react';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the WebApp
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const tg = (window as any).Telegram?.WebApp;
        
        if (!tg) {
          setError('Telegram WebApp not found');
          setIsLoading(false);
          return;
        }

        setWebApp(tg);
        
        // Expand the WebApp to full height
        tg.expand();
        
        // Get user data
        const userData = tg.initDataUnsafe?.user;
        if (userData) {
          setUser(userData);
        } else {
          setError('Failed to load user data');
        }
        
        // Notify Telegram that the WebApp is ready
        tg.ready();
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error initializing Telegram WebApp:', err);
      setError('Failed to initialize Telegram WebApp');
      setIsLoading(false);
    }
  }, []);

  // Close the WebApp
  const closeApp = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  // Show a popup
  const showPopup = useCallback((message: string, buttons: Array<{ id: string; text: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive' }>) => {
    return new Promise<string | null>((resolve) => {
      if (webApp) {
        webApp.showPopup(
          {
            message,
            buttons: buttons.map(btn => ({
              id: btn.id,
              type: btn.type || 'default',
              text: btn.text,
            })),
          },
          (buttonId: string) => {
            resolve(buttonId);
          }
        );
      } else {
        resolve(null);
      }
    });
  }, [webApp]);

  // Show an alert
  const showAlert = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      if (webApp) {
        webApp.showAlert(message, resolve);
      } else {
        console.warn('WebApp not initialized, alert not shown:', message);
        resolve();
      }
    });
  }, [webApp]);

  // Show a confirmation dialog
  const showConfirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } else {
        console.warn('WebApp not initialized, using browser confirm');
        resolve(window.confirm(message));
      }
    });
  }, [webApp]);

  // Set the main button text and click handler
  const setupMainButton = useCallback((text: string, onClick: () => void) => {
    if (!webApp) return { show: () => {}, hide: () => {} };
    
    const { MainButton } = webApp;
    
    // Remove previous click handlers
    MainButton.offClick(onClick);
    
    // Set button text
    MainButton.setText(text);
    
    // Add new click handler
    MainButton.onClick(onClick);
    
    // Show the button
    MainButton.show();
    
    // Return controls for showing/hiding the button
    return {
      show: () => MainButton.show(),
      hide: () => MainButton.hide(),
      enable: () => MainButton.enable(),
      disable: () => MainButton.disable(),
      showProgress: () => MainButton.showProgress(),
      hideProgress: () => MainButton.hideProgress(),
    };
  }, [webApp]);

  // Set up back button
  const setupBackButton = useCallback((onClick: () => void) => {
    if (!webApp) return { show: () => {}, hide: () => {} };
    
    const { BackButton } = webApp;
    
    // Remove previous click handlers
    BackButton.offClick(onClick);
    
    // Add new click handler
    BackButton.onClick(onClick);
    
    // Show the button
    BackButton.show();
    
    // Return controls for showing/hiding the button
    return {
      show: () => BackButton.show(),
      hide: () => BackButton.hide(),
    };
  }, [webApp]);

  // Haptic feedback
  const hapticFeedback = useCallback((type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning') => {
    if (!webApp) return;
    
    const { HapticFeedback } = webApp;
    
    switch (type) {
      case 'impact':
        HapticFeedback.impactOccurred(style || 'medium');
        break;
      case 'notification':
        HapticFeedback.notificationOccurred(style as any || 'success');
        break;
      case 'selection':
        HapticFeedback.selectionChanged();
        break;
    }
  }, [webApp]);

  // Send data to bot
  const sendData = useCallback((data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  }, [webApp]);

  // Open link
  const openLink = useCallback((url: string) => {
    if (webApp) {
      webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }, [webApp]);

  return {
    webApp,
    user,
    isLoading,
    error,
    closeApp,
    showPopup,
    showAlert,
    showConfirm,
    setupMainButton,
    setupBackButton,
    hapticFeedback,
    sendData,
    openLink,
  };
};
