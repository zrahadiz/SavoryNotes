import { useState, useEffect, useRef } from "react";

import imgNotFound from "@/assets/imgNotFound.png";

import { HiPhotograph, HiX } from "react-icons/hi";

export default function ImageUploader({
  maxFiles = 5,
  maxSizeMB = 5,
  previousImages = [],
  onChange,
}) {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!previousImages || previousImages.length === 0) return;

    if (!isInitialized.current) {
      console.log(previousImages);
      setImages(previousImages);
      setPreviews(
        previousImages.map((img) =>
          img instanceof File ? URL.createObjectURL(img) : img
        )
      );
      isInitialized.current = true;
    }
  }, [previousImages]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    setError("");

    const validFiles = [];
    const newPreviews = [];

    Array.from(files).forEach((file) => {
      if (file.size / 1024 / 1024 > maxSizeMB) {
        setError(`File "${file.name}" exceeds ${maxSizeMB}MB`);
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} files`);
      return;
    }

    const updatedImages = [...images, ...validFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setImages(updatedImages);
    setPreviews(updatedPreviews);

    if (onChange) {
      onChange(updatedImages);
    }
  };

  const handleRemoveImage = (index) => {
    if (previews[index] && previews[index].startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setImages(updatedImages);
    setPreviews(updatedPreviews);

    if (onChange) {
      onChange(updatedImages);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="mb-4">
      {/* Upload box */}
      <label
        className="block w-full cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            dragOver
              ? "border-primary bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
          }`}
        >
          <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            Click or drag files to upload
          </p>
          <p className="text-gray-400 text-sm mt-1">
            PNG, JPG up to {maxSizeMB}MB ({images.length}/{maxFiles})
          </p>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previews.map((url, index) => {
            const isExisting = previousImages.includes(url);
            return (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  onError={(e) => {
                    e.target.src = imgNotFound;
                    e.target.className =
                      "w-full h-32 object-contain rounded-lg border-2 border-gray-200";
                  }}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />

                {/* Badge for existing images */}
                {isExisting && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium shadow-md">
                    Existing
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600 cursor-pointer"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove image"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
