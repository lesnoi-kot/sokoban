import { JSXElement } from "solid-js";

import { Sprite } from "./sprite";

export type Stage = {
  readonly worldUnit: number;
  readonly rows: number;
  readonly cols: number;
  tiles: JSXElement;
  sprites: Sprite[];
};
