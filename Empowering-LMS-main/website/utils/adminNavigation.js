
import toast from "react-hot-toast";
import { RiContactsBookUploadLine } from "react-icons/ri";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/companies`;
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

// Simple top loading bar implementation
const showLoader = () => {
    if (typeof window === 'undefined') return;

    let loader = document.getElementById('admin-nav-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'admin-nav-loader';
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '0%';
        loader.style.height = '3px';
        loader.style.backgroundColor = '#00ba78'; // Blue color, adjust as needed
        loader.style.zIndex = '9999';
        loader.style.transition = 'width 0.3s ease';
        document.body.appendChild(loader);
    }

    // Force reflow
    loader.getBoundingClientRect();
    loader.style.width = '30%';

    // Animate to 90% slowly
    setTimeout(() => {
        if (loader) loader.style.width = '70%';
    }, 300);
};

const hideLoader = () => {
    if (typeof window === 'undefined') return;
    const loader = document.getElementById('admin-nav-loader');
    if (loader) {
        loader.style.width = '100%';
        setTimeout(() => {
            if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, 300);
    }
};

export const navigateToAdminPanel = async (authToken) => {
    console.log("authToken in navigate to admin panel : ", authToken);
    // If no auth token, just redirect to admin login
    if (!authToken) {
        window.location.href = ADMIN_URL;
        return;
    }

    try {
        showLoader();

        // Generate SSO token
        const res = await fetch(`${API_URL}/generate-sso-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = await res.json();

        if (data.success && data.data?.token) {
            // Redirect with token
            // Append token to admin url
            // Handle trailing slash
            const separator = ADMIN_URL.includes('?') ? '&' : '?';
            const targetUrl = `${ADMIN_URL}${separator}sso_token=${data.data.token}`;
            window.location.href = targetUrl;
        } else {
            console.error("Failed to generate SSO token:", data.message);
            // Fallback to normal navigation
            window.location.href = ADMIN_URL;
        }
    } catch (error) {
        console.error("Error navigating to admin panel:", error);
        window.location.href = ADMIN_URL;
    } finally {
        // We don't really hide loader because we are navigating away, 
        // but good practice in case navigation gets cancelled or fails differently (though we redirect anyway)
        // If we redirect, the page will unload.
    }
};
