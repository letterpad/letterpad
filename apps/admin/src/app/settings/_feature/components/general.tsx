import { useFormContext } from "react-hook-form";
import { Input, TextArea } from "ui";

import { SaveButton } from "@/components/save-button";

import { Setting } from "@/__generated__/__types__";

interface Props {}
const General: React.FC<Props> = () => {
  const data = useFormContext<Setting>();

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <Input
            label="Site Title"
            {...data.register("site_title", {
              required: true,
              maxLength: 30,
            })}
            placeholder="Name of your blog"
            data-testid="siteTitle"
            maxLength={30}
          />
          <div className="mt-2 text-right text-xs">
            {data.watch("site_title")?.length}/30
          </div>
        </div>
        <div>
          <Input
            label="Site Tagline"
            {...data.register("site_tagline", {
              required: true,
              maxLength: 60,
            })}
            maxLength={60}
            placeholder="A short phrase for your blog"
            data-testid="siteTagline"
          />
          <div className="mt-2 text-right text-xs">
            {data.watch("site_tagline")?.length}/60
          </div>
        </div>
        <Input
          label="Site Email (public)"
          {...data.register("site_email")}
          placeholder="e.g. foo@letterpad.app"
          data-testid="siteEmail"
        />

        <Input
          label="Site Url"
          {...data.register("site_url", { required: true })}
          placeholder="URL of your site"
        />
        <div>
          <TextArea
            label="Short Description"
            {...data.register("site_description", {
              required: false,
              maxLength: 190,
            })}
            placeholder="Write something about your site. Will be used in SEO and other pages"
            autoGrow={true}
            data-testid="shortDescription"
            maxLength={190}
          />
          <div className="mt-2 text-right text-xs">
            {data.watch("site_description")?.length}/190
          </div>
        </div>
        <TextArea
          label="Footer Description"
          {...data.register("site_footer", { maxLength: 200 })}
          placeholder="Anything that you want display in footer. html is allowed."
          autoGrow={true}
          maxLength={200}
          data-testid="footerDescription"
        />
      </div>
      <SaveButton testId="save-general" />
    </>
  );
};
export default General;
