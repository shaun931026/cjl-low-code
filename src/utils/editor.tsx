import { Alert, Button, Input, Select } from "antd";

import type { ComponentItem } from "../pages/editor/interface";

export const generateConfig = () => {
  const componentsList: ComponentItem[] = [];
  const componentsMap: Record<string, ComponentItem> = {};

  const register = (component: ComponentItem) => {
    componentsList.push(component);
    componentsMap[component.type] = component;
  };

  return {
    componentsList,
    componentsMap,
    register,
  };
};

export const editorConfig = generateConfig();

editorConfig.register({
  label: "文本",
  type: "text",
  preview: () => "文本",
  render: () => "渲染文本",
});

editorConfig.register({
  label: "输入框",
  type: "input",
  preview: () => <Input placeholder="预览..." />,
  render: () => <Input />,
});

editorConfig.register({
  label: "按钮",
  type: "button",
  preview: () => <Button>按钮</Button>,
  render: (props) => <Button {...props}>按钮</Button>,
});

editorConfig.register({
  label: "警示信息",
  type: "alert",
  preview: () => <Alert message="Alert" />,
  render: (props) => <Alert message="Alert" {...props} />,
});

editorConfig.register({
  label: "选择框",
  type: "select",
  preview: () => <Select placeholder="请选择..." />,
  render: (props) => <Select placeholder="请选择..." {...props} />,
});
