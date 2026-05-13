import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { useAuthContext } from "../../modules/userAuth/AuthContext";

export default function CompanySelector() {
    const [slug, setSlug] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [domain, setDomain] = useState("learner.com"); // Default fallback
    const navigate = useNavigate();
    const { isLogin, userData } = useAuthContext();

    useEffect(() => {
        // Get current domain for display
        if (window.location.host) {
            setDomain(window.location.host);
        }

        if (isLogin && userData?.companySlug) {
            navigate(`/${userData.companySlug}/dashboard`, { replace: true });
        }
    }, [isLogin, userData, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (slug.trim()) {
            navigate(`/${slug.trim()}/signin`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
                <div className="bg-white/90 backdrop-blur-xl py-10 px-6 shadow-[0_20px_50px_rgb(0,0,0,0.1)] rounded-3xl sm:px-10 border border-white/60">

                    {/* Header Section (Now Inside Card) */}
                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transform hover:scale-105 transition-transform duration-300">
                                <FiBookOpen size={28} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Welcome to Empowerings
                        </h2>
                        <p className="mt-3 text-base text-gray-500">
                            Enter your workspace URL to continue learning
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            {/* <label htmlFor="slug" className="block text-sm font-bold text-gray-700 mb-2">
                                Workspace URL
                            </label> */}
                            <div className={`mt-1 relative rounded-xl shadow-sm transition-all duration-300 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 ${isFocused ? 'ring-2 ring-emerald-500/50' : 'border border-gray-200'}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-800 font-semibold sm:text-md tracking-wide bg-gray-300 px-1 py-1 rounded-md">{domain}/</span>
                                </div>
                                <input
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    // Use generous padding to account for typical domain lengths, user can see the text.
                                    // The domain logic is visual helper.
                                    className="block w-full pl-36 pr-10 py-4 sm:text-md border-none bg-transparent rounded-xl focus:ring-0 placeholder-gray-400 text-gray-800"
                                    style={{ paddingLeft: `${domain.length * 8 + 30}px` }}
                                    placeholder="your-company"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    required
                                    autoComplete="off"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    {slug && (
                                        <FiCheckCircle className="h-5 w-5 text-emerald-500 animate-fadeIn" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/30 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Continue
                                <FiArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                        <p className="text-xs text-center text-gray-400">
                            Secure, powered by Empowering LMS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
