import clsx from "clsx";

import css from "./tiles.module.css";

type Props = {
  sprite?: string;
  className?: string;
  row: number;
  col: number;
  width: number;
  height: number;
};

export function TileComponent(props: Props) {
  return (
    <div
      class={clsx(css.tile, props.className)}
      style={{
        "background-image": props.sprite
          ? `url("/${props.sprite}.png")`
          : undefined,
        "grid-area": `${props.row + 1} / ${props.col + 1} / ${props.row + props.height + 1} / ${props.col + props.width + 1}`,
      }}
    />
  );
}
