import { type ReactNode } from "react";

export interface ComponentItem {
  label: string;
  type: string;
  preview: () => ReactNode;
  render: (props?: Record<PropertyKey, any>) => ReactNode;
}

export interface BlockItem {
  uid?: number;
  focus?: boolean;
  type: string;
  left: number;
  top: number;
  zIndex: number;
  props?: Record<PropertyKey, any>;
  alignCenter?: boolean;
}

export interface Scheme {
  container: { width: number; height: number };
  blocks: BlockItem[];
}
