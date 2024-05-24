import { Player } from "@/models";

import css from "./player.module.css";

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
