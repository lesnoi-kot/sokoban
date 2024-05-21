import clsx from "clsx";

import type { Sprite } from "./models/sprite";

import css from "./styles.module.css";
import { Player } from "./models";

type Spriteable = {
  sprite: string;
};

type GridParams = {
  row: number;
  col: number;
  width: number;
  height: number;
};

export function SpriteComponent({ sprite }: { sprite: Sprite }) {
  return (
    <img
      src={sprite.imageSrc}
      class={clsx(css.sprite, sprite.classes)}
      style={
        sprite.subscribe() || {
          "object-position": sprite.imagePosition,
          "grid-area": sprite.gridArea,
          "--z-index": sprite.row,
        }
      }
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
        "grid-area": `${props.row + 1} / ${props.col + 1} / ${props.row + props.height + 1} / ${props.col + props.width + 1}`,
      }}
    />
  );
}

const DIR_SPRITESHEET: Record<Player["dir"], number> = {
  up: 2,
  right: 1,
  down: 0,
  left: 3,
};

export function PlayerComponent(props: {
  player: Player;
  isMoving: boolean;
  isIdle: boolean;
}) {
  // const pressedKeys: Record<string, boolean> = {};
  return (
    <div
      classList={{
        [css.sprite]: true,
        [css.player]: true,
        [css["player-running"]]: props.isMoving,
        [css["player-idle"]]: props.isIdle,
      }}
      style={{
        "--row": props.player.row,
        "--col": props.player.col,
        "--z-index": 1 + Math.floor(props.player.row),
        "--sprite-row": -DIR_SPRITESHEET[props.player.dir],
      }}
    />
  );
}
