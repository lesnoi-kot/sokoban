import { Sprite } from "@/models";

import css from "../styles.module.css";

export const booksShelf = new Sprite("furn1", 0, 0, 1, 2)
  .withSpritePosition(0, -3)
  .withClasses(css["sprite-64x96"]);

export const keg = new Sprite("crafts")
  .withSpritePosition(-2, -4)
  .withClasses(css["sprite-32x64"]);

export const preservesJar = new Sprite("crafts")
  .withSpritePosition(-2, -7)
  .withClasses(css["sprite-32x64"]);

export const cheesePress = new Sprite("crafts")
  .withSpritePosition(-4, 0)
  .withClasses(css["sprite-32x64"]);

export const mayoMachine = new Sprite("crafts")
  .withSpritePosition(-4, -2)
  .withClasses(css["sprite-32x64"]);
