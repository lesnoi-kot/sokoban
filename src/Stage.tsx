import { For, createSignal, onCleanup, onMount } from "solid-js";
import clsx from "clsx";

import { COLS, ROWS, WORLD_UNIT_PX } from "./consts";
import { getLevel } from "./levels/Level1";
import type { Player, Sprite, Stage } from "./types";

import css from "./styles.module.css";

const DIR_SPRITESHEET: Record<Player["dir"], number> = {
  up: 2,
  right: 1,
  down: 0,
  left: 3,
};

const DELTA_STEP = 1;

export function Stage() {
  // const pressedKeys: Record<string, boolean> = {};
  let lastTs = 0;
  let keyPressed: string = "";
  const [inTransition, setInTransition] = createSignal(false);
  let playerRef: HTMLDivElement;
  const [player, setPlayer] = createSignal<Player>({
    row: Math.floor(ROWS / 2),
    col: Math.floor(COLS / 2),
    dir: "down",
  });

  const stage: Stage = {
    rows: ROWS,
    cols: COLS,
    worldUnit: WORLD_UNIT_PX,
  };

  const [sprites] = createSignal(getLevel());

  function keyDown(event: KeyboardEvent) {
    event.preventDefault();
    keyPressed = event.key;
  }

  function keyUp(event: KeyboardEvent) {
    if (
      ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)
    ) {
      keyPressed = "";
    }
  }

  function tick(ts: DOMHighResTimeStamp) {
    if (!inTransition() && keyPressed) {
      switch (keyPressed) {
        case "ArrowUp":
          setPlayer((state) => ({
            ...state,
            row: Math.max(0, state.row - DELTA_STEP),
            dir: "up",
          }));
          break;
        case "ArrowRight":
          setPlayer((state) => ({
            ...state,
            col: Math.min(stage.cols - 1, state.col + DELTA_STEP),
            dir: "right",
          }));
          break;
        case "ArrowDown":
          setPlayer((state) => ({
            ...state,
            row: Math.min(stage.rows - 1, state.row + DELTA_STEP),
            dir: "down",
          }));
          break;
        case "ArrowLeft":
          setPlayer((state) => ({
            ...state,
            col: Math.max(0, state.col - DELTA_STEP),
            dir: "left",
          }));
          break;
        default:
          break;
      }
    }

    requestAnimationFrame(tick);
  }

  onMount(() => {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    playerRef.addEventListener("transitionstart", () => {
      setInTransition(true);
    });

    playerRef.addEventListener("transitionend", () => {
      setInTransition(false);
    });

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
        <TileComponent
          sprite="floor2"
          row={1}
          col={1}
          width={stage.cols}
          height={stage.rows}
          className={css.transparent}
        />
        <TileComponent
          className={css.wall}
          row={1}
          col={1}
          width={stage.cols}
          height={2}
        />
        <TileComponent
          className={css["wall-top-corner"]}
          row={1}
          col={1}
          width={1}
          height={stage.rows}
        />
        <TileComponent
          className={clsx(css["wall-top-corner"], css["wall-flip"])}
          row={1}
          col={stage.cols}
          width={1}
          height={stage.rows}
        />

        <TileComponent
          className={clsx(css["wall-bottom-corner"])}
          row={stage.rows}
          col={1}
          width={1}
          height={1}
        />
        <TileComponent
          className={clsx(css["wall-bottom-corner"], css["wall-flip"])}
          row={stage.rows}
          col={stage.cols}
          width={1}
          height={1}
        />
        <TileComponent
          className={clsx(css["wall-bottom"])}
          row={stage.rows}
          col={2}
          width={stage.cols - 2}
          height={1}
        />

        <For each={sprites()}>
          {(sprite) => <SpriteComponent {...sprite} />}
        </For>

        <div
          // @ts-expect-error
          ref={playerRef}
          classList={{
            [css.sprite]: true,
            [css.player]: true,
            [css["player-running"]]: inTransition(),
          }}
          style={{
            "--row": player().row,
            "--col": player().col,
            "--z-index": 1 + player().row,
            "--sprite-row": -DIR_SPRITESHEET[player().dir],
          }}
        />
      </div>
    </div>
  );
}

type Spriteable = {
  sprite: string;
};

type GridParams = {
  row: number;
  col: number;
  width: number;
  height: number;
};

function SpriteComponent(sprite: Sprite) {
  return (
    <img
      src={sprite.imageSrc}
      class={clsx(css.sprite, sprite.classes)}
      style={{
        "object-position": sprite.imagePosition,
        "grid-area": `${sprite.row} / ${sprite.col} / ${sprite.row + sprite.cellHeight} / ${sprite.col + sprite.cellWidth}`,
        "--z-index": sprite.row,
      }}
    />
  );
}

function TileComponent(
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
