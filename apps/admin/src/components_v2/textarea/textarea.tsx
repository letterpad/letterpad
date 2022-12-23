import classNames from "classnames";
import React, {
  ChangeEvent,
  forwardRef,
  HTMLProps,
  useEffect,
  useRef,
} from "react";

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
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const localRef = useRef<HTMLTextAreaElement>();
  useEffect(() => {
    if (!localRef.current) {
      return;
    }
    localRef.current.style.height = "auto";
    localRef.current.style.overflow = "hidden";
    const next = `${localRef.current.scrollHeight}px`;
    localRef.current.style.height = next;
  }, [localRef, props.value]);

  const setRef = (node: HTMLTextAreaElement) => {
    localRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const {
    className,
    autoGrow = false,
    disabled = false,
    error,
    label,
    ...rest
  } = props;
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      />
    </div>
  );
});
TextArea.displayName = "TextArea";
