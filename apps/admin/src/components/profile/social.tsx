import { Controller, useFormContext } from "react-hook-form";
import { Input } from "ui";

import { removeTypenames } from "@/shared/utils";

import { SaveButton } from "../save-button";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

const getUsernamefromUrl = (str: string | undefined) =>
  str ? str.split("/").pop() : "";

export const Social = () => {
  const { watch, control } = useFormContext();

  const verify = (e: ChangeEvent) => {
    if (e.target.value === "") return true;
    const res = /^[a-z0-9_\\.]+$/.exec(e.target.value);
    const valid = !!res;
    return valid;
  };

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <Controller
          name="social"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label="Twitter"
              addonBefore="@"
              placeholder="username"
              value={getUsernamefromUrl(watch("social.twitter"))}
              onChange={(e) => {
                if (!verify(e)) return;
                onChange({
                  ...removeTypenames(watch("social")),
                  twitter: e.target.value,
                });
              }}
            />
          )}
        />
        <Controller
          name="social"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label="Facebook"
              addonBefore="@"
              placeholder="username"
              value={getUsernamefromUrl(watch("social.facebook"))}
              onChange={(e) => {
                if (!verify(e)) return;
                onChange({
                  ...removeTypenames(watch("social")),
                  facebook: e.target.value,
                });
              }}
            />
          )}
        />

        <Controller
          name="social"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label="Instagram"
              addonBefore="@"
              placeholder="username"
              value={getUsernamefromUrl(watch("social.instagram"))}
              onChange={(e) => {
                if (!verify(e)) return;
                onChange({
                  ...removeTypenames(watch("social")),
                  instagram: e.target.value,
                });
              }}
            />
          )}
        />

        <Controller
          name="social"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label="Github"
              addonBefore="@"
              placeholder="username"
              value={getUsernamefromUrl(watch("social.github"))}
              onChange={(e) => {
                if (!verify(e)) return;
                onChange({
                  ...removeTypenames(watch("social")),
                  github: e.target.value,
                });
              }}
            />
          )}
        />

        <Controller
          name="social"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label="LinkedIn"
              addonBefore="@"
              placeholder="username"
              value={getUsernamefromUrl(watch("social.linkedin"))}
              onChange={(e) => {
                if (!verify(e)) return;
                onChange({
                  ...removeTypenames(watch("social")),
                  linkedin: e.target.value,
                });
              }}
            />
          )}
        />
      </div>
      <SaveButton />
    </>
  );
};
