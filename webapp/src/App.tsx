import React from "react";
import { BrowserRouter } from "react-router-dom";

import StorageProvider from "./components/Storage/StorageProvider";
import UserProvider from "./components/User/UserProvider";
import AppRouter from "./components/shared/AppRouter";

import routes from "./components/routes/root";

import "./App.module.scss";
import "./App.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <StorageProvider
                store="APP_DATA"
            >
                <UserProvider>
                    <AppRouter
                        routes={ routes }
                    />
                </UserProvider>
            </StorageProvider>
        </BrowserRouter>
    );
};

export default App;
