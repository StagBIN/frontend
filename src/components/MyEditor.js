import { useParams } from "react-router-dom";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const MyEditor = () => {
  const { id } = useParams();
  const [convertedText, setConvertedText] = useState(id);
  return (
    <div>
      <ReactQuill
        theme="bubble"
        value={convertedText || ""}
        onChange={setConvertedText}
      />
    </div>
  );
};

export default MyEditor;
