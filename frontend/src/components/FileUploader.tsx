import React, { useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProcessedVideoUrl(null); // Reset processed video URL
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend response:", response.data); // Log the backend response

      if (response.data.output_path) {
        const videoUrl = `http://127.0.0.1:5000${response.data.output_path}`;
        console.log("Processed video URL:", videoUrl); // Log the video URL
        setProcessedVideoUrl(videoUrl);
      } else {
        alert("Failed to analyze the video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error); // Log any errors
      alert("Failed to analyze the video.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="border-4 border-dashed border-black shadow-lg bg-white p-8 rounded-2xl w-full h-[500px] flex flex-col items-center justify-center">
        {/* File Input */}
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />

        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-blue-500"
        >
          <FiPlus size={60} className="mb-2 bg-slate-100 shadow-lg rounded-full" />
          <span className="text-lg font-medium">Click to upload</span>
        </label>

        {/* Display Uploaded File Name */}
        {file && (
          <p className="mt-4 text-gray-700">
            Selected File: <span className="font-bold">{file.name}</span>
          </p>
        )}

        {/* Loading Notification */}
        {isLoading && <p className="mt-4 text-blue-500">Processing video... Please wait.</p>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Analyze Video"}
        </button>

        {/* Display Processed Video */}
        {processedVideoUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Processed Video:</h3>
            <video
              src={processedVideoUrl}
              controls
              className="w-full max-w-lg rounded-lg shadow-lg"
            ></video>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
