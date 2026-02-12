import React, { ChangeEvent } from "react";
import "./ImageUploadCard.css";

interface ImageUploadCardProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  index,
  value,
  onChange,
  onRemove,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      console.log(
        `Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1280;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

          // Calculate approximate base64 size (string length * 3/4)
          const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
          const sizeInBytes = (base64Length * 3) / 4;
          console.log(
            `Compressed size: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`,
          );

          if (sizeInBytes > 1.5 * 1024 * 1024) {
            alert(
              "The image is too large even after compression. Please try a smaller image.",
            );
            return;
          }

          onChange(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-card">
      {value ? (
        <div className="image-preview-container">
          <img
            src={value}
            alt={`Menu Image ${index + 1}`}
            className="image-preview"
          />
          <div className="image-actions-overlay">
            <label className="action-btn change-btn">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
            <button className="action-btn remove-btn" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder">
          <label className="upload-label">
            <div className="upload-icon-circle">
              <svg
                className="upload-plus-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0072BB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Image-like frame icon */}
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />

                {/* Plus overlay */}
                <circle
                  cx="18"
                  cy="9"
                  r="4.5"
                  fill="white"
                  stroke="#0072BB"
                  strokeWidth="1.5"
                />
                <line x1="18" y1="7" x2="18" y2="11" />
                <line x1="16" y1="9" x2="20" y2="9" />
              </svg>
            </div>
            <span className="image-label-text">Image {index + 1}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
