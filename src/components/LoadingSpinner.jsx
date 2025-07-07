
import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingSpinner = () => {
  return (
    <div className="loadingWrapper">
         <DotLottieReact
      src="https://lottie.host/e1874616-0d53-4788-b38f-4c42effd67bd/iQeV3bFwxo.lottie"
      loop
      autoplay
    />
      <p>Fetching wallet data...</p>
    </div>
  );
};

export default LoadingSpinner;