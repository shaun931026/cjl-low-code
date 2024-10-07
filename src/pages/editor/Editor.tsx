import { useState } from "react";

import { ConfigProvider } from "./useConfigContext";
import { DragProvider } from "./useDragContext";

import { Materiel } from "./components/materiel/Materiel";
import { Canvas } from "./components/canvas/Canvas";

import type { Scheme } from "./interface";

import DefaultScheme from "./scheme.json";
import "./index.less";

export const Editor = () => {
  const [scheme, setScheme] = useState<Scheme>(DefaultScheme);

  return (
    <ConfigProvider>
      <DragProvider>
        <div className="editor">
          <div className="editor-materiel">
            <Materiel />
          </div>

          <div className="editor-main">
            <div className="editor-tools"></div>

            <div className="editor-canvas-wrap">
              <Canvas />
            </div>
          </div>

          <div className="editor-settings"></div>
        </div>
      </DragProvider>
    </ConfigProvider>
  );
};
