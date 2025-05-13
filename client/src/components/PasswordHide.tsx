import React from "react";
import { useReducer } from "react";
import { TextInputConfirm } from "@/components/PasswordConfirm";
import type { JSX } from "react";
import vector3 from "../assets/vector-3.png";

interface Props {
  property1: "password-unchecked" | "password-checked";
  className: any;
  textInputConfirmStateActiveClassName: any;
  uncheckedPasswordClassName: any;
  ellipseClassName: any;
  vectorClassName: any;
  vector: string;
}

export const PasswordHide = ({
  property1,
  className,
  textInputConfirmStateActiveClassName,
  uncheckedPasswordClassName,
  ellipseClassName,
  vectorClassName,
  vector = "image.svg",
}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1 || "password-unchecked",
  });

  return (
    <div
      className={`h-[62px] ${state.property1 === "password-checked" ? "w-[294px]" : "w-[295px]"} ${className}`}
    >
      <div className="h-[62px] relative">
        <TextInputConfirm
          className={textInputConfirmStateActiveClassName}
          labelProps="Password"
          stateProp={
            state.property1 === "password-checked" ? "active" : "default"
          }
          text={
            state.property1 === "password-checked" ? "***********" : undefined
          }
        />
        <div
          className={`top-[29px] h-[13px] absolute ${state.property1 === "password-checked" ? "border border-solid" : ""} ${state.property1 === "password-checked" ? "border-[#202833]" : ""} ${state.property1 === "password-checked" ? "w-3.5" : "w-[19px]"} ${state.property1 === "password-checked" ? "left-[274px]" : "left-[269px]"} ${state.property1 === "password-checked" ? "rounded-[7px/6.5px]" : ""} ${uncheckedPasswordClassName}`}
          onClick={() => {
            dispatch("click");
          }}
        >
          {state.property1 === "password-unchecked" && (
            <>
              <div
                className={`absolute w-[13px] h-[13px] top-0 left-1.5 rounded-[6.47px/6.5px] border border-solid border-[#202833] ${ellipseClassName}`}
              />

              <img
                className={`absolute w-2 h-[5px] top-[-704px] left-[592px] ${vectorClassName}`}
                alt="Vector"
                src={vector}
              />
            </>
          )}

          {state.property1 === "password-checked" && (
            <img
              className="absolute w-[9px] h-1.5 top-0.5 left-px"
              alt="Vector"
              src={vector3}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function reducer(state: any, action: any) {
  if (state.property1 === "password-unchecked") {
    switch (action) {
      case "click":
        return {
          property1: "password-checked",
        };
    }
  }

  if (state.property1 === "password-checked") {
    switch (action) {
      case "click":
        return {
          property1: "password-unchecked",
        };
    }
  }

  return state;
}
