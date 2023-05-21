import { SvgIcon } from "@material-ui/core";
import React from "react";
import { ReactComponent as RAWIcon } from "./rawicon.svg";

function RawIcon(props) {
  return (
    <SvgIcon
      {...props}
      component={RAWIcon}
      style={{
        margin: "0 10px 0 0",
      }}
      viewBox="0 10 30 15"
    ></SvgIcon>
  );
}
export default RawIcon;
