import { SvgIcon } from "@material-ui/core";
import React from "react";
import { ReactComponent as MKIcon } from "./markdownicon.svg";

function MarkdownIcon(props) {
  return (
    <SvgIcon {...props} component={MKIcon} viewBox="0 0 200 120.6"></SvgIcon>
  );
}
export default MarkdownIcon;
