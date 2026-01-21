import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setSupportsPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed or not supported
  if (isInstalled || (!supportsPWA && !isIOS)) {
    return null;
  }

  return (
    <>
      {/* Floating Install Button */}
      <Button
        onClick={handleInstallClick}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 animate-in slide-in-from-bottom-4 duration-500"
        size="icon"
        aria-label="Instalar aplicativo"
      >
        <Download className="h-6 w-6" />
      </Button>

      {/* iOS Installation Modal */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="max-w-sm backdrop-blur-sm bg-background/95">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Download className="h-5 w-5 text-primary" />
              Instalar no iOS
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              O iOS não permite instalação automática. Siga os passos abaixo:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <div className="space-y-1">
                <p className="font-medium">Toque no botão Compartilhar</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Share className="h-5 w-5 text-primary" />
                  <span>Na barra inferior do Safari</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                2
              </div>
              <div className="space-y-1">
                <p className="font-medium">Adicionar à Tela de Início</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlusSquare className="h-5 w-5 text-primary" />
                  <span>Role para baixo e selecione</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowIOSModal(false)} 
            className="w-full"
          >
            Entendi
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallPWA;
