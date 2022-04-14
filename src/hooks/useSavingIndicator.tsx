// import { Spinner } from "@/components/spinner";
import { subscribe } from "@/shared/eventBus";
import { message } from "antd";

import { useState, useEffect } from "react";

const key = "msg";
export const useSavingIndicator = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    subscribe("save", (msg) => {
      message.destroy(key);
      clearTimeout(timeout);
      setMsg(msg);
      timeout = setTimeout(() => {
        setMsg("");
      }, 1000);
    });
    subscribe("networkError", (msg) => {
      setMsg("");
      message.error({ content: msg, key, duration: 50 });
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        textAlign: "center",
        width: "100%",
        left: 0,
        zIndex: 99999999999,
        top: 0,
        color: "#fff",
      }}
    >
      {msg ? <div className="a">{msg}</div> : <span />}
      <style jsx>{`
        .a {
          padding: 4px 25px;
          background: #149e7e;
          border-bottom-left-radius: 4px;
          display: inline-flex;
          border-bottom-right-radius: 4px;
        }
      `}</style>
    </div>
  );
};
