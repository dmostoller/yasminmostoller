import React, { useEffect, useRef } from 'react';

function UploadWidget({ onSetImageUrl }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'ddp2xfpyb',
        uploadPreset: 'upload_yasmin',
        multiple: false //restrict upload to a single file
        // sources: [ "local", "url"],
      },
      function (error, result) {
        if (!error && result && result.event === 'success') {
          // console.log(result.info);
          onSetImageUrl(result.info.secure_url);
        }
      }
    );
  }, [onSetImageUrl]);

  return (
    <>
      <button
        type="button"
        className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm transition-colors duration-200"
        onClick={() => widgetRef.current.open()}
      >
        Upload Image
      </button>
    </>
  );
}
export default UploadWidget;
