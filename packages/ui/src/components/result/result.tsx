import { FC, ReactNode } from "react";
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";

interface Props {
  status: "success" | "error" | "warning";
  title: string;
  subTitle?: string;
  extra?: ReactNode[];
}
const iconProps = {
  size: 54,
};
let icon = <TiTick {...iconProps} className="rounded-full bg-green-500 p-2" />;

export const Result: FC<Props> = ({ status, title, subTitle, extra }) => {
  if (status === "error") {
    icon = <IoMdClose {...iconProps} className="rounded-full bg-red-500 p-2" />;
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 text-center">
      <div className="mb-8 flex justify-center">{icon}</div>
      <h2 className="text-2xl">{title}</h2>
      {subTitle && <p className="">{subTitle}</p>}
      {extra}
    </div>
  );
};
