import { useContext } from "react";

import Editor from "@monaco-editor/react";

import { StagBinContext } from "../App";

export default function MCompiler() {
  const {
    theme: curTheme,
    language,
    data,
    setData,
    output,
  } = useContext(StagBinContext);

  const editor = (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "65px",
          left: "64px",
          zIndex: 2,
          fontSize: "medium",
          display: data ? "none" : "block",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        * Code and compile right on your browser!!!
      </div>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Editor
          id="editor"
          key="editor"
          theme={curTheme === "light" ? "light" : "vs-dark"}
          height="52vh"
          language={language}
          value={data}
          colorDecorators="true"
          options={{
            renderLineHighlight: "none",
          }}
          onChange={(value) => {
            setData(value);
          }}
        />
        {/* Add a output div with remaining height */}
        Output:
        <Editor
          id="output"
          key="output"
          theme={curTheme === "light" ? "light" : "vs-dark"}
          height="32vh"
          language={language}
          value={output}
          colorDecorators="true"
          options={{
            renderLineHighlight: "none",
            // disable number
            lineNumbers: "off",
            readOnly: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );

  // console.log(language);
  return editor;
}
