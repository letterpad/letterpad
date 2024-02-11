import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Label, TextArea } from "ui";

import { SaveButton } from "@/components/save-button";
import { Upload } from "@/components/upload";

export const Basic = () => {
  const { register, watch, control } = useFormContext();

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="Write you full name"
          {...register("name", { required: true })}
          data-testid="name"
        />
        <Input
          label="Occupation"
          placeholder="What do you do ?"
          {...register("occupation")}
          data-testid="occupation"
        />
        <Controller
          name="bio"
          control={control}
          render={({ field: { onChange } }) => (
            <TextArea
              label="About You (html allowed)"
              placeholder="Write about you. This will be displayed in the about me page. (4000 characters)"
              value={watch("bio")}
              onChange={onChange}
              autoGrow={true}
              rows={5}
              maxLength={4000}
              data-testid="about"
            />
          )}
        />
        <Controller
          name="signature"
          control={control}
          render={({ field: { onChange } }) => (
            <TextArea
              label="Signature after every post"
              placeholder="This will be displayed after every post (400 characters)"
              value={watch("signature")}
              onChange={onChange}
              autoGrow={true}
              rows={5}
              maxLength={400}
              data-testid="signature"
            />
          )}
        />
        <div>
          <Label label="Avatar" />
          <Controller
            name="avatar"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Upload
                className="h-28 w-28"
                url={watch("avatar")}
                onSuccess={([res]) => {
                  onChange(res.src);
                }}
              />
            )}
          />
        </div>
        <Input
          label="Company Name"
          placeholder="Which company do you work for ?"
          {...register("company_name")}
          data-testid="company"
        />
      </div>
      <SaveButton testId="basic-submit" />
    </>
  );
};
