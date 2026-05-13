import React, { createContext, useContext, useState, useEffect } from "react";

const CompanyProfileContext = createContext();

export const useCompanyProfileContext = () => {
    const context = useContext(CompanyProfileContext);
    if (!context) {
        throw new Error("useCompanyProfileContext must be used within a CompanyProfileProvider");
    }
    return context;
};

export const CompanyProfileProvider = ({ children }) => {
    const [companyData, setCompanyData] = useState(null);
    const [isLoadingCompany, setIsLoadingCompany] = useState(false);

    // Persistence: Hydrate from localStorage on mount (optional but good for refresh)
    // However, AuthContext usually refreshes data from server checkAuth. 
    // We can rely on AuthContext to set this, OR persist it.
    // User said "get from server... and store in context".
    // If we refresh, checkAuth runs, it gets data, it updates context. Perfect.
    // But for "Login Page" when NOT logged in, we fetch slug data.
    // We can store that "public" company data here too?
    // Yes. "companyData" can hold either the public info (pre-login) or full profile (post-login).

    const clearCompanyData = () => {
        setCompanyData(null);
        localStorage.removeItem("companyData"); // If we decide to use LS
    };

    useEffect(() => {
        const stored = localStorage.getItem("companyData");
        if (stored) {
            try {
                setCompanyData(JSON.parse(stored));
            } catch (e) { }
        }
    }, []);

    const setCompanyDataAndPersist = (data) => {
        setCompanyData(data);
        if (data) {
            localStorage.setItem("companyData", JSON.stringify(data));
        } else {
            localStorage.removeItem("companyData");
        }
    };

    const value = {
        companyData,
        setCompanyData: setCompanyDataAndPersist,
        clearCompanyData,
        isLoadingCompany,
        setIsLoadingCompany
    };

    return (
        <CompanyProfileContext.Provider value={value}>
            {children}
        </CompanyProfileContext.Provider>
    );
};
