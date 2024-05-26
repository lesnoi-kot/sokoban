import { Player } from "@/models";

import css from "./player.module.css";

const DIR_SPRITESHEET: Record<Player["dir"], number> = {
  up: 2,
  right: 1,
  down: 0,
  left: 3,
};

export function PlayerComponent(props: { sprite: Player }) {
  return (
    <div
      classList={{
        [css.sprite]: true,
        [css.player]: true,
        [css["player-running"]]:
          props.sprite.subscribe() || props.sprite.isMoving,
        [css["player-idle"]]: props.sprite.subscribe() || props.sprite.isIdle,
      }}
      style={
        props.sprite.subscribe() || {
          "--row": props.sprite.row,
          "--col": props.sprite.col,
          "--z-index": 1 + Math.floor(props.sprite.row),
          "--sprite-row": -DIR_SPRITESHEET[props.sprite.dir],
        }
      }
    />
  );
}
