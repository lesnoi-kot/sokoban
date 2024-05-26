import { Stage } from "../stage";

export type FrameInfo = {
  readonly ts: DOMHighResTimeStamp;
  readonly delta: DOMHighResTimeStamp;
  notifications: Array<() => void>;
};

export class Runner {
  private processors: Processor[] = [];
  private rafId: number = -1;
  private lastTs: number = 0;

  constructor(public stage: Stage) {}

  addProcessor(...p: Processor[]) {
    this.processors.push(...p);
    this.processors.sort((a, b) => a.priority - b.priority);
  }

  start() {
    for (const p of this.processors) {
      p.start();
    }
    this.lastTs = performance.now();
    this.rafId = window.requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    window.cancelAnimationFrame(this.rafId);
    for (const p of this.processors) {
      p.stop();
    }
  }

  loop(ts: DOMHighResTimeStamp) {
    const frame: FrameInfo = {
      ts,
      delta: (ts - this.lastTs) / 1000,
      notifications: [],
    };
    for (const obj of this.stage.objects) {
      obj.update(frame);
    }
    for (const p of this.processors) {
      p.process(frame);
    }
    for (const obj of this.stage.objects) {
      obj.lateUpdate(frame);
    }
    for (const notify of frame.notifications) {
      notify();
    }
    this.rafId = window.requestAnimationFrame(this.loop.bind(this));
    this.lastTs = ts;
  }

  dispose() {}
}

export abstract class Processor {
  constructor(
    protected runner: Runner,
    public priority: number,
  ) {}

  start(): void {}
  stop(): void {}
  abstract process(frame: FrameInfo): void;
}
