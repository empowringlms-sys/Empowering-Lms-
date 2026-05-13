import React, { useCallback } from "react";
import useMediaPicker from "../../../../../../../modules/media-files/useMediaPicker";
import MediaPickerModal from "../../../../../../../modules/media-files/MediaPickerModal";

const AddImageInTopic = ({ onClose, onAdd, initialData }) => {
  const { isOpen, config, openMediaPicker, closeMediaPicker } = useMediaPicker();

  // Open the media picker for images only
  const handleOpen = useCallback(async () => {
    const selectedFile = await openMediaPicker({
      allowedTypes: "image",
      title: "Select Image",
      showUpload: true,
      multiSelect: false,
      preselectedFile: initialData,
    });

    if (selectedFile) {
      onAdd(selectedFile); // send selected image back
      onClose?.(); // close parent modal if needed
    }
  }, [openMediaPicker, onAdd, onClose, initialData]);

  // Open automatically when component mounts
  React.useEffect(() => {
    handleOpen();
  }, [handleOpen]);

  return (
    <MediaPickerModal
      isOpen={isOpen}
      onClose={() => {
        closeMediaPicker();
        onClose?.();
      }}
      onSelect={(file) => {
        onAdd(file);
        closeMediaPicker();
        onClose?.();
      }}
      allowedTypes="image"
      title="Select Image"
      showUpload={true}
      multiSelect={false}
      preselectedFile={initialData}
    />
  );
};

export default AddImageInTopic;
