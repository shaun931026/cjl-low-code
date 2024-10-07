import {
  type DragEvent,
  useMemo,
  useRef,
  useEffect,
  MouseEvent,
  useCallback,
} from "react";

import { Block } from "./Block";

import { useDrags, useDragsDispatch } from "../../useDragContext";

import type { BlockItem } from "../../interface";

import "./index.less";

export const Canvas = () => {
  const drags = useDrags();
  const dispatch = useDragsDispatch();

  const contentStyle = useMemo(() => {
    const { width, height } = drags?.scheme?.container || {};

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }, [drags]);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const { curComponent } = drags || {};

    if (!curComponent) return;

    const rect = contentRef.current?.getBoundingClientRect();
    const { left = 0, top = 0 } = rect || {};

    const block: BlockItem = {
      left: e.pageX - left,
      top: e.pageY - top,
      zIndex: 1,
      type: curComponent.type,
      alignCenter: true,
    };

    dispatch?.({
      type: "addComponent",
      payload: block,
    });
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = "none";
  };

  const handleMouseDown = () => {
    dispatch?.({
      type: "removeBlockFocus",
      payload: "all",
    });
  };

  const focusedBlocks = useMemo(() => {
    return drags?.scheme.blocks.filter((block) => block.focus) || [];
  }, [drags]);

  const unfocusedBlocks = useMemo(() => {
    return drags?.scheme.blocks.filter((block) => !block.focus) || [];
  }, [drags]);

  useEffect(() => {
    // console.log("focusedBlocks", focusedBlocks);
  }, [focusedBlocks]);

  const dragState = useRef({
    startX: 0,
    startY: 0,
    focusedBlocks: [] as any[],
  });

  const handleCanvasMouseMove = useCallback((e: globalThis.MouseEvent) => {
    const durX = e.clientX - dragState.current.startX;
    const durY = e.clientY - dragState.current.startY;

    const blocks = dragState.current.focusedBlocks.map((block) => {
      const left = block.left + durX;
      const top = block.top + durY;

      return {
        ...block,
        left,
        top,
      };
    });

    dispatch?.({
      type: "changeComponentPartial",
      payload: blocks,
    });
  }, []);

  const handleCanvasMouseUp = useCallback((e: globalThis.MouseEvent) => {
    document.removeEventListener("mousemove", handleCanvasMouseMove);
    document.removeEventListener("mouseup", handleCanvasMouseUp);
  }, []);

  const handleCanvasDragStart = (
    e: MouseEvent<HTMLDivElement>,
    focusedBlocks: BlockItem[]
  ) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      focusedBlocks: focusedBlocks.map((block) => ({ ...block })),
    };

    document.addEventListener("mousemove", handleCanvasMouseMove);
    document.addEventListener("mouseup", handleCanvasMouseUp);
  };

  const handleBlockMouseDown = (
    e: MouseEvent<HTMLDivElement>,
    block: BlockItem
  ) => {
    // TODO: 待优化
    e.preventDefault();
    e.stopPropagation();

    const newBlock: BlockItem = {
      ...block,
    };

    if (e.shiftKey) {
      if (focusedBlocks.length <= 1) {
        newBlock.focus = true;
      } else {
        newBlock.focus = !newBlock.focus;
      }
    } else {
      if (!newBlock.focus) {
        dispatch?.({
          type: "removeBlockFocus",
          payload: "all",
        });
        newBlock.focus = true;
      }
    }

    dispatch?.({
      type: "changeComponent",
      payload: newBlock,
    });

    let _focusedBlocks: BlockItem[] = [];

    if (focusedBlocks.length > 1 || e.shiftKey) {
      _focusedBlocks = (drags?.scheme.blocks || [])
        .filter((block) => block.uid !== newBlock.uid && block.focus)
        .concat(newBlock);
    } else {
      _focusedBlocks = [newBlock];
    }

    handleCanvasDragStart(e, _focusedBlocks);
  };

  return (
    <div className="editor-canvas">
      <div
        ref={contentRef}
        className="editor-canvas-content"
        style={contentStyle}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
      >
        {(drags?.scheme?.blocks || []).map((block) => (
          <Block
            key={block.uid}
            block={block}
            onMouseDown={(e) => handleBlockMouseDown(e, block)}
          />
        ))}
      </div>
    </div>
  );
};
