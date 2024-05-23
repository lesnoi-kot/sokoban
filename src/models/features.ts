export const $isMovable = Symbol("");

export interface Movable {
  [$isMovable]: true;
  weight: number;
  setUnpushed(): void;
  setPushed(): void;
  getPushedAt(): number;
}

interface Controlled {
  setKey(key: string): void;
  unsetKey(key: string): void;
}
