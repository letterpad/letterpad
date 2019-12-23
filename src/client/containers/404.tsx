import React from "react";

const NotFound: React.FC = () => {
  return (
    <section className="main post-detail">
      <header className="post-header">
        <h3 className="module-title">Oh Snap!</h3>
        <div className="module-subtitle">
          404: we could not find the page you requested
        </div>
      </header>
    </section>
  );
};
export default NotFound;
