import { useEffect, useState } from "react";
import { X } from "lucide-react"; // Using lucide-react icons, you can use any icon library

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Check if user previously dismissed the prompt
      const dismissed = localStorage.getItem("installPromptDismissed");
      if (dismissed) return;

      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Clear dismissal flag if app is installed
      localStorage.removeItem("installPromptDismissed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("App installed");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    // Clear dismissal flag when installing
    localStorage.removeItem("installPromptDismissed");
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    // Store dismissal in localStorage (expires after 7 days)
    localStorage.setItem("installPromptDismissed", "true");
  };

  const installLater = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    // Store dismissal in localStorage (expires after 7 days)
    localStorage.setItem("installPromptDismissed", "true");
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 animate-slide-up">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Brown gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-900 opacity-90"></div>

        <div className="relative p-5">
          {/* Close button */}
          <button
            onClick={dismissPrompt}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
            aria-label="Close installation prompt"
          >
            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-amber-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Install App</h3>
              <p className="text-white/90 text-sm mb-4">
                Get the best experience with quick access and offline
                capabilities. Add to your home screen for instant access.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={installApp}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-900 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Install Now
                </button>

                <button
                  onClick={installLater}
                  className="px-4 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors duration-200 border border-white/20"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
      </div>
    </div>
  );
};

export default InstallPrompt;
