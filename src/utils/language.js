const detectLanguage = (code) => {
  if (code.includes("import java")) {
    return "java";
  } else if (code.includes("import ") && code.includes("print(")) {
    return "python";
  } else if (code.includes("#include") && code.includes("cout")) {
    return "cpp";
  } else if (code.includes("#include")) {
    return "c";
  } else if (code.includes("<html>") || code.includes("</html>")) {
    return "html";
  } else if (code.includes("func main()")) {
    return "go";
  } else if (code.includes("function") && code.includes(";")) {
    return "javascript";
  } else if (code.includes("#") && code.includes("-")) {
    return "markdown";
  } else if (code.includes("{") && code.includes("}") && code.includes(":")) {
    return "css";
  } else {
    return "javascript";
  }
};

export default detectLanguage;
