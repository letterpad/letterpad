import { EventBusInstance, Events } from "../../../shared/eventBus";
import React, { useEffect, useState } from "react";

import styled from "styled-components";

let saveTimeout, loadTimeout;
export const SaveIndicator: React.FC = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    EventBusInstance.on(Events.SAVING, () => {
      setActive(true);
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        setActive(false);
      }, 2000);
    });

    EventBusInstance.on(Events.SAVED, () => {
      setTimeout(() => {
        setActive(false);
      }, 1000);
    });
  }, []);

  if (!active) return null;
  return (
    <SaveContainer>
      <span>-- Saving --</span>
    </SaveContainer>
  );
};

export const LoadIndicator: React.FC = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    EventBusInstance.on(Events.LOADING, () => {
      setActive(true);
      clearTimeout(loadTimeout);
      loadTimeout = setTimeout(() => {
        setActive(false);
      }, 2000);
    });

    EventBusInstance.on(Events.LOADED, () => {
      setTimeout(() => {
        setActive(false);
      }, 400);
    });
  }, []);

  if (!active) return null;

  return (
    <LoadContainer>
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </LoadContainer>
  );
};

export const SaveContainer = styled.div`
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 5px;
  left: 50%;
  margin-left: -20px;
  opacity: 0.8;
  font-size: 0.8rem;
  margin-top: 5px;
  span {
    background: #efe141;
    padding: 4px 8px;
    border: 1px solid #ded254;
    border-radius: 4px;
    color: #000;
  }
`;
export const LoadContainer = styled.div`
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -5px;
  top: 10px;
  .spinner {
    width: 70px;
    text-align: center;
  }

  .spinner > div {
    width: 6px;
    height: 6px;
    background-color: #0eaf10;
    margin-right: 4px;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
    background-color: #27b0ed;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    background-color: #f33f43;
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;
