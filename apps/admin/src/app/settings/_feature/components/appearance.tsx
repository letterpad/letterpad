import { Controller, useFormContext } from "react-hook-form";
import { Button, Label, TextArea } from "ui";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { SaveButton } from "@/components/save-button";
import { UpgradeLabel } from "@/components/upgrade-plan-banner";
import { Upload } from "@/components/upload";

import { removeTypenames } from "@/shared/utils";
import { isMembershipFeatureActive } from "@/utils/config";

import { MixBlendCheckbox } from "./mixBlend";

const Appearance = () => {
  const data = useFormContext();
  const membershipFeatureActive = isMembershipFeatureActive();
  const isPaidMember = useIsPaidMember();

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4">
        <Label label="Brand Color - Choose a color that reflects your brand." />
        <div className="flex flex-col items-start space-y-5">
          <Controller
            name="design"
            control={data.control}
            render={({ field: { onChange } }) => (
              <>
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
                <MixBlendCheckbox
                  mixBlendDifference={data?.getValues(
                    "design.mix_blend_difference"
                  )}
                  onChange={(value) =>
                    onChange({
                      ...removeTypenames(data?.watch("design")),
                      mix_blend_difference: value,
                    })
                  }
                />
              </>
            )}
          />

          <Button
            type="submit"
            size="small"
            onClick={() => {
              const siteUrl = data.getValues("site_url");
              setTimeout(() => {
                window.open(siteUrl, "_blank");
              }, 500);
            }}
          >
            Save & Preview
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
      <TextArea
        label="Footer Description"
        {...data.register("site_footer", { maxLength: 200 })}
        placeholder="Anything that you want display in footer. html is allowed."
        autoGrow={true}
        maxLength={200}
        data-testid="footerDescription"
        help={
          <>
            <span>This will appear in the footer of your site. </span>
            {!isPaidMember && membershipFeatureActive && <UpgradeLabel />}
          </>
        }
        // help={<span>hello</span>}
        disabled={!isPaidMember && membershipFeatureActive}
      />
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
                fontFamily: "monospace",
                fontSize: 13,
                minHeight: 200,
              }}
              value={data?.watch("css") ?? ""}
              data-testid="css"
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
