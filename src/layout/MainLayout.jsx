import React from 'react';
import Header from '../components/Header';
import BottomNavbar from '../components/BottomNavbar';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <BottomNavbar />
        </div>
    );
};

export default MainLayout;