import React, { useReducer } from "react";

interface Props {
  labelProps?: string;
  stateProp: "filled" | "active" | "default";
  className?: string;
}

export const TextInputConfirm = ({
  labelProps = "Confirm password",
  stateProp,
  className,
}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp,
  });

  return (
    <div
      className={`flex flex-col items-start gap-1 relative ${
        ["default", "filled"].includes(state.state) ? "w-[100px]" : ""
      } ${className}`}
      onClick={() => dispatch("click")}
    >
      <div className="[font-family:'Nunito-Regular',Helvetica] w-fit mt-[-1.00px] tracking-[0] text-xs text-[#202833] relative font-normal whitespace-nowrap leading-[17px]">
        {labelProps}
      </div>

      <div
        className={`border border-solid w-full flex self-stretch items-center gap-2 flex-[0_0_auto] shadow-[0px_2px_2px_#ffffff26,inset_0px_2px_2px_#0000001a] px-3 py-2 overflow-hidden rounded-lg bg-white relative ${
          state.state === "default" ? "border-[#d4dce4]" : "border-[#202833]"
        }`}
      >
        <div
          className={`[font-family:'Nunito-Regular',Helvetica] w-fit mt-[-1.00px] tracking-[0] text-xs relative font-normal whitespace-nowrap leading-[17px] ${
            state.state === "default" ? "text-[#d4dce4]" : "text-[#202833]"
          }`}
        >
          Type here...
        </div>
      </div>
    </div>
  );
};

function reducer(state: any, action: any) {
  if (state.state === "active" && action === "click") {
    return { state: "filled" };
  }
  if (state.state === "default" && action === "click") {
    return { state: "active" };
  }
  return state;
}

