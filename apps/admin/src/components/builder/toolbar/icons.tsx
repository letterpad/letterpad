import { IconBaseProps } from "react-icons";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineBgColors,
  AiOutlineDelete,
  AiOutlineEye,
} from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import { IoAddCircleOutline, IoCloseOutline, IoText } from "react-icons/io5";
import { RiFullscreenFill, RiToolsFill } from "react-icons/ri";
import { TbLayoutColumns } from "react-icons/tb";

export const IconDelete = (props: IconBaseProps) => (
  <AiOutlineDelete {...props} />
);

export const IconAdd = (props: IconBaseProps) => (
  <IoAddCircleOutline {...props} />
);

export const IconClose = (props: IconBaseProps) => (
  <IoCloseOutline {...props} />
);

export const IconImage = (props: IconBaseProps) => <BiImageAdd {...props} />;

export const IconText = (props: IconBaseProps) => <IoText {...props} />;

export const IconRefresh = (props: IconBaseProps) => (
  <IoIosRefresh {...props} />
);

export const IconUp = (props: IconBaseProps) => <AiOutlineArrowUp {...props} />;

export const IconDown = (props: IconBaseProps) => (
  <AiOutlineArrowDown {...props} />
);

export const IconSmallHeight = ({ stroke = "rgb(var(--color))", size = 20 }) =>
  "A";

export const IconSplit = (props: IconBaseProps) => (
  <TbLayoutColumns {...props} />
);

export const IconThreeCols = (props: IconBaseProps) => (
  <BsLayoutThreeColumns {...props} />
);

export const IconFullWidth = (props: IconBaseProps) => (
  <RiFullscreenFill {...props} />
);

export const IconEye = (props: IconBaseProps) => <AiOutlineEye {...props} />;

export const IconTools = (props: IconBaseProps) => <RiToolsFill {...props} />;

export const IconGradient = (props: IconBaseProps) => (
  <AiOutlineBgColors {...props} />
);
