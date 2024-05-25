import { Feature } from "../base";
import { FrameInfo } from "../runner";

export abstract class Interactive extends Feature {
  abstract processKeys(
    frame: FrameInfo,
    pressedKeys: Map<string, number>,
  ): void;
}
