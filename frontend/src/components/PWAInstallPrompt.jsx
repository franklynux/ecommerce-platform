// src/components/PWAInstallPrompt.jsx
import React, { useState, useEffect } from 'react';

export const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h3 className="font-semibold text-lg mb-2">Install Pet Shop App</h3>
      <p className="text-gray-600 mb-4">Install our app for a better experience and offline access to our store.</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Install
        </button>
      </div>
    </div>
  );
};