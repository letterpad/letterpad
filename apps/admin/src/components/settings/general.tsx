import { useState } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";
import { TextArea } from "@/components_v2/textarea";

import { SettingInputType } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  settings: SettingsFragmentFragment;
}
const General: React.FC<Props> = ({ settings }) => {
  const { banner, site_logo, site_favicon, ...rest } = settings;
  const [fields, setFields] = useState<SettingInputType>({
    site_title: settings.site_title,
    site_description: settings.site_description,
    site_tagline: settings.site_tagline,
    site_email: settings.site_email,
    site_url: settings.site_url,
    site_footer: settings.site_footer,
  });

  const { updateSettingsAPI } = useUpdateSettings();

  const onChange = (e, field: keyof SettingInputType) => {
    setFields({ ...fields, [field]: e.target.value });
  };
  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <Input
          label="Site Title"
          onChange={(e) => onChange(e, "site_title")}
          value={fields.site_title}
          placeholder="Name of your blog"
          data-testid="siteTitle"
          limit={30}
        />

        <Input
          label="Site Tagline"
          onChange={(e) => onChange(e, "site_tagline")}
          value={fields.site_tagline}
          placeholder="A short phrase for your blog"
          data-testid="siteTagline"
          limit={60}
        />

        <Input
          label="Site Email (public)"
          onChange={(e) => onChange(e, "site_email")}
          value={fields.site_email}
          placeholder="e.g. foo@letterpad.app"
          data-testid="siteEmail"
        />

        <Input
          label="Site Url"
          onChange={(e) => onChange(e, "site_url")}
          value={fields.site_url}
          placeholder="URL of your site"
        />

        <TextArea
          label="Short Description"
          onChange={(e) => onChange(e, "site_description")}
          value={fields.site_description}
          placeholder="Write something about your site. Will be used in SEO and other pages"
          autoGrow={true}
          data-testid="shortDescription"
          limit={190}
        />

        <TextArea
          label="Footer Description"
          onChange={(e) => onChange(e, "site_footer")}
          value={fields.site_footer}
          placeholder="Anything that you want display in footer. html is allowed."
          autoGrow={true}
          maxLength={200}
          data-testid="footerDescription"
        />
      </div>
      <Buttonv2
        onClick={() => updateSettingsAPI(fields)}
        data-testid="save-general"
      >
        Save
      </Buttonv2>
    </>
  );
};
export default General;
