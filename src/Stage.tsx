/* @refresh reload */

import { For, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import clsx from "clsx";

import {
  CollisionProcessor,
  GameObject,
  InputProcessor,
  Player,
  Renderable,
  Runner,
  Stage,
  op,
} from "@/models";
import { Movable } from "@/models/movable";

import css from "./styles.module.css";

export function StageComponent({ stage }: { stage: Stage }) {
  let keyPressed: string = "";
  let pushedObject: GameObject | null = null;

  const runner = new Runner(stage);
  runner.addProcessor(
    new InputProcessor(runner, 50),
    new CollisionProcessor(runner, 100),
  );

  const [player, setPlayer] = createStore<Player>(
    new Player(Math.floor(stage.rows / 2) + 1, Math.floor(stage.cols / 2) + 1),
  );

  function tick(ts: DOMHighResTimeStamp) {
    // Proccess possible player moves
    if (keyPressed) {
      let stumbled = false;
      for (const obj of stage.objects) {
        if (op.hitTest(player, obj)) {
          stumbled = true;

          // if (op.isMovable(obj)) {
          //   if (ts - obj.getFeature(Movable).getPushedAt() >= 500) {
          //     const dummy = new GameObject(
          //       obj.row + dy,
          //       obj.col + dx,
          //       obj.height,
          //       obj.width,
          //     ).withFeatureClass(BoxCollider);

          //     if (
          //       !stage.objects.some((other) => {
          //         if (other === obj) {
          //           return false;
          //         }

          //         return op.hitTest(dummy, other);
          //       })
          //     ) {
          //       obj.moveBy(dy, dx);
          //       obj.getFeature(Movable).setUnpushed();
          //       if (obj instanceof Renderable) {
          //         obj.notify();
          //       }
          //       pushedObject = null;
          //       break;
          //     }
          //   } else {
          //     pushedObject = obj;
          //     obj.getFeature(Movable).setPushed(ts);
          //   }
          // }
        }
      }

      // if (stumbled) {
      //   setPlayer(
      //     produce((state) => {
      //       state.row = startRow;
      //       state.col = startCol;
      //     }),
      //   );
      // }
    } else {
      pushedObject?.getFeature(Movable)?.setUnpushed();
      pushedObject = null;
    }

    // requestAnimationFrame(tick);
  }

  onMount(() => {
    runner.start();

    onCleanup(() => {
      runner.stop();
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
      </div>
    </div>
  );
}
