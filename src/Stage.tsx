/* @refresh reload */

import { For, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import clsx from "clsx";

import {
  BoxCollider,
  GameObject,
  Player,
  Renderable,
  Stage,
  op,
} from "@/models";
import { PlayerComponent } from "@/views/Player";
import { Movable } from "@/models/movable";

import css from "./styles.module.css";

export function StageComponent({ stage }: { stage: Stage }) {
  let lastTs = 0;
  let keyPressed: string = "";
  let pushedObject: GameObject | null = null;

  const [computedPlayerSpeed, setComputedPlayerSpeed] = createSignal(0);
  const [idleDuration, setIdleDuration] = createSignal(0);
  const [player, setPlayer] = createStore<Player>(
    new Player(Math.floor(stage.rows / 2) + 1, Math.floor(stage.cols / 2) + 1),
  );

  function keyDown(event: KeyboardEvent) {
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
          nextPosition.row = nextPosition.row - step;
          nextPosition.dir = "up";
          break;
        case "ArrowRight":
          dx = 1;
          nextPosition.col = nextPosition.col + step;
          nextPosition.dir = "right";
          break;
        case "ArrowDown":
          dy = 1;
          nextPosition.row = nextPosition.row + step;
          nextPosition.dir = "down";
          break;
        case "ArrowLeft":
          dx = -1;
          nextPosition.col = nextPosition.col - step;
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
      for (const obj of stage.objects) {
        if (op.hitTest(player, obj)) {
          stumbled = true;

          if (op.isMovable(obj)) {
            if (ts - obj.getFeature(Movable).getPushedAt() >= 500) {
              const dummy = new GameObject(
                obj.row + dy,
                obj.col + dx,
                obj.height,
                obj.width,
              ).withFeatureClass(BoxCollider);

              if (
                !stage.objects.some((other) => {
                  if (other === obj) {
                    return false;
                  }

                  return op.hitTest(dummy, other);
                })
              ) {
                obj.moveBy(dy, dx);
                obj.getFeature(Movable).setUnpushed();
                if (obj instanceof Renderable) {
                  obj.notify();
                }
                pushedObject = null;
                break;
              }
            } else {
              pushedObject = obj;
              obj.getFeature(Movable).setPushed(ts);
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
      pushedObject?.getFeature(Movable)?.setUnpushed();
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
        <stage.StaticProps {...stage} />

        <For each={stage.objects}>
          {(obj) => {
            if (obj instanceof Renderable) {
              return <obj.View sprite={obj} />;
            }
            return null;
          }}
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
