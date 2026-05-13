import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSend, FiUser, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import RichTextEditor from "../Courses/CoursePage/TopicPage/ContentBuilder/ContentTypes/Add/RichTextEditor";

const SendEmail = () => {
    const { learnerId } = useParams();
    const navigate = useNavigate();
    const [learner, setLearner] = useState(null);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchLearnerData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/users/${learnerId}`);
                if (response?.data?.success) {
                    setLearner(response.data.data.learner);
                } else {
                    toast.error("Learner not found");
                    navigate("/learners");
                }
            } catch (error) {
                console.error("Error fetching learner:", error);
                toast.error("Failed to load learner details");
                navigate("/learners");
            } finally {
                setLoading(false);
            }
        };

        if (learnerId) {
            fetchLearnerData();
        }
    }, [learnerId, navigate]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!subject.trim()) return toast.error("Please enter a subject");
        if (!message.trim() || message === "<p><br></p>") return toast.error("Please enter a message");

        try {
            setSending(true);

            const response = await axiosInstance.post(`/users/${learnerId}/email`, {
                subject,
                html: message,
            });

            if (response?.data?.success) {
                toast.success("Email sent successfully");
                navigate("/learners");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error(error.response?.data?.message || "Failed to send email");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center">
                <div className="text-emerald-600">Loading...</div>
            </div>
        );
    }

    if (!learner) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/learners")}
                    className="flex items-center gap-2 text-emerald-600 mb-6 hover:text-emerald-800 transition-colors"
                    type="button"
                >
                    <FiArrowLeft /> Back to Learners
                </button>

                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
                        <h1 className="text-2xl font-bold text-emerald-900 mb-2">
                            Send Email to Learner
                        </h1>
                        <div className="flex items-center gap-4 text-emerald-700">
                            <div className="flex items-center gap-2">
                                <FiUser /> {learner.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail /> {learner.email}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSend}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-emerald-900 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-300"
                                    placeholder="Email Subject"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-emerald-900 mb-2">
                                    Message
                                </label>
                                <div className="mb-12">
                                    <RichTextEditor
                                        value={message}
                                        onChange={setMessage}
                                        height={400}
                                        placeholder="Compose your email here..."
                                        showMediaPicker={false}
                                    />
                                    <p className="text-xs text-emerald-500 mt-2">
                                        You can use rich text formatting (bold, italic, lists, etc.) in your email.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                >
                                    <FiSend />
                                    {sending ? "Sending..." : "Send Email"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
