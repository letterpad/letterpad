import { AccordionHead, Container } from "./Accordion.css";
import React, { useEffect, useRef, useState } from "react";

import Chevron from "./Chevron";
import { withRouter } from "react-router";

function Accordion(props) {
  const [active, setActiveState] = useState(false);
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");
  const urlParams = new URLSearchParams(props.history.location.search);

  const content = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        if (!head.current) return;
        head.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [active]);
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

  useEffect(() => {
    if (!content.current) return;
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          resize();
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    observer.observe(content.current, config);

    return () => {
      observer.disconnect();
    };
  }, []);

  function toggleAccordion() {
    if (!content.current) return;
    // if (e) e.target.focus();
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
    if (!content.current) return;
    const urlParams = new URLSearchParams(props.history.location.search);
    if (urlParams.get("tab") !== props.tab) return;
    setHeightState(active ? "0px" : `${content.current.scrollHeight}px`);
  }

  return (
    <Container className="accordion__section">
      <AccordionHead
        data-testid={"tab-" + props.tab}
        active={active}
        onClick={toggleAccordion}
        ref={head}
      >
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
