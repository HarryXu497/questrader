import { DetailedHTMLProps, InputHTMLAttributes, JSX, Ref } from "react";

export default function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { ref?: Ref<HTMLInputElement>; prefixContent?: JSX.Element }
) {
  const { ref, prefixContent, ...otherProps } = props;
  return (
    <div className="border-1 rounded-[20px] border-[#8B8B8B] flex flex-row gap-2 items-center pl-4 focus-within:outline-2 outline-accent">
      {prefixContent}
      <input
        ref={ref}
        {...otherProps}
        className="pr-4 pl-1 py-3 w-full rounded-[20px] outline-none"
      />
    </div>
  );
}
