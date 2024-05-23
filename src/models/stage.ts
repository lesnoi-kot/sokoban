import { Component } from "solid-js";

import { GameObject } from "./base";

export type Stage = {
  readonly worldUnit: number;
  readonly rows: number;
  readonly cols: number;
  StaticProps: Component<Stage>;
  objects: GameObject[];
};
