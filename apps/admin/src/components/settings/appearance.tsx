import { Controller, useFormContext } from "react-hook-form";
import { Button, Input, Label, Select, TextArea } from "ui";

import { Upload } from "@/components/upload";

import { removeTypenames } from "@/shared/utils";

import { fontItemsSans, fontItemsSerif, fonts } from "../fonts";
import { SaveButton } from "../save-button";

const Appearance = () => {
  const data = useFormContext();
  return (
    <div className="grid gap-8">
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <Label label="Primary Font" className="mb-2" />
          <p className="mb-2 dark:text-gray-400">
            Applies this font globally. Good for long texts.
          </p>
          <Controller
            name="design"
            control={data.control}
            render={({ field: { onChange } }) => (
              <Select
                items={fontItemsSans}
                onChange={(key) => {
                  onChange({
                    ...removeTypenames(data?.watch("design")),
                    primary_font: key,
                  });
                }}
                selected={data?.watch("design.primary_font") ?? "Inter"}
                id="design.primary_font"
              />
            )}
          />
          <p
            className={`${
              fonts[data?.watch("design.primary_font") ?? "Inter"].className
            } pt-2`}
          >
            A quick brown fox jumps over the lazy dog.
          </p>
        </div>
        <div>
          <Label label="Secondary Font" className="mb-2" />
          <p className="mb-2 dark:text-gray-400">
            Applies this font to all headings across your site.
          </p>
          <Controller
            name="design"
            control={data.control}
            render={({ field: { onChange } }) => (
              <Select
                items={fontItemsSerif}
                onChange={(key) => {
                  onChange({
                    ...removeTypenames(data?.watch("design")),
                    secondary_font: key,
                  });
                }}
                selected={data?.watch("design.secondary_font") ?? "Inter"}
                id="design.secondary_font"
              />
            )}
          />
          <p
            className={`${
              fonts[data?.watch("design.secondary_font") ?? "Inter"].className
            } pt-2`}
          >
            A quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Label label="Brand Color - Choose a color that reflects your brand." />
        <div className="flex flex-row items-center gap-2">
          <Controller
            name="design"
            control={data.control}
            render={({ field: { onChange } }) => (
              <input
                type="color"
                className="h-20 w-32"
                value={data?.getValues("design.brand_color")}
                onChange={(e) =>
                  onChange({
                    ...removeTypenames(data?.watch("design")),
                    brand_color: e.target.value,
                  })
                }
              />
            )}
          />

          <Button
            onClick={() => window.open(data.getValues("site_url"), "_blank")}
          >
            Preview
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <Controller
          name="site_logo"
          control={data.control}
          render={({ field: { onChange } }) => (
            <Upload
              label="Logo"
              className="h-28 w-28"
              url={data?.watch("site_logo.src") ?? ""}
              onSuccess={([res]) => {
                onChange({
                  src: res.src,
                  width: res.size?.width,
                  height: res.size?.height,
                });
              }}
            />
          )}
        />
        <Controller
          name="site_favicon"
          control={data.control}
          render={({ field: { onChange } }) => (
            <Upload
              label="Favicon"
              className="h-28 w-28"
              url={data?.watch("site_favicon.src") ?? ""}
              onSuccess={([res]) => {
                onChange({
                  src: res.src,
                  width: res.size?.width,
                  height: res.size?.height,
                });
              }}
            />
          )}
        />
        <Controller
          name="banner"
          control={data.control}
          render={({ field: { onChange } }) => (
            <Upload
              label="Banner"
              className="h-28 w-28"
              url={data?.watch("banner.src") ?? ""}
              onSuccess={([res]) => {
                onChange({
                  src: res.src,
                  width: res.size?.width,
                  height: res.size?.height,
                });
              }}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="css"
          control={data.control}
          render={({ field: { onChange } }) => (
            <TextArea
              label="CSS"
              onChange={onChange}
              placeholder="Add css to customise your website"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 13,
                minHeight: 200,
              }}
              value={data?.watch("css") ?? ""}
            />
          )}
        />

        <br />
        <SaveButton />
      </div>
    </div>
  );
};
export default Appearance;
