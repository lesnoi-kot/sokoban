/* @refresh reload */

import clsx from "clsx";

import {
  BoxCollider,
  GameObject,
  SolidSprite,
  Sprite,
  SpriteGroup,
  Stage,
} from "@/models";
import { WORLD_UNIT_PX } from "@/models/consts";
import { TileComponent } from "@/views/Tile";
import tilesCSS from "@/views/tiles.module.css";

import { EditorBrush } from "./brush";
import {
  booksShelf,
  cheesePress,
  keg,
  mayoMachine,
  preservesJar,
} from "./prefabs";
import css from "../styles.module.css";
import { Movable } from "@/models/movable";

export function buildStage(): Stage {
  const W = 17;
  const H = 15;
  return {
    rows: H,
    cols: W,
    worldUnit: WORLD_UNIT_PX,
    objects: buildObjects(H, W),
    StaticProps: LevelTiles,
  };
}

function LevelTiles(stage: Pick<Stage, "rows" | "cols">) {
  const colCenter = Math.floor(stage.cols / 2) + 1;
  return (
    <>
      <TileComponent
        sprite="floor3"
        row={0}
        col={0}
        width={colCenter}
        height={stage.rows}
        // className="transparent"
      />
      <TileComponent
        sprite="floor2"
        row={0}
        col={colCenter}
        width={colCenter}
        height={stage.rows}
        // className="transparent"
      />

      <TileComponent
        className={tilesCSS.wall}
        row={0}
        col={0}
        width={stage.cols}
        height={2}
      />
      <TileComponent
        className={tilesCSS["wall-top-corner"]}
        row={0}
        col={0}
        width={1}
        height={stage.rows}
      />
      <TileComponent
        className={clsx(tilesCSS["wall-top-corner"], tilesCSS["wall-flip"])}
        row={0}
        col={stage.cols - 1}
        width={1}
        height={stage.rows}
      />

      <TileComponent
        className={clsx(tilesCSS["wall-bottom-corner"])}
        row={stage.rows - 1}
        col={0}
        width={1}
        height={1}
      />
      <TileComponent
        className={clsx(tilesCSS["wall-bottom-corner"], tilesCSS["wall-flip"])}
        row={stage.rows - 1}
        col={stage.cols - 1}
        width={1}
        height={1}
      />
      <TileComponent
        className={clsx(tilesCSS["wall-bottom"])}
        row={stage.rows - 1}
        col={1}
        width={stage.cols - 2}
        height={1}
      />

      <TileComponent sprite="rug1" row={7} col={7} width={6} height={4} />

      <TileComponent
        className={tilesCSS.carpet1}
        row={1}
        col={9}
        width={3}
        height={2}
      />
      <TileComponent
        className={tilesCSS.carpet2}
        row={5}
        col={1}
        width={2}
        height={2}
      />
    </>
  );
}

function buildObjects(height: number, width: number): GameObject[] {
  return [
    new GameObject(-1, -1, 1, width + 1).withFeatureClass(BoxCollider),
    new GameObject(-1, -1, height + 1, 1).withFeatureClass(BoxCollider),
    new GameObject(-1, width, height + 1, 1).withFeatureClass(BoxCollider),
    new GameObject(height, -1, 1, width + 1).withFeatureClass(BoxCollider),

    new SolidSprite("furn1", 0, 0, 1, 1)
      .withSpritePosition(0, -17)
      .withClasses(css["sprite-32x96"]),
    new SolidSprite("furn1", 2, 0, 1, 1)
      .withSpritePosition(0, -17)
      .withClasses(css["sprite-32x96"]),

    ...new EditorBrush(0, 1, booksShelf).add(3).commitWithCollider(),

    new SolidSprite("furn1", 0, 7, 1, 1)
      .withSpritePosition(0, -19)
      .withClasses(css["sprite-32x64"]),

    new SpriteGroup(
      [
        new Sprite("table1", 0, 0, 2, 2),
        new Sprite("crafts", 0, 0, 1, 1)
          .withSpritePosition(0, -1)
          .withOffset(0, 0.5)
          .withClasses(css["sprite-32x64"]),
      ],
      2,
      3,
      2,
      2,
    ).withFeatureClass(BoxCollider),

    new SolidSprite("chairs", 3, 2, 1, 1)
      .withSpritePosition(0, -7)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("chairs", 2, 5, 1, 1)
      .withSpritePosition(0, -7)
      .withClasses(css["sprite-32x64"], "flip-x"),
    new SolidSprite("chairs", 4, 4, 1, 1)
      .withSpritePosition(0, -8)
      .withClasses(css["sprite-32x64"]),

    // new SolidSprite("rock1", 0, 6, 2, 2),
    // new SolidSprite("cat_tower", 10, 2, 1, 2),

    // new SolidSprite("crafts", 6, 1)
    //   .withSpritePosition(0, 0)
    //   .withClasses(css["sprite-32x64"]),

    // new SolidSprite("crafts", 7, 2)
    //   .withSpritePosition(0, 0)
    //   .withClasses(css["sprite-32x64"]),

    // new SolidSprite("crafts", 1, 15)
    //   .withSpritePosition(0, 0)
    //   .withClasses(css["sprite-32x64"]),

    new SolidSprite("crafts", 10, 10, 1, 1)
      .withSpritePosition(0, 0)
      .withClasses(css["sprite-32x64"])
      .withFeatureClass(Movable),

    ...new EditorBrush(0, 8, preservesJar).add(5).commitWithCollider(),
    ...new EditorBrush(5, 11, keg).add(6).commitWithCollider(),
    ...new EditorBrush(14, 10, cheesePress).add(5).commitWithCollider(),
    ...new EditorBrush(10, 12, mayoMachine).add(5).commitWithCollider(),

    new SolidSprite("crafts", 0, 15, 1, 1)
      .withSpritePosition(-2, -6)
      .withClasses(css["sprite-32x64"]),
    new SolidSprite("crafts", 0, 16, 1, 1)
      .withSpritePosition(-2, -5)
      .withClasses(css["sprite-32x64"]),
  ];
}
