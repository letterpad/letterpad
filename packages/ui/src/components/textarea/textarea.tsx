import classNames from "classnames";
import { ChangeEvent, forwardRef, HTMLProps, useRef } from "react";

const classes = {
  base: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-red-500 focus:border-red-500 dark:focus:border-red-500",
};

interface Props extends HTMLProps<HTMLTextAreaElement> {
  value?: string;
  label?: string;
  autoGrow?: boolean;
  className?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  labelClassName?: string;
  error?: boolean;
  limit?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const localRef = useRef<HTMLTextAreaElement>();
  const onKeyUp = () => {
    if (!localRef.current) {
      return;
    }
    localRef.current.style.height = "auto";
    localRef.current.style.overflow = "hidden";
    const next = `${localRef.current.scrollHeight}px`;
    localRef.current.style.height = next;
  };

  const setRef = (node: HTMLTextAreaElement) => {
    localRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= rest.value?.length!) {
      return rest.onChange?.(e);
    }
    if (limit && e.target.value.length > limit) {
      return;
    }
    rest.onChange?.(e);
  };

  const {
    className,
    autoGrow = false,
    disabled = false,
    error,
    label,
    labelClassName,
    limit,
    ...rest
  } = props;
  return (
    <div className="relative">
      {label && (
        <label
          className={classNames(
            "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <textarea
        ref={setRef}
        disabled={disabled}
        className={classNames(
          error && classes.error,
          classes.base,
          disabled && classes.disabled,
          className
        )}
        {...rest}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      {limit && (
        <div className="mt-2 text-right text-xs">{`${rest.value?.length}/${limit}`}</div>
      )}
    </div>
  );
});
TextArea.displayName = "TextArea";
