import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Auto-hide splash screen after 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(splashTimer);
    };
  }, []);

  // Splash screen animation variants
  const splashVariants = {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: -10 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50"
            variants={splashVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Logo/Icon Section */}
            <motion.div
              className="mb-6 relative"
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              {/* Pet Paw Circle */}
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-2xl flex items-center justify-center">
                {/* Animated dots */}
                <motion.div
                  className="absolute w-8 h-8 bg-white rounded-full"
                  style={{ top: "25%", left: "25%" }}
                  variants={dotVariants}
                  animate="animate"
                />
                <motion.div
                  className="absolute w-8 h-8 bg-white rounded-full"
                  style={{ top: "25%", right: "25%" }}
                  variants={dotVariants}
                  animate="animate"
                />
                <motion.div
                  className="absolute w-8 h-8 bg-white rounded-full"
                  style={{ bottom: "25%", left: "35%" }}
                  variants={dotVariants}
                  animate="animate"
                />

                {/* Central Logo/Brand */}
                <div className="z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    <span className="text-5xl font-bold text-white drop-shadow-lg"></span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* App Name */}
            <motion.div
              className="text-center"
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <h1 className="text-5xl font-bold text-amber-900 mb-2 drop-shadow-sm">
                FurFur
              </h1>
              <p className="text-lg text-amber-700 font-medium">
                Pet Care & Feeding Tracker
              </p>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              className="mt-12"
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="h-2 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-8 text-amber-600 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Because every pet deserves the best care
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`${
          showSplash
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }`}
      >
        <div className={`${isDesktop ? "ml-64" : ""}`}>
          <Header />
        </div>
        {isDesktop && <Sidebar />}
        <main className={isDesktop ? "ml-64" : "pb-16"}>{children}</main>
        {!isDesktop && <BottomNavbar />}
      </div>
    </>
  );
};

export default MainLayout;
