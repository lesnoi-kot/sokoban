import { For, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { type Player, type Stage } from "./types";

import css from "./styles.module.css";
import { SpriteComponent } from "./objects";
import { hasOverlap, scaleRect } from "./utils";

const DIR_SPRITESHEET: Record<Player["dir"], number> = {
  up: 2,
  right: 1,
  down: 0,
  left: 3,
};

const PLAYER_SIZE = 1;

export function StageComponent({ stage }: { stage: Stage }) {
  // const pressedKeys: Record<string, boolean> = {};
  let lastTs = 0;
  let keyPressed: string = "";
  const [v, setV] = createSignal(0);
  const [idleDuration, setIdleDuration] = createSignal(0);

  const [player, setPlayer] = createSignal<Player>({
    row: Math.floor(stage.rows / 2) + 1,
    col: Math.floor(stage.cols / 2) + 1,
    dir: "down",
    speed: 5,
  });

  function keyDown(event: KeyboardEvent) {
    event.preventDefault();
    keyPressed = event.key;
  }

  function keyUp(event: KeyboardEvent) {
    if (keyPressed === event.key) {
      keyPressed = "";
    }
  }

  function tick(ts: DOMHighResTimeStamp) {
    const _player = player();
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const nextPosition = {
      row: _player.row,
      col: _player.col,
      dir: _player.dir,
    };

    // Proccess possible player moves
    if (keyPressed) {
      const step = _player.speed * dt;
      let dx = 0,
        dy = 0;

      switch (keyPressed) {
        case "ArrowUp":
          dy = -1;
          nextPosition.row = Math.max(
            -PLAYER_SIZE / 2,
            nextPosition.row - step,
          );
          nextPosition.dir = "up";
          break;
        case "ArrowRight":
          dx = 1;
          nextPosition.col = Math.min(
            stage.cols - 1 - PLAYER_SIZE / 2,
            nextPosition.col + step,
          );
          nextPosition.dir = "right";
          break;
        case "ArrowDown":
          dy = 1;
          nextPosition.row = Math.min(
            stage.rows - 1 - PLAYER_SIZE / 2,
            nextPosition.row + step,
          );
          nextPosition.dir = "down";
          break;
        case "ArrowLeft":
          dx = -1;
          nextPosition.col = Math.max(
            -PLAYER_SIZE / 2,
            nextPosition.col - step,
          );
          nextPosition.dir = "left";
          break;
        default:
          break;
      }

      let stumbled = false;

      const playerHitbox = scaleRect(
        new DOMRectReadOnly(
          nextPosition.col,
          nextPosition.row,
          2 * PLAYER_SIZE,
          2 * PLAYER_SIZE,
        ),
        0.5,
      );

      const now = performance.now();

      for (const obj of stage.sprites) {
        if (hasOverlap(obj.getHitBox(), playerHitbox)) {
          if (now - obj.pushedAt() >= 500) {
            obj.moveBy(dy, dx);
            obj.setUnpushed();
            obj.notify();
          } else {
            obj.setPushed();
          }

          stumbled = true;

          break;
        } else {
          obj.setUnpushed();
        }
      }

      if (stumbled) {
        nextPosition.row = _player.row;
        nextPosition.col = _player.col;
      }

      setPlayer((state) => ({
        ...state,
        ...nextPosition,
      }));
    }

    const movedDistance = Math.abs(
      nextPosition.col - _player.col + (nextPosition.row - _player.row),
    );
    setV(movedDistance / dt);
    setIdleDuration((d) => (v() === 0 ? d + dt : 0));

    requestAnimationFrame(tick);
  }

  const isMoving = createMemo(() => v() > 0);
  const isIdle = createMemo(() => idleDuration() >= 3);

  onMount(() => {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    requestAnimationFrame((ts) => {
      tick((lastTs = ts));
    });

    onCleanup(() => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    });
  });

  return (
    <div
      classList={{
        [css.stage]: true,
        [css.crisp]: true,
      }}
    >
      <div
        class={css.field}
        style={{
          "--rows": stage.rows,
          "--cols": stage.cols,
          "--cell-size": stage.worldUnit + "px",
        }}
      >
        {stage.tiles}

        <For each={stage.sprites}>
          {(sprite) => <SpriteComponent sprite={sprite} />}
        </For>

        <div
          classList={{
            [css.sprite]: true,
            [css.player]: true,
            [css["player-running"]]: isMoving(),
            [css["player-idle"]]: isIdle(),
          }}
          style={{
            "--row": player().row,
            "--col": player().col,
            "--z-index": 1 + Math.floor(player().row),
            "--sprite-row": -DIR_SPRITESHEET[player().dir],
          }}
        />
      </div>
    </div>
  );
}
