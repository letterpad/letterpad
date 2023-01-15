import { FC, useRef } from "react";

import { Reset } from "./helpers";

export const ColorPicker: FC<{
  color: string;
  onColorChange: (color: string) => void;
}> = ({ color, onColorChange }) => {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="no-repeat h-7 w-7 overflow-hidden rounded-full bg-gray-50 p-1 shadow-lg hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-700 "
      style={{
        backgroundSize: "65%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKFSURBVEiJnZZNSBRhGMd/zzujomS1eQrXIC06BN3q1qVAFD8JKgJPId0iISQ6GBgYKEZR0CHQDnWog5TtotYlgsgoDPyoi+VHmvlVlFLKujNPh2033S9n/d/meZ75/ec/8868I6RR4MOFPa5DtSoVCiUGLar25TkIUygToEGMdou/bToVQ5IVuwbP+221mlT0LGCv79X4cuPHXYQu1qxGKW6ZjG+a+MLjoYZyCzOioufi4SlkUE5iOcM6eakqrUHTQLBBVIPADg/gjRLyEXmiA/UNSQ1KX2n5m9WK9v5QVUIqz5qfN8zOXteeylgSA3DstRa6wiPAeh86zrtQ2VbgMDcfYSoPNFBZGDOwoFkgPzr7NlRGfyjhdnqBR7UdS64ASOlLLVKb8YjPRh3J7uNwdt+GWsIqSoRHFca2io1rU5sM7ilJajiAjePUGBHKUxMg5TNJD4/Ipdyg7Es/lSSJFziAsN8Gdm8+GUniqv2rZrRTWf2x08s5KH7Z9vD7HyDh/U+mrM9zP6f7OzXv4IrPkwEsGZCvXibt8XnMxOJOM2T7woM5HvnMGEFHvcCtsYXYcfhjNuERDybKmFG0JxN4zGQ4m02TCEHjqHQD4UzgMZP0ScKoCZiVMwVTKPcyhccoqZN0SNvtaQPgOFwFljKFx0wSkyxhrTXDv4/dSl3BtAqnACdTeJIkLmidXLv7LWYA8Pt0wTMzvthojS24GdP/J3HdodyL0nonEK1t2FyWLh+4Ia7UAstb4C8b1RNWb/vN9cWE3Wux42ggK0wJqrdIsbriLxy4j+FQzlRrd3wz6V9FVLvqX/gFUyNChWL2gvonn/faFvoF5ZOI9rhr9tO8mZapVIy/GN0fwFJ56WoAAAAASUVORK5CYII=')`,
      }}
      onClick={() => colorPickerRef.current?.click()}
    >
      <input
        ref={colorPickerRef}
        type="color"
        className="-mb-8 cursor-pointer border-0 p-0 opacity-0"
        style={{
          transform: "translate(-25%, -25%)",
          width: "200%",
          height: "200%",
        }}
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
      />
      <Reset
        visible={!!color}
        className="-mt-7"
        onClick={() => onColorChange("")}
      />
    </div>
  );
};
