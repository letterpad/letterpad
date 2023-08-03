import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Input, Label, TextArea } from "ui";

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
              label="About You (html)"
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

        <div>
          <Label label="Avatar" />
          <Controller
            name="avatar"
            control={control}
            render={({ field: { onChange } }) => (
              <Upload
                className="h-28 w-28"
                url={watch("avatar") ?? ""}
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
      <Button type="submit" data-testid="basic-submit">
        Save
      </Button>
    </>
  );
};
