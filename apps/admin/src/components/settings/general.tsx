import { useFormContext } from "react-hook-form";
import { Button, Input, TextArea } from "ui";

interface Props {}
const General: React.FC<Props> = () => {
  const data = useFormContext();

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <Input
          label="Site Title"
          {...data.register("site_title", {
            required: true,
            maxLength: 30,
          })}
          placeholder="Name of your blog"
          data-testid="siteTitle"
          limit={30}
        />

        <Input
          label="Site Tagline"
          {...data.register("site_tagline", { required: true, maxLength: 60 })}
          placeholder="A short phrase for your blog"
          data-testid="siteTagline"
          limit={60}
        />

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

        <TextArea
          label="Short Description"
          {...data.register("site_description", {
            required: true,
            maxLength: 190,
          })}
          placeholder="Write something about your site. Will be used in SEO and other pages"
          autoGrow={true}
          data-testid="shortDescription"
          limit={190}
        />

        <TextArea
          label="Footer Description"
          {...data.register("site_footer", { maxLength: 200 })}
          placeholder="Anything that you want display in footer. html is allowed."
          autoGrow={true}
          maxLength={200}
          data-testid="footerDescription"
        />
      </div>
      <Button data-testid="save-general" type="submit">
        Save
      </Button>
    </>
  );
};
export default General;
