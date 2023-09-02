import { BiSave } from "react-icons/bi";
import { Button } from "ui";

export const SaveButton = ({
  testId,
  disabled,
  className,
}: {
  testId?: string;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <Button
      data-testid={testId}
      disabled={disabled}
      type="submit"
      className={`${className} flex items-center gap-1`}
    >
      <BiSave size={16} />
      Save
    </Button>
  );
};
