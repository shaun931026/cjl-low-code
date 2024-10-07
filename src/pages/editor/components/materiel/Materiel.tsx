import { type DragEvent, useMemo } from "react";
import { useConfigs } from "../../useConfigContext";
import { useDragsDispatch } from "../../useDragContext";

import type { ComponentItem } from "../../interface";

import "./index.less";

export const Materiel = () => {
  const config = useConfigs();
  const dispatch = useDragsDispatch();

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    component: ComponentItem
  ) => {
    dispatch?.({
      type: "dragStart",
      payload: component,
    });
  };

  return (
    <div className="materiel">
      {(config?.componentsList || []).map((component) => (
        <div
          className="materiel-item"
          draggable
          key={component.type}
          onDragStart={(e) => handleDragStart(e, component)}
        >
          <div className="pointer-events-none">
            <div className="materiel-item-label">{component.label}</div>
            <div className="materiel-item-component">{component.preview()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
