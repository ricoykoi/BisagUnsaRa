import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // stop browser from auto showing prompt
      e.preventDefault();

      // save the event
      setDeferredPrompt(e);
      setShowButton(true);
    };

    const handleAppInstalled = () => {
      setShowButton(false);
      setDeferredPrompt(null);
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
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-4">
        <span>Install this app for a better experience</span>
        <button
          onClick={installApp}
          className="bg-white text-indigo-600 px-4 py-1 rounded-md font-semibold"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
