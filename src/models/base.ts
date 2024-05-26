import type { FrameInfo } from "./runner";

export type WorldUnit = number;
export type GridUnit = number;

export class Vector {
  constructor(
    public row: number,
    public col: number,
  ) {}

  public get x(): number {
    return this.col;
  }

  public get y(): number {
    return this.row;
  }
}

export abstract class Feature {
  constructor(
    public obj: GameObject,
    public active: boolean = true,
  ) {}

  public get disabled() {
    return !this.active;
  }
}

export class GameObject {
  [key: symbol]: boolean | undefined;
  parent: GameObject | null = null;
  tag: string = "";

  constructor(
    public row: GridUnit = 0,
    public col: GridUnit = 0,
    public height: GridUnit = 1,
    public width: GridUnit = 1,
    public features: Feature[] = [],
  ) {}

  public withPosition(row: number, col: number) {
    this.row = row;
    this.col = col;
    return this;
  }

  public withSize(height: number, width: number) {
    this.height = height;
    this.width = width;
    return this;
  }

  public moveBy(rows: number, cols: number) {
    this.row += rows;
    this.col += cols;
  }

  public getFeature<T extends Feature>(
    FeatureClass: abstract new (...args: any[]) => T,
  ): T | null {
    for (const feature of this.features) {
      if (feature instanceof FeatureClass) {
        return feature;
      }
    }
    return null;
  }

  public withFeature(feature: Feature) {
    this.features.push(feature);
    return this;
  }

  public withFeatureClass(FeatureClass: new (obj: GameObject) => Feature) {
    this.features.push(new FeatureClass(this));
    return this;
  }

  public get top(): number {
    return this.row;
  }
  public get left(): number {
    return this.col;
  }
  public get right(): number {
    return this.col + this.width;
  }
  public get bottom(): number {
    return this.row + this.height;
  }

  public get x(): number {
    return this.col;
  }
  public get y(): number {
    return this.row;
  }

  public get area(): number {
    return this.height * this.width;
  }

  public get gridArea(): string {
    return `${this.row + (this.parent?.row ?? 0) + 1} / ${this.col + (this.parent?.col ?? 0) + 1} / ${this.row + (this.parent?.row ?? 0) + this.height + 1} / ${this.col + (this.parent?.col ?? 0) + this.width + 1}`;
  }

  public update(frame: FrameInfo): void {}
  public lateUpdate(frame: FrameInfo): void {}

  public isCellInside(row: number, col: number): boolean {
    return (
      row >= this.row &&
      col >= this.col &&
      row <= this.row + this.height &&
      col <= this.col + this.width
    );
  }
}
