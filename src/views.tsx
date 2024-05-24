import clsx from "clsx";

import type { Sprite, SpriteGroup } from "@/models/sprite";

import css from "./styles.module.css";

export function SpriteComponent({ sprite }: { sprite: Sprite }) {
  return (
    <img
      src={sprite.imageSrc}
      class={clsx(css.sprite, sprite.classes)}
      style={
        sprite.subscribe() || {
          "object-position": sprite.imagePosition,
          "grid-area": sprite.gridArea,
          "--z-index": sprite.zIndex,
          "--offset-row": sprite.offset[0],
          "--offset-col": sprite.offset[1],
        }
      }
    />
  );
}

export function SpriteGroupComponent({ sprite }: { sprite: SpriteGroup }) {
  return (
    <>
      {sprite.sprites.map((sprite) => (
        <sprite.View sprite={sprite} />
      ))}
    </>
  );
}
