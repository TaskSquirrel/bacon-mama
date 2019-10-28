import React from "react";
import { BrowserRouter } from "react-router-dom";

import StorageProvider from "./components/Storage/StorageProvider";
import UserProvider from "./components/User/UserProvider";

import Test from "./components/Test";

import "./App.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <StorageProvider
                store="APP_DATA"
            >
                <UserProvider>
                    <Test />
                </UserProvider>
            </StorageProvider>
        </BrowserRouter>
    );
};

export default App;
