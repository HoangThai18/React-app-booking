import React from 'react';
import { useSelector } from 'react-redux';
import { Circles } from 'react-loader-spinner';

function LoadingMsg() {
  const loadingMsg = useSelector((state) => state.configReducer.loadingMsg);

  return (
    <>
      {loadingMsg && (
        <div className="loading-msg">
          <Circles
            height={50}
            width={50}
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </>
  );
}

export default LoadingMsg;
