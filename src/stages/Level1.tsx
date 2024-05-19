/* @refresh reload */

import clsx from "clsx";

import { TileComponent } from "../objects";
import { Sprite, Stage } from "../types";

import css from "../styles.module.css";
import { WORLD_UNIT_PX } from "../consts";

export const stage: Stage = {
  rows: 20,
  cols: 20,
  worldUnit: WORLD_UNIT_PX,
  sprites: buildObjects(),
  tiles: LevelTiles({ rows: 20, cols: 20 }),
};

export function LevelTiles(stage: Pick<Stage, "rows" | "cols">) {
  return (
    <>
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
    </>
  );
}

export function buildObjects(): Sprite[] {
  return [
    new Sprite("books1", 1, 1),
    new Sprite("books1", 1, 3),
    new Sprite("table1", 6, 1),

    new Sprite("rock1", 2, 6),
    new Sprite("rug1", 7, 7),
    new Sprite("cat_tower", 10, 2),

    new Sprite("crafts", 6, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new Sprite("crafts", 6, 2)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),
  ];
}
