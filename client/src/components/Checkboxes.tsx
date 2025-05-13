
import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";

interface Props {
  type: "unselected";
  stateProp: "hovered" | "enabled";
  className: any;
  containerClassName: any;
}

export const Checkboxes = ({
  type,
  stateProp,
  className,
  containerClassName,
}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    type: type || "unselected",

    state: stateProp || "hovered",
  });

  return (
    <div
      className={`inline-flex flex-col items-center p-1 justify-center relative ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
    >
      <div
        className={`inline-flex items-center flex-[0_0_auto] p-[11px] rounded-[100px] justify-center relative ${state.state === "hovered" ? "bg-[#1d1b2014]" : ""}`}
      >
        <div
          className={`border-2 border-solid w-[18px] h-[18px] rounded-sm relative ${state.state === "enabled" ? "border-[#49454f]" : "border-[#1d1b20]"} ${containerClassName}`}
        />
      </div>
    </div>
  );
};

function reducer(state: any, action: any) {
  switch (action) {
    case "mouse_leave":
      return {
        ...state,
        state: "enabled",
      };

    case "mouse_enter":
      return {
        ...state,
        state: "hovered",
      };
  }

  return state;
}

Checkboxes.propTypes = {
  type: PropTypes.oneOf(["unselected"]),
  stateProp: PropTypes.oneOf(["hovered", "enabled"]),
};
