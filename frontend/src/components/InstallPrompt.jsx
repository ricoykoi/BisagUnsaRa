import React, { useState, useEffect, useRef } from "react";

// Define the type for the beforeinstallprompt event for better TypeScript compatibility,
// but for standard JSX/JavaScript, we just use a placeholder variable.
// In a TypeScript file, you would use: BeforeInstallPromptEvent | null
const beforeInstallPromptEvent = null;

const InstallPrompt = () => {
  // State to hold the deferred event object
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // State to control the visibility of the install button
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Reference to track if the component is mounted (for cleanup)
  const isMounted = useRef(true);

  useEffect(() => {
    // 1. Event Listener to capture the install prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser prompt from showing automatically
      e.preventDefault();

      // Store the event so we can trigger it later
      if (isMounted.current) {
        setDeferredPrompt(e);
        // Show our custom button
        setShowInstallButton(true);
      }
    };

    // 2. Event Listener to handle when the app is already installed
    const handleAppInstalled = () => {
      // Clear the deferred prompt and hide the button after installation
      if (isMounted.current) {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    };

    // Attach listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup function
    return () => {
      isMounted.current = false;
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []); // Run only once on mount

  // Function to handle the custom button click
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // 3. Show the browser's installation prompt using the stored event
      deferredPrompt.prompt();

      // 4. Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA installation prompt");
        } else {
          console.log("User dismissed the PWA installation prompt");
        }

        // Clear the deferred prompt after it has been used
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  // Do not render anything if the conditions aren't met
  if (!showInstallButton) {
    return null;
  }

  // Use Tailwind CSS classes for styling (matching your project setup)
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-indigo-600 rounded-lg shadow-2xl z-50">
      <div className="flex items-center space-x-4">
        <p className="text-white text-lg font-medium">
          Install furfur for a better experience!
        </p>
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-full hover:bg-gray-100 transition duration-150"
        >
          Install App
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
