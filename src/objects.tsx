import clsx from "clsx";

import { Sprite } from "./types";

import css from "./styles.module.css";

type Spriteable = {
  sprite: string;
};

type GridParams = {
  row: number;
  col: number;
  width: number;
  height: number;
};

export function SpriteComponent(sprite: Sprite) {
  return (
    <img
      src={sprite.imageSrc}
      class={clsx(css.sprite, sprite.classes)}
      style={{
        "object-position": sprite.imagePosition,
        "grid-area": sprite.gridArea,
        "--z-index": sprite.row,
      }}
    />
  );
}

export function TileComponent(
  props: GridParams & Partial<Spriteable> & { className?: string },
) {
  return (
    <div
      class={clsx(css.tile, props.className)}
      style={{
        "background-image": props.sprite
          ? `url("/${props.sprite}.png")`
          : undefined,
        "grid-area": `${props.row} / ${props.col} / ${props.row + props.height} / ${props.col + props.width}`,
      }}
    />
  );
}
