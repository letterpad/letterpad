import React from "react";
import { Link } from "react-router-dom";
import config from "letterpad-src/config";

const NotFound: React.FC = () => {
  return (
    <section>
      <div className="block-404">
        <div className="image-404">
          <img src={config.baseName + "/hugo/images/robot.png"} />
        </div>
        <div className="error-block">
          <h1>404</h1>
          <h3>Looks like you're lost</h3>
          <p className="error-message">
            The page you are looking for is not available!
          </p>
          <p className="go-home">
            <Link to="/">GO TO HOME →</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
export default NotFound;
