import React, { useEffect, useRef } from 'react';
import { PrimaryButton } from './buttons/PrimaryButton';

function UploadWidget({ onSetImageUrl }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'ddp2xfpyb',
        uploadPreset: 'upload_yasmin',
        multiple: false, //restrict upload to a single file
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
      <PrimaryButton
        type="button"
        text="Upload Image"
        className="w-full rounded-md"
        onClick={() => widgetRef.current.open()}
      />
    </>
  );
}
export default UploadWidget;
