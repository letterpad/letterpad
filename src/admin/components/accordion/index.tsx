import { AccordionHead, Container } from "./Accordion.css";
import React, { useEffect, useRef, useState } from "react";

import Chevron from "./Chevron";
import { withRouter } from "react-router";

function Accordion(props) {
  const [active, setActiveState] = useState(false);
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");
  const urlParams = new URLSearchParams(props.history.location.search);

  const content = useRef(null);

  useEffect(() => {
    if (props.isActive) {
      toggleAccordion();
    }
    if (urlParams.get("tab") !== props.tab && active) {
      toggleAccordion();
    }

    if (urlParams.get("tab") === props.tab && !active) {
      toggleAccordion();
    }
  }, [urlParams.get("tab")]);

  function toggleAccordion() {
    setActiveState(!active);
    setHeightState(active ? "0px" : `${content.current.scrollHeight}px`);
    setRotateState(active ? "accordion__icon" : "accordion__icon rotate");

    if (!active) {
      props.history.push({
        pathname: props.history.location.pathname,
        search: "?tab=" + props.tab,
      });
    }
  }

  function resize() {
    setHeightState(active ? "0px" : `${content.current.scrollHeight}px`);
  }

  return (
    <Container className="accordion__section">
      <AccordionHead active={active} onClick={toggleAccordion}>
        <div className="title">
          <h2 className="accordion__title">{props.title}</h2>
          <p className="accordion__subtitle">{props.subtitle}</p>
        </div>
        <Chevron className={`${setRotate}`} width={10} fill={"#777"} />
      </AccordionHead>

      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
        <div className="accordion__text">{props.children}</div>
      </div>
    </Container>
  );
}

export default withRouter(Accordion);
