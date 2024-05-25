import { Interactive } from "../features/interactive";
import { FrameInfo, Processor, Runner } from "./runner";

export class InputProcessor extends Processor {
  private pressedKeys: Map<string, number> = new Map();
  boundKeyDown: typeof this.keyDown;
  boundKeyUp: typeof this.keyUp;

  constructor(runner: Runner, priority: number) {
    super(runner, priority);
    this.boundKeyDown = this.keyDown.bind(this);
    this.boundKeyUp = this.keyUp.bind(this);
  }

  private keyDown(event: KeyboardEvent) {
    this.pressedKeys.set(event.key, performance.now());
  }

  private keyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key);
  }

  start(): void {
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  stop(): void {
    document.removeEventListener("keydown", this.boundKeyDown);
    document.removeEventListener("keyup", this.boundKeyUp);
  }

  process(frame: FrameInfo): void {
    for (const obj of this.runner.stage.objects) {
      obj.getFeature(Interactive)?.processKeys(frame, this.pressedKeys);
    }
  }
}
