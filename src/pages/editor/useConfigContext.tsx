import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { editorConfig } from "../../utils/editor";

import type { ComponentItem } from "./interface";

interface ConfigValue {
  componentsList: ComponentItem[];
  componentsMap: Record<string, ComponentItem>;
}

const ConfigContext = createContext<ConfigValue | null>(null);

export const ConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [config] = useState({
    componentsList: editorConfig.componentsList,
    componentsMap: editorConfig.componentsMap,
  });

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export const useConfigs = () => {
  return useContext(ConfigContext);
};
