import React from "react";

const Footer = props => {
  return (
    <div className="copyright">
      <div className="social-icons m-b-20">
        <a href="#" target="_blank" className="fa fa-facebook facebook" />
        <a href="#" target="_blank" className="fa fa-twitter twitter" />
        <a href="#" target="_blank" className="fa fa-instagram instagram" />
        <a href="#" target="_blank" className="fa fa-behance behance" />
        <a href="#" target="_blank" className="fa fa-dribbble dribbble" />
      </div>

      <p dangerouslySetInnerHTML={{ __html: props.data }} />
    </div>
  );
};

export default Footer;
