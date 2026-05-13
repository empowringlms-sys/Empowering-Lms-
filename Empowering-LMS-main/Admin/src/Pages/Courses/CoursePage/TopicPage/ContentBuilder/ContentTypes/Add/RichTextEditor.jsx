import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import handleEditorConfig from "./editorConfig";
import MediaPickerModal from "../../../../../../../modules/media-files/MediaPickerModal";
import useMediaPicker from "../../../../../../../modules/media-files/useMediaPicker";
import { FiImage, FiVideo, FiUpload } from "react-icons/fi";

const RichTextEditor = ({
  value = "",
  onChange = () => {},
  height = 500,
  disabled = false,
  placeholder = "Type here...",
  onSave = () => console.log("saved"),
  isDarkMode = false,
  showMediaPicker = true, 
}) => {
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState(value);
  const [mediaPickerConfig, setMediaPickerConfig] = useState({
    isOpen: false,
    allowedTypes: "image",
    title: "Insert Image",
    showUpload: true,
    multiSelect: false,
    onSelect: () => {},
  });

  // Get base editor config
  let editorConfig = handleEditorConfig(isDarkMode, disabled, placeholder, height);

  // Enhanced editor config with media picker integration
  editorConfig = {
    ...editorConfig,
    setup: (editor) => {
      // Store editor reference
      editorRef.current = editor;

      // Existing setup logic
      editor.on("keydown", (e) => {
        // Prevent TinyMCE from removing empty paragraphs
        if (e.key === "Enter" && editor.selection.getContent() === "") {
          editor.execCommand("InsertParagraph", false, "p");
          e.preventDefault();
        }

        // Add Ctrl+S handler
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          e.stopPropagation();
          onSave();
          return false;
        }
      });

      // Add custom image button that opens media picker
      if (showMediaPicker) {
        editor.ui.registry.addButton("customImage", {
          icon: "image",
          tooltip: "Insert image from media library",
          onAction: () => {
            openMediaPicker("image");
          },
        });

        editor.ui.registry.addButton("customVideo", {
          icon: "video",
          tooltip: "Insert video from media library",
          onAction: () => {
            openMediaPicker("video");
          },
        });
      }
    },
    toolbar: showMediaPicker
      ? [
          "undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough",
          "forecolor backcolor | alignleft aligncenter alignright alignjustify",
          "bullist numlist outdent indent | customImage customVideo link table emoticons",
          "codesample code | removeformat help",
        ].join(" | ")
      : editorConfig.toolbar,
  };

  // Open media picker
  const openMediaPicker = (type = "image") => {
    setMediaPickerConfig({
      isOpen: true,
      allowedTypes: type,
      title: type === "image" ? "Insert Image" : "Insert Video",
      showUpload: true,
      multiSelect: false,
      onSelect: (mediaFile) => {
        if (mediaFile && editorRef.current) {
          insertMediaIntoEditor(mediaFile);
        }
      },
    });
  };

  // Insert media into editor
  const insertMediaIntoEditor = (mediaFile) => {
    if (!mediaFile || !editorRef.current) return;

    const editor = editorRef.current;

    if (mediaFile.type === "image") {
      // Insert image with responsive styling
      const imgHtml = `
        <div class="image-container" style="max-width: 100%; margin: 1rem 0;">
          <img 
            src="${mediaFile.src}" 
            alt="${mediaFile.name || "Image"}"
            style="max-width: 100%; height: auto; border-radius: 8px;"
            data-media-id="${mediaFile._id}"
          />
          ${mediaFile.caption ? `<p class="image-caption" style="text-align: center; font-style: italic; color: #666; margin-top: 0.5rem;">${mediaFile.caption}</p>` : ""}
        </div>
      `;
      editor.execCommand("mceInsertContent", false, imgHtml);
    } else if (mediaFile.type === "video") {
      // Insert video with responsive styling
      const videoHtml = `
        <div class="video-container" style="max-width: 100%; margin: 1rem 0;">
          <video 
            src="${mediaFile.src}" 
            controls 
            style="max-width: 100%; border-radius: 8px;"
            data-media-id="${mediaFile._id}"
          >
            Your browser does not support the video tag.
          </video>
          ${mediaFile.caption ? `<p class="video-caption" style="text-align: center; font-style: italic; color: #666; margin-top: 0.5rem;">${mediaFile.caption}</p>` : ""}
        </div>
      `;
      editor.execCommand("mceInsertContent", false, videoHtml);
    }
  };

  // Handle editor change
  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
    onChange(newValue);
  };

  // Close media picker
  const closeMediaPicker = () => {
    setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div
        className={`rounded-lg overflow-hidden transition-all duration-300 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800 shadow-lg"
            : "border-gray-200 bg-white shadow-md"
        } ${disabled ? "opacity-80" : ""}`}
      >
        {/* Custom Media Picker Button Bar (optional) */}
        {showMediaPicker && (
          <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => openMediaPicker("image")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 rounded-md border border-blue-200 transition-colors duration-200 cursor-pointer"
              title="Insert image from media library"
            >
              <FiImage className="w-4 h-4" />
              <span className="text-sm font-medium">Image</span>
            </button>
            <button
              onClick={() => openMediaPicker("video")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-600 rounded-md border border-purple-200 transition-colors duration-200 cursor-pointer"
              title="Insert video from media library"
            >
              <FiVideo className="w-4 h-4" />
              <span className="text-sm font-medium">Video</span>
            </button>
          </div>
        )}

        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={editorValue}
          onEditorChange={handleEditorChange}
          init={editorConfig}
          disabled={disabled}
        />
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerConfig.isOpen}
        onClose={closeMediaPicker}
        onSelect={mediaPickerConfig.onSelect}
        allowedTypes={mediaPickerConfig.allowedTypes}
        title={mediaPickerConfig.title}
        showUpload={mediaPickerConfig.showUpload}
        multiSelect={mediaPickerConfig.multiSelect}
        preselectedFile={mediaPickerConfig.preselectedFile}
      />
    </>
  );
};

export default RichTextEditor;