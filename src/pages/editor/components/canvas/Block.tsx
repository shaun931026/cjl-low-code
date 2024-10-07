import {
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
} from "react";

import { useConfigs } from "../../useConfigContext";
import { useDragsDispatch } from "../../useDragContext";

import type { BlockItem } from "../../interface";

import "./index.less";

export interface BlockProps {
  block: BlockItem;
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void
}

export const Block = (props: BlockProps) => {
  const { block, onMouseDown } = props;

  const config = useConfigs();
  const dispatch = useDragsDispatch();

  const component = useMemo(() => {
    return config?.componentsMap[block.type];
  }, [config, block]);

  const blockStyle = useMemo(() => {
    const { left, top, zIndex } = block;

    // const finalLeft = Math.max(0, left);
    // const finalTop = Math.max(0, top);

    return { left: `${left}px`, top: `${top}px`, zIndex };
  }, [block]);

  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blockRef.current) return;

    if (!block.alignCenter) return;

    const { offsetWidth, offsetHeight } = blockRef.current;

    const newBlock: BlockItem = {
      ...block,
      left: block.left - offsetWidth / 2,
      top: block.top - offsetHeight / 2,
      alignCenter: false,
    };

    dispatch?.({
      type: "changeComponent",
      payload: newBlock,
    });
  }, []);

  return (
    <div
      ref={blockRef}
      className={`editor-block ${block.focus ? "editor-block-focus" : ""}`}
      style={blockStyle}
      onMouseDown={onMouseDown}
    >
      <div className="pointer-events-none">
        {component && component.render(block.props)}
      </div>
    </div>
  );
};
