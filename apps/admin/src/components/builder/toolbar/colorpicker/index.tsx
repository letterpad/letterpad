import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { IoClose } from "react-icons/io5";

import { Buttonv2 } from "@/components_v2/button";
import { Label } from "@/components_v2/input";

import { Pattern } from "../../types";

interface Props extends Pattern {
  onChange: (pattern: Pattern) => void;
  onClose: () => void;
}

export const ColorPickerGradient: FC<Props> = ({
  onChange,
  background,
  gradientStart,
  gradientEnd,
  onClose,
}) => {
  const [active, setActive] = useState("background");

  const handleChange = (change) => {
    onChange({ background, gradientStart, gradientEnd, ...change });
  };

  const handleReset = () => {
    onChange({ background: "", gradientStart: "", gradientEnd: "" });
  };

  return (
    <div className="absolute -left-80 top-12 flex w-[24rem] flex-col gap-2 rounded-md bg-slate-300 p-4 dark:bg-slate-900">
      <div className="mb-4 flex justify-between">
        <span>Background Overlay Enhancer</span>
        <IoClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex w-full flex-row justify-between gap-2">
        <div className="flex flex-col items-start gap-2">
          <ColorBox
            color={background}
            isActive={active === "background"}
            label="Background"
            setActive={() => setActive("background")}
          />
          <ColorBox
            color={gradientStart}
            isActive={active === "gradientStart"}
            label="Dot Gradient Start"
            setActive={() => setActive("gradientStart")}
          />
          <ColorBox
            color={gradientEnd}
            isActive={active === "gradientEnd"}
            label="Dot Gradient End"
            setActive={() => setActive("gradientEnd")}
          />
        </div>
        <div>
          {active === "background" && (
            <RgbaStringColorPicker
              color={background}
              onChange={(color) => handleChange({ background: color })}
            />
          )}
          {active === "gradientStart" && (
            <RgbaStringColorPicker
              color={gradientStart}
              onChange={(color) => handleChange({ gradientStart: color })}
            />
          )}
          {active === "gradientEnd" && (
            <RgbaStringColorPicker
              color={gradientEnd}
              onChange={(color) => handleChange({ gradientEnd: color })}
            />
          )}
        </div>
        <style jsx global>{`
          .flex .react-colorful {
            width: 200px;
            height: 160px;
          }
          .flex .react-colorful__alpha,
          .flex .react-colorful__hue {
            height: 16px;
          }
          .flex .react-colorful__pointer {
            height: 16px;
            width: 16px;
          }
        `}</style>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Buttonv2 size="small" variant="ghost" onClick={onClose}>
          Close
        </Buttonv2>
        <Buttonv2 size="small" onClick={handleReset}>
          Reset
        </Buttonv2>
      </div>
    </div>
  );
};

const ColorBox = ({ color, isActive, setActive, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label label={label} />
      <div
        style={{ background: color }}
        className={classNames(
          "h-5 w-10 cursor-pointer rounded-md border-4 shadow-md",
          {
            "border-gray-600 dark:border-gray-200": !isActive,
            "border-blue-500": isActive,
          }
        )}
        onClick={() => setActive()}
      ></div>
    </div>
  );
};
