import { SolidSprite } from "@/models";

import css from "../styles.module.css";

export const keg = new SolidSprite("crafts")
  .withSpritePosition(-2, -4)
  .withClasses(css["sprite-32x64"]);

export const preservesJar = new SolidSprite("crafts")
  .withSpritePosition(-2, -7)
  .withClasses(css["sprite-32x64"]);
