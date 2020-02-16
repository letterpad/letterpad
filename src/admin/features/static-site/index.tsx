import { ProgressBar, Warning } from "./index.css";
import React, { createRef, useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import Button from "../../components/button";
import StyledCard from "../../components/card";
import StyledSection from "../../components/section";
import config from "../../../config";

interface IStaticProps extends WithNamespaces {}

const CreateStatic: React.FC<IStaticProps> = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const progressRef = createRef<HTMLSpanElement>();
  const messageRef = createRef<HTMLSpanElement>();

  const createStaticFiles = async () => {
    if (processing) {
      return false;
    }
    setProcessing(true);
    const reader = await getReader();
    if (!reader) return;
    let oldPercentage = 0;

    const readStream = async (reader: ReadableStreamDefaultReader) => {
      const { done, value } = await reader.read();
      if (done) {
        return setProgressWidth(100);
      }
      const chunk = value;
      // new percentage received from server
      const { type, message } = chunkToJSON(chunk);
      if (messageRef.current) {
        if (type === "message") {
          messageRef.current.innerHTML = message.toString();
          return readStream(reader);
        }
        messageRef.current.innerHTML = "";
      }
      const newPercentage = parseInt(message);
      // if the percentage is 100, find the difference between the this and last percentage.
      if (newPercentage === 100) {
        // check the prev percent. if it is more than 20 gracefully end
        let diff = newPercentage - oldPercentage;
        // the server is going to send us the progress in chunks. The chunks are going to contain
        // either percentages(1,2, etc) or "error".
        // Sometimes the percentage might jump from 70% to 100%. So we calculate the difference
        // between last two percentages and end the progress bar gracefully.
        if (diff > 20) {
          progressGracefully(oldPercentage, () => {
            setProcessing(false);
            return reader.cancel();
          });
        }
        setProcessing(false);
        return reader.cancel();
      } else {
        // set the progress bar with the new percentage
        setProgressWidth(newPercentage);
        // remember the last percentage received
        oldPercentage = newPercentage;
        // continue reading the stream
        return readStream(reader);
      }
    };

    readStream(reader);
  };

  const progressGracefully = (percent: number, callback: () => void) => {
    let interval = setInterval(() => {
      percent += Math.ceil(Math.random() * Math.floor(4)) + Math.random();
      if (percent >= 100) {
        clearInterval(interval);
        setProgressWidth();
        return callback();
      }
      setProgressWidth(percent);
    }, 200);
  };

  const setProgressWidth = (width = 100) => {
    if (!progressRef.current) return null;
    const widthInString = width.toString();
    const newWidth = -100 + parseFloat(widthInString);
    progressRef.current.style.transform = `translateX(calc(${newWidth}%))`;
    progressRef.current.textContent =
      parseFloat(widthInString).toFixed(2) + "%";
  };

  const canGenerate = (window as any).NODE_ENV === "production";
  const preview = config.BASE_NAME + "/static/" + getHostName();

  return (
    <StyledSection>
      <div>
        <StyledCard
          title="Static Site Generator"
          subtitle="Here you can generate static pages of your website"
        >
          <div>
            Preview your static site{" "}
            <a rel="noopener noreferrer" target="_blank" href={preview}>
              here
            </a>
            .
            <br />
          </div>
          {processing && (
            <ProgressBar>
              <span ref={progressRef} />
            </ProgressBar>
          )}
          <strong>
            <small ref={messageRef} />
          </strong>
          <br />
          {!canGenerate && (
            <Warning>
              Static Site cannot be generated in dev mode. Start letterpad using
              `yarn prod`.
            </Warning>
          )}
          {canGenerate && (
            <Button
              success
              sm
              onClick={createStaticFiles}
              disabled={processing}
            >
              Create Static
            </Button>
          )}
        </StyledCard>
        <br />
      </div>
    </StyledSection>
  );
};

export default translate("translations")(CreateStatic);

const getHostName = () => {
  return location.host.replace(":", "_");
};

interface IParsedChunk {
  type: string;
  message: string;
}
function chunkToJSON(chunk: any): IParsedChunk {
  return JSON.parse(
    String.fromCharCode.apply(null, new Uint8Array(chunk.buffer) as any).trim(),
  );
}

function getReader() {
  const url = `${config.BASE_NAME}/admin/generateStaticSite`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      token: localStorage.token,
    },
  };
  return fetch(url, options).then(res => {
    return res.body && res.body.getReader();
  });
}
