import React from 'react';
import { FiPlus } from "react-icons/fi";

const AddContentDivider = ({ onAdd, label }) => (
    <div className="relative flex items-center gap-6 my-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
        <button
            onClick={onAdd}
            className="group relative flex flex-col items-center cursor-pointer"
        >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <FiPlus className="w-5 h-5" />
            </div>
        </button>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
    </div>
);

export default AddContentDivider;
