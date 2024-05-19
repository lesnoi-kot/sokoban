/* @refresh reload */

import css from "../styles.module.css";

import { Sprite } from "../types";

export function Level1() {}

export function getLevel(): Sprite[] {
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
