import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({
    value = "",
    onChange = () => { },
    height = 500,
    disabled = false,
    placeholder = "Type here...",
    onSave = () => console.log("saved"),
    isDarkMode = false,
}) => {
    const editorRef = useRef(null);
    const [editorValue, setEditorValue] = useState(value);

    const handleEditorChange = (newValue) => {
        setEditorValue(newValue);
        onChange(newValue);
    };

    return (
        <div
            className={`rounded-lg overflow-hidden transition-all duration-300 ${isDarkMode
                    ? "border-gray-700 bg-gray-800 shadow-lg"
                    : "border-gray-200 bg-white shadow-md"
                } ${disabled ? "opacity-80" : ""}`}
        >
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={editorValue}
                onEditorChange={handleEditorChange}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                        "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                        "insertdatetime", "media", "table", "help", "wordcount"
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    placeholder: placeholder,
                    skin: isDarkMode ? "oxide-dark" : "oxide",
                    content_css: isDarkMode ? "dark" : "default",
                    setup: (editor) => {
                        editorRef.current = editor;
                        editor.on("keydown", (e) => {
                            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                                e.preventDefault();
                                e.stopPropagation();
                                onSave();
                                return false;
                            }
                        });
                    }
                }}
                disabled={disabled}
            />
        </div>
    );
};

export default RichTextEditor;
