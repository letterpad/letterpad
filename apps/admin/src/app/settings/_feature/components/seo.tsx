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
            help="This title will appear in search engines and browser tabs."
            limit={30}
          />
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
            help="In certain scenarios, this tagline will be displayed along with the title."
            limit={60}
          />
        </div>
        <Input
          label="Site Email (public)"
          {...data.register("site_email")}
          placeholder="e.g. foo@letterpad.app"
          data-testid="siteEmail"
          help="This email will be publicly visible on your site."
        />

        <Input
          label="Site Url / Canonical Url"
          {...data.register("site_url", { required: true })}
          placeholder="URL of your site"
          help="If you have a custom domain, enter it here."
        />

        <Input
          label="Submit Sitemap to Google"
          value={data.watch("site_url") + "/sitemap.xml"}
          readOnly
          placeholder="URL of your site"
          help="Submit this to Google Search Central for better indexing on Google."
        />

        <div>
          <TextArea
            label="Search Description"
            {...data.register("site_description", {
              required: false,
              maxLength: 190,
            })}
            placeholder="Tell the world the purpose of your blog.."
            autoGrow={true}
            data-testid="shortDescription"
            maxLength={190}
            help="Search engines will show this description in search results"
            limit={190}
          />
        </div>
      </div>
      <SaveButton testId="save-general" />
    </>
  );
};
export default General;
