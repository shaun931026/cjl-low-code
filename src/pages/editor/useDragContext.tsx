import {
  createContext,
  useReducer,
  type FC,
  type ReactNode,
  type Dispatch,
  useContext,
} from "react";

import type { BlockItem, ComponentItem, Scheme } from "./interface";
import { createMapByKey } from "../../utils";

interface ContextValue {
  scheme: Scheme;
  curComponent?: ComponentItem;
}

interface AddComponentAction {
  type: "addComponent";
  payload: BlockItem;
}

interface ChangeComponentAction {
  type: "changeComponent";
  payload: BlockItem;
}

interface ChangeComponentPartialAction {
  type: "changeComponentPartial";
  payload: BlockItem[];
}

interface ChangeComponentAllAction {
  type: "changeComponentAll";
  payload: BlockItem[];
}

interface RemoveFocusAction {
  type: "removeBlockFocus";
  payload: "all";
}

interface DeleteComponentAction {
  type: "delete";
  payload: BlockItem;
}

interface DragStartAction {
  type: "dragStart";
  payload: ComponentItem;
}

type DragAction =
  | AddComponentAction
  | ChangeComponentAction
  | ChangeComponentPartialAction
  | ChangeComponentAllAction
  | RemoveFocusAction
  | DeleteComponentAction
  | DragStartAction;

export const DragContext = createContext<ContextValue | null>(null);
export const DragDispatchContext = createContext<Dispatch<DragAction> | null>(
  null
);

export const DragProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dragReducer, {
    scheme: {
      container: { width: 550, height: 550 },
      blocks: [],
    },
  });

  return (
    <DragContext.Provider value={state}>
      <DragDispatchContext.Provider value={dispatch}>
        {children}
      </DragDispatchContext.Provider>
    </DragContext.Provider>
  );
};

let uid = 1;

export const dragReducer = (value: ContextValue, action: DragAction) => {
  switch (action.type) {
    case "addComponent": {
      console.log(action);
      return {
        ...value,
        scheme: {
          ...value.scheme,
          blocks: [...value.scheme.blocks, { ...action.payload, uid: uid++ }],
        },
      };
    }

    case "changeComponent": {
      const backupBlocks = value.scheme.blocks.map((block) => ({ ...block }));
      const changedIdx = backupBlocks.findIndex(
        (block) => block.uid === action.payload.uid
      );

      if (changedIdx < 0) return value;

      backupBlocks[changedIdx] = action.payload;

      return {
        ...value,
        scheme: {
          ...value.scheme,
          blocks: backupBlocks,
        },
      };
    }

    case "changeComponentPartial": {
      const changedMap = createMapByKey(action.payload, "uid");
      const finalBlocks = value.scheme.blocks.map((block) => {
        const uid = block.uid as number;

        if (!changedMap[uid]) return block;

        return changedMap[uid];
      });

      return {
        ...value,
        scheme: {
          ...value.scheme,
          blocks: finalBlocks,
        },
      };
    }

    case "changeComponentAll": {
      return {
        ...value,
        scheme: {
          ...value.scheme,
          blocks: action.payload,
        },
      };
    }

    case "removeBlockFocus": {
      const newBlocks = value.scheme.blocks.map((block) => ({
        ...block,
        focus: false,
      }));

      return {
        ...value,
        scheme: {
          ...value.scheme,
          blocks: newBlocks,
        },
      };
    }

    case "dragStart": {
      return {
        ...value,
        curComponent: action.payload,
      };
    }

    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

export const useDrags = () => {
  return useContext(DragContext);
};

export const useDragsDispatch = () => {
  return useContext(DragDispatchContext);
};
