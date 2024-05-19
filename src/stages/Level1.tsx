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
        row={0}
        col={0}
        width={stage.cols}
        height={stage.rows}
        className={css.transparent}
      />
      <TileComponent
        className={css.wall}
        row={0}
        col={0}
        width={stage.cols}
        height={2}
      />
      <TileComponent
        className={css["wall-top-corner"]}
        row={0}
        col={0}
        width={1}
        height={stage.rows}
      />
      <TileComponent
        className={clsx(css["wall-top-corner"], css["wall-flip"])}
        row={0}
        col={stage.cols - 1}
        width={1}
        height={stage.rows}
      />

      <TileComponent
        className={clsx(css["wall-bottom-corner"])}
        row={stage.rows - 1}
        col={0}
        width={1}
        height={1}
      />
      <TileComponent
        className={clsx(css["wall-bottom-corner"], css["wall-flip"])}
        row={stage.rows - 1}
        col={stage.cols - 1}
        width={1}
        height={1}
      />
      <TileComponent
        className={clsx(css["wall-bottom"])}
        row={stage.rows - 1}
        col={1}
        width={stage.cols - 2}
        height={1}
      />

      <TileComponent sprite="rug1" row={7} col={7} width={6} height={4} />
    </>
  );
}

export function buildObjects(): Sprite[] {
  return [
    new Sprite("books1", 0, 0, 1, 2),
    new Sprite("books1", 0, 2, 1, 2),
    new Sprite("table1", 4, 3, 2, 2),

    new Sprite("rock1", 0, 6, 2, 2),
    new Sprite("cat_tower", 10, 2, 1, 2),

    new Sprite("crafts", 6, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new Sprite("crafts", 6, 2)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new Sprite("crafts", 1, 15)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new Sprite("crafts", 10, 10, 1, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),
  ];
}
