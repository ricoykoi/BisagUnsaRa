import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MyPets from "../pages/MyPets";
import Plans from "../pages/Plans";
import Export from "../pages/Export";
import { SubscriptionProvider } from "../context/SubscriptionContext";
import MainLayout from "../layout/MainLayout";

const MainRoutes = () => {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/mypets"
            element={
              <MyPets>
                {({ openPetModal }) => (
                  <MainLayout openPetModal={openPetModal}>
                    {/* MyPets content is rendered via MainLayout's children prop */}
                  </MainLayout>
                )}
              </MyPets>
            }
          />
          <Route
            path="/plans"
            element={
              <MainLayout>
                <Plans />
              </MainLayout>
            }
          />
          <Route
            path="/export"
            element={
              <MainLayout>
                <Export />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  );
};

export default MainRoutes;
