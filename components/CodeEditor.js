import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

// 创建一个名为CodeEditor的公共组件
const CodeEditor = forwardRef((props, ref) => {
  const [code, setCode] = useState(props.value || "");
  const extensions = [javascript({ jsx: true })];

  const handleChange = useCallback((val) => {
    setCode(val);
    props.onChange(val);
  }, []);

  useImperativeHandle(ref, () => ({
    handleChange,
  }));

  return (
    <div className="rounded-sm overflow-hidden">
      <CodeMirror
        value={code}
        height={props.height || "300px"}
        theme={oneDark}
        extensions={extensions}
        onChange={handleChange}
      />
    </div>
  );
});

export default CodeEditor;
