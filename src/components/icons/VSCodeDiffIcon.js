import { SvgIcon } from "@material-ui/core";
import React from "react";
import { ReactComponent as MKIcon } from "./difficon.svg";

function VSCodeDiffIcon(props) {
  return (
    <SvgIcon {...props} component={MKIcon} viewBox="0 0 1000 1000"></SvgIcon>
  );
}
export default VSCodeDiffIcon;
