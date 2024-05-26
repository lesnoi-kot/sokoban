import { Component } from "solid-js";
import { maxBy } from "lodash";

import { PlayerComponent } from "@/views/Player";

import { GameObject, Vector } from "./base";
import { BoxCollider, CircleCollider } from "./colliders";
import { Interactive } from "./features/interactive";
import { FrameInfo } from "./runner";
import { Sprite } from "./sprite";

const PLAYER_COLLIDER_SIZE = 0.5;

export class Player extends Sprite {
  private collider: CircleCollider;
  computedPlayerSpeed = 0;
  idleDuration = 0;
  dir: "up" | "right" | "down" | "left" = "down";
  speed = 5;
  velocity: Vector = new Vector(0, 0);

  constructor(row: number, col: number) {
    super("cat64", row, col, 2, 2);
    this.collider = new CircleCollider(this, PLAYER_COLLIDER_SIZE);
    // this.collider = new BoxCollider(this);
    this.collider.static = false;
    this.withFeature(this.collider).withFeatureClass(PlayerController);
  }

  get View(): Component<{ sprite: Player }> {
    return PlayerComponent;
  }

  public update(frame: FrameInfo): void {
    if (this.computedPlayerSpeed === 0) {
      this.idleDuration += frame.delta;

      if (this.idleDuration >= 3) {
        this.notify();
      }
    }
  }

  public get isMoving() {
    return this.computedPlayerSpeed > 0;
  }

  public get isIdle() {
    return this.idleDuration >= 3;
  }
}

class PlayerController extends Interactive {
  private player: Player;

  keymaps = {
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    left: "ArrowLeft",
  } as const;

  constructor(player: GameObject) {
    super(player);
    this.player = player as Player;
  }

  processKeys(frame: FrameInfo, pressedKeys: Map<string, number>): void {
    let [dx, dy] = [0, 0];
    const step = this.player.speed * frame.delta;
    const lastKeyPress = maxBy(
      [
        this.keymaps.up,
        this.keymaps.down,
        this.keymaps.right,
        this.keymaps.left,
      ]
        .map((key) => ({ key, ts: pressedKeys.get(key) }))
        .filter(Boolean),
      (press) => press.ts,
    );
    const [lastRow, lastCol] = [this.player.row, this.player.col];

    if (lastKeyPress) {
      switch (lastKeyPress.key) {
        case this.keymaps.up:
          dy = -1;
          this.player.row -= step;
          this.player.dir = "up";
          break;
        case this.keymaps.right:
          dx = 1;
          this.player.col += step;
          this.player.dir = "right";
          break;
        case this.keymaps.down:
          dy = 1;
          this.player.row += step;
          this.player.dir = "down";
          break;
        case this.keymaps.left:
          dx = -1;
          this.player.col -= step;
          this.player.dir = "left";
          break;
        default:
          break;
      }
    }

    const movedDistance = Math.abs(
      Math.abs(this.player.col - lastCol) + Math.abs(this.player.row - lastRow),
    );
    this.player.computedPlayerSpeed = movedDistance / frame.delta;
    if (this.player.computedPlayerSpeed !== 0) {
      this.player.idleDuration = 0;
    }
    this.player.velocity.row = dy * this.player.computedPlayerSpeed;
    this.player.velocity.col = dx * this.player.computedPlayerSpeed;

    frame.notifications.push(() => {
      this.player.notify();
    });
  }
}
