import React, { useEffect, useRef } from 'react';

function UploadVideoWidget({ onSetVideoUrl }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'ddp2xfpyb',
        uploadPreset: 'yasmin_video',
        multiple: false //restrict upload to a single file
      },
      function (error, result) {
        if (!error && result && result.event === 'success') {
          // console.log(result.info);
          onSetVideoUrl(result.info.public_id);
        }
      }
    );
  }, [onSetVideoUrl]);

  return (
    <>
      <button
        style={{ marginTop: '3px' }}
        type="button"
        className="w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm transition-colors duration-200"
        onClick={() => widgetRef.current.open()}
      >
        Upload Video
      </button>
    </>
  );
}
export default UploadVideoWidget;
