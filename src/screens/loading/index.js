import './index.css';
import { useSelector } from 'react-redux';
import { Circles } from 'react-loader-spinner';

function LoadingPage() {
  const config = useSelector((state) => state.configReducer);
  if (config.loading) {
    return (
      <div className="container">
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  return <></>;
}

export default LoadingPage;
