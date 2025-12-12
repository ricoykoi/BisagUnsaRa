import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MyPets from "../pages/MyPets";
import Plans from "../pages/Plans";
import Export from "../pages/Export";
import { SubscriptionProvider } from "../context/SubscriptionContext";
import MainLayout from "../layout/MainLayout";
import Settings from "../pages/Settings";

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
              <MainLayout>
                <MyPets />
              </MainLayout>
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
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  );
};

export default MainRoutes;
