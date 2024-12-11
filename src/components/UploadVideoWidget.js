import React, { useEffect, useRef } from 'react';
import { PrimaryButton } from './buttons/PrimaryButton';

function UploadVideoWidget({ onSetVideoUrl }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'ddp2xfpyb',
        uploadPreset: 'yasmin_video',
        multiple: false, //restrict upload to a single file
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
      <PrimaryButton
        type="button"
        text="Upload Video"
        className="w-full mt-2 rounded-md"
        onClick={() => widgetRef.current.open()}
      />
    </>
  );
}
export default UploadVideoWidget;
