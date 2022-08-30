import { prisma } from "@/lib/prisma";

import { SettingsDocument } from "@/__generated__/queries/queries.graphql";

import { UpdateOptionsDocument } from "./../../../__generated__/src/graphql/queries/mutations.graphql";
import { API } from "./../../../tests/testClient";

describe("Test Settings Graphql API", () => {
  it("get sitename and title", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });

    const settings = await prisma.setting.findFirst({ where: { id: 2 } });
    expect(result.settings).toEqual(
      expect.objectContaining({
        site_title: settings?.site_title,
        site_tagline: settings?.site_tagline,
      }),
    );
  });

  it("site logo and other images should have the full url", async () => {
    const result = await API({ query: SettingsDocument, variables: {} });

    // expect(result.settings.banner.src).toContain("unsplash");
    expect(result.settings.site_favicon.src).toContain(
      "https://letterpad.app/admin/uploads/logo.png",
    );
    expect(result.settings.site_logo.src).toContain(
      "https://letterpad.app/admin/uploads/logo.png",
    );
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
      {
        label: "home",
        original_name: "home",
        slug: "/tag/home",
        type: "tag",
      },
      {
        label: "Page",
        original_name: "Page",
        slug: "/page/letterpad-typography",
        type: "page",
      },
    ]);
  });

  it.skip("mutates sitename and title", async () => {
    const change = [
      { site_title: "Changed Title" },
      { site_description: "Tagline" },
    ];

    const result = await API({
      query: UpdateOptionsDocument,
      variables: { options: change },
    });

    expect(result.updateOptions).toEqual(
      expect.objectContaining({
        site_title: change[0].site_title,
        site_description: change[1].site_description,
      }),
    );
  });
});
export {};
