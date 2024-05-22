/* @refresh reload */

import {
  For,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import clsx from "clsx";

import { Player, Stage, isCollider, Movable, isMovable } from "@/models";
import { PlayerComponent, SpriteComponent } from "@/views";

import css from "./styles.module.css";
import { DummyCollider } from "./models/sprites";

export function StageComponent({ stage }: { stage: Stage }) {
  let lastTs = 0;
  let keyPressed: string = "";
  let pushedObject: Movable | null = null;

  const [computedPlayerSpeed, setComputedPlayerSpeed] = createSignal(0);
  const [idleDuration, setIdleDuration] = createSignal(0);
  const [player, setPlayer] = createStore<Player>(
    new Player(Math.floor(stage.rows / 2) + 1, Math.floor(stage.cols / 2) + 1),
  );

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
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const startRow = player.row;
    const startCol = player.col;
    const nextPosition = {
      row: player.row,
      col: player.col,
      dir: player.dir,
    };

    // Proccess possible player moves
    if (keyPressed) {
      const step = player.speed * dt;
      let dx = 0,
        dy = 0;

      switch (keyPressed) {
        case "ArrowUp":
          dy = -1;
          nextPosition.row = Math.max(
            -player.height / 2,
            nextPosition.row - step,
          );
          nextPosition.dir = "up";
          break;
        case "ArrowRight":
          dx = 1;
          nextPosition.col = Math.min(
            stage.cols - 1 - player.width / 2,
            nextPosition.col + step,
          );
          nextPosition.dir = "right";
          break;
        case "ArrowDown":
          dy = 1;
          nextPosition.row = Math.min(
            stage.rows - 1 - player.height / 2,
            nextPosition.row + step,
          );
          nextPosition.dir = "down";
          break;
        case "ArrowLeft":
          dx = -1;
          nextPosition.col = Math.max(
            -player.width / 2,
            nextPosition.col - step,
          );
          nextPosition.dir = "left";
          break;
        default:
          break;
      }

      setPlayer(
        produce((state) => {
          state.row = nextPosition.row;
          state.col = nextPosition.col;
          state.dir = nextPosition.dir;
        }),
      );

      let stumbled = false;
      for (const obj of stage.sprites) {
        if (isCollider(obj) && player.hitTest(obj)) {
          stumbled = true;

          if (isMovable(obj)) {
            if (ts - obj.getPushedAt() >= 500) {
              const dummy = new DummyCollider(
                obj.row + dy,
                obj.col + dx,
                obj.height,
                obj.width,
              );

              if (
                !stage.sprites.some((other) => {
                  if (other === obj) {
                    return false;
                  }

                  return isCollider(other) && dummy.hitTest(other);
                })
              ) {
                obj.moveBy(dy, dx);
                obj.setUnpushed();
                obj.notify();
                pushedObject = null;
                break;
              }
            } else {
              pushedObject = obj;
              obj.setPushed();
            }
          }
        }
      }

      if (stumbled) {
        setPlayer(
          produce((state) => {
            state.row = startRow;
            state.col = startCol;
          }),
        );
      }
    } else {
      pushedObject?.setUnpushed();
      pushedObject = null;
    }

    const movedDistance = Math.abs(
      Math.abs(player.col - startCol) + Math.abs(player.row - startRow),
    );
    setComputedPlayerSpeed(movedDistance / dt);
    setIdleDuration((d) => (computedPlayerSpeed() === 0 ? d + dt : 0));

    requestAnimationFrame(tick);
  }

  const isMoving = createMemo(() => computedPlayerSpeed() > 0);
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
    <div class={clsx(css.stage, css.crisp)}>
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

        <PlayerComponent
          player={player}
          isMoving={isMoving()}
          isIdle={isIdle()}
        />
      </div>
    </div>
  );
}
