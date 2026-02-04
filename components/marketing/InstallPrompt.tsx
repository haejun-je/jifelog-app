
import React, { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isStandalone = useMemo(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    return (window.navigator as { standalone?: boolean }).standalone === true;
  }, []);

  useEffect(() => {
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

  if (!isVisible || !deferredPrompt) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <button
      onClick={handleInstall}
      className="inline-flex items-center gap-2 bg-teal-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-colors"
    >
      <Download size={16} />
      앱 다운로드
    </button>
  );
};

export default InstallPrompt;
