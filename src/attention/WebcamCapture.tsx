import React, { useRef } from 'react';

const WebcamCapture = () => {
  const videoRef = useRef();

  const captureImage = () => {
    const video = videoRef.current;

    // Check if the video element exists
    if (video) {
      // Create a canvas element to capture the image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Draw the current frame from the video onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL representing the image
      const imageDataUrl = canvas.toDataURL('image/jpeg');

      // Do something with the image data URL (e.g., send it to a server)
      console.log(imageDataUrl);
    }
  };

  // Get access to the webcam stream when the component mounts
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Set the video stream as the source for the video element
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />
      <button onClick={captureImage}>Capture Image</button>
    </div>
  );
};

export default WebcamCapture;
