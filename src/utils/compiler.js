import Swal from "sweetalert2";

const compilePython = async (code) => {
  const pyodide = await window.loadPyodide();
  try {
    pyodide.runPython(`import sys
import io
sys.stdout = io.StringIO()`);
    pyodide.runPython(code);
    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Code compiled successfully",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-end",
    });
    return stdout;
  } catch (error) {
    console.log(error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Code compilation failed",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "center-end",
    });
    return error.message;
  }
};

const compiler = async (code, language) => {
  switch (language) {
    case "python":
      // TODO: Lazy load pyodide
      return await compilePython(code);
    default:
      return "Language not supported";
  }
};

export default compiler;
