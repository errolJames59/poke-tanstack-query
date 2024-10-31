import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <div>
        <h1>404 - Not Found</h1>
      </div>
      <Link to="/">Home</Link>
    </>
  );
};

export default ErrorPage;