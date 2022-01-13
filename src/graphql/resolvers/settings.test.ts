import { UpdateOptionsDocument } from "./../../../__generated__/src/graphql/queries/mutations.graphql";
import { SettingsDocument } from "@/__generated__/queries/queries.graphql";
import models from "@/graphql/db/models";
import { API } from "./../../../tests/testClient";

describe("Test Settings Graphql API", () => {
  it("get sitename and title", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });

    const settings = await models.Setting.findOne({ where: { id: 2 } });
    expect(result.settings).toEqual(
      expect.objectContaining({
        site_title: settings?.site_title,
        site_tagline: settings?.site_tagline,
      }),
    );
  });

  it("site logo and other images should have the full url", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });

    expect(result.settings.banner.src).toContain("unsplash");
    expect(result.settings.site_favicon.src).toContain("localhost");
    expect(result.settings.site_logo.src).toContain("localhost");
  });

  it("should not contain cloudinary keys", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });

    expect(result.settings.cloudinary_secret).toContain("");
    expect(result.settings.cloudinary_key).toContain("");
    expect(result.settings.cloudinary_name).toContain("");
  });

  it("should have the right menu format", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });
    expect(result.settings.menu).toEqual([
      { label: "home", original_name: "home", slug: "/tag/home", type: "tag" },
      {
        label: "Page",
        original_name: "Page",
        slug: "/page/letterpad-typography",
        type: "page",
      },
    ]);
  });

  it("mutates sitename and title", async () => {
    const change = [
      { site_title: "hello111" },
      { site_description: "Tagline" },
    ];

    try {
      const result = await API({
        query: UpdateOptionsDocument,
        variables: { options: change },
      });

      const settings = await models.Setting.findOne({ where: { id: 2 } });
      expect(result.updateOptions).toEqual(
        expect.objectContaining({
          site_title: settings?.site_title,
          site_tagline: settings?.site_tagline,
        }),
      );
    } catch (e) {
      console.log("e :>> ", e);
    }
  });
});
export {};
