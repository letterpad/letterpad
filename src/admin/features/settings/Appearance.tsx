import { Image, Setting } from "../../../__generated__/gqlTypes";
import React, { createRef, useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { TextArea } from "../../components/input";
import { UpdateSettingOption } from "../../../types/types";
import { notify } from "react-notify-toast";
import styled from "styled-components";
import { uploadFile } from "../../server/util";

interface IMessagesProps extends WithNamespaces {
  updateOption: (option: UpdateSettingOption) => void;
  data: Setting;
}

enum name {
  banner,
  site_logo,
  site_favicon,
}

const Messages: React.FC<IMessagesProps> = ({ t, updateOption, data }) => {
  return (
    <div>
      <EditableImage
        updateValue={(value: Image) => updateOption({ site_logo: value })}
        image={data.site_logo.src}
        label="Upload Logo"
        height={50}
      />
      <EditableImage
        updateValue={(value: Image) => updateOption({ site_favicon: value })}
        image={data.site_favicon.src}
        label="Upload Favicon"
        height={20}
      />
      <EditableImage
        updateValue={(value: Image) => updateOption({ banner: value })}
        image={data.banner.src}
        label="Upload Banner"
        height={100}
      />
      <br />
      <TextArea
        label="Write CSS to further customize the theme"
        rows={7}
        defaultValue={data.css || ""}
        placeholder="Additional CSS"
        onChange={e => updateOption({ css: e.target.value })}
      />
    </div>
  );
};

export default translate("translations")(Messages);

interface IProps {
  image: string;
  updateValue: (value: Image) => void;
  label: string;
  height: number;
}
const EditableImage: React.FC<IProps> = ({
  image,
  updateValue,
  label,
  height,
}) => {
  const [src, setSrc] = useState<string>(image || "");
  const uploadInputRef = createRef<HTMLInputElement>();

  const update = (value: string, size: { width: number; height: number }) => {
    const { width, height } = size;
    updateValue({ src: value, width, height });
    setSrc(value);
  };

  const upload = async (files: FileList | null) => {
    if (!files) return;
    const uploadedFiles = await uploadFile({ files });
    let { src, errors, size } = uploadedFiles[0];
    if (errors) {
      notify.show(errors, "error", 3000);
      return;
    }
    update(src, size);
  };

  const onUploadAction = e => {
    e.preventDefault();
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const onDeleteAction = e => {
    e.preventDefault();
    update("", { width: 0, height: 0 });
  };

  const clickAction = !src ? onUploadAction : onDeleteAction;
  const actionLabel = !src ? "Upload" : "Delete";

  const notNullSrc =
    src ||
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  return (
    <ImageWrapper hasImage={src !== ""}>
      <label className="custom-label">{label}</label>
      <div className="logo-wrapper">
        <div className="logo-image">
          <img src={notNullSrc} height={height} />
        </div>
        <a href="#" onClick={clickAction}>
          {actionLabel}
        </a>
      </div>
      <input
        ref={uploadInputRef}
        onChange={input => upload(input.target.files)}
        type="file"
        className="hide"
        name="uploads[]"
      />
    </ImageWrapper>
  );
};

const ImageWrapper = styled.div<{ hasImage: boolean }>`
  margin-top: 15px;
  margin-bottom: 15px;
  img {
    max-width: 400px;
    background: #eee;
  }
  a {
    text-transform: uppercase;
    font-size: 0.7rem;
    color: ${p => (p.hasImage ? "#e4480b" : "var(--color-base)")};
  }
  label {
    opacity: 0.6;
    font-weight: 400;
    font-size: 0.8rem;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 15px;
  }
`;
