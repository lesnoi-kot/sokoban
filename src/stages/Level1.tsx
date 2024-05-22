/* @refresh reload */

import clsx from "clsx";

import { Stage, Sprite, SolidSprite, MovableSprite } from "@/models";
import { WORLD_UNIT_PX } from "@/models/consts";

import { TileComponent } from "../views";

import css from "../styles.module.css";

export const stage: Stage = {
  rows: 15,
  cols: 17,
  worldUnit: WORLD_UNIT_PX,
  sprites: buildObjects(),
  tiles: LevelTiles({ rows: 15, cols: 17 }),
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
        // className={css.transparent}
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
    new SolidSprite("furn1", 0, 0, 1, 1)
      .withSpritePosition(0, -17)
      .withClasses(css["sprite-32x96"]),

    new SolidSprite("furn1", 0, 1, 1, 2)
      .withSpritePosition(0, -3)
      .withClasses(css["sprite-64x96"]),
    new SolidSprite("furn1", 0, 3, 1, 2)
      .withSpritePosition(0, -3)
      .withClasses(css["sprite-64x96"]),
    new SolidSprite("furn1", 0, 5, 1, 2)
      .withSpritePosition(0, -3)
      .withClasses(css["sprite-64x96"]),
    new SolidSprite("furn1", 0, 7, 1, 1)
      .withSpritePosition(0, -19)
      .withClasses(css["sprite-32x64"]),

    new SolidSprite("table1", 2, 3, 2, 2),

    // new SolidSprite("rock1", 0, 6, 2, 2),
    new SolidSprite("cat_tower", 10, 2, 1, 2),

    new SolidSprite("crafts", 6, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new SolidSprite("crafts", 7, 2)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new SolidSprite("crafts", 1, 15)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new MovableSprite("crafts", 10, 10, 1, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"]),

    new SolidSprite("crafts", 0, 8, 1, 1)
      .withSpritePosition(-2, -7)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 9, 1, 1)
      .withSpritePosition(-2, -7)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 10, 1, 1)
      .withSpritePosition(-2, -7)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 11, 1, 1)
      .withSpritePosition(-2, -7)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 12, 1, 1)
      .withSpritePosition(-2, -7)
      .withClasses(css["sprite-32x64"]),

    new SolidSprite("crafts", 0, 15, 1, 1)
      .withSpritePosition(-2, -6)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 16, 1, 1)
      .withSpritePosition(-2, -5)
      .withClasses(css["sprite-32x64"]),
  ];
}
