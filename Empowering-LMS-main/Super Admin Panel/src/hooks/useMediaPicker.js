// hooks/useMediaPicker.js
import { useState, useCallback } from 'react';

const useMediaPicker = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        allowedTypes: 'all',
        title: 'Select Media',
        showUpload: true,
        multiSelect: false,
        preselectedFile: null,
        onSelect: () => { }
    });

    const openMediaPicker = useCallback((options = {}) => {
        return new Promise((resolve) => {
            setConfig({
                allowedTypes: options.allowedTypes || 'all',
                title: options.title || 'Select Media',
                showUpload: options.showUpload !== false,
                multiSelect: options.multiSelect || false,
                preselectedFile: options.preselectedFile || null,
                onSelect: (file) => {
                    setIsOpen(false);
                    resolve(file);
                }
            });
            setIsOpen(true);
        });
    }, []);

    const closeMediaPicker = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        config,
        openMediaPicker,
        closeMediaPicker
    };
};

export default useMediaPicker;
