import { Component } from "solid-js";
import { maxBy } from "lodash";

import { PlayerComponent } from "@/views/Player";

import { GameObject, Vector } from "./base";
import { BoxCollider } from "./colliders";
import { Interactive } from "./features/interactive";
import { FrameInfo } from "./runner";
import { Sprite } from "./sprite";

export class Player extends Sprite {
  private collider: BoxCollider;
  private startPosition: Vector;

  computedPlayerSpeed = 0;
  idleDuration = 0;
  dir: "up" | "right" | "down" | "left" = "down";
  speed = 5;
  velocity: Vector = new Vector(0, 0);

  constructor(row: number, col: number) {
    super("cat64", row, col, 2, 2);
    this.collider = new BoxCollider(this, new Vector(0.5, 0.5), 1, 1);
    this.collider.static = false;
    this.withFeature(this.collider).withFeatureClass(PlayerController);
    this.startPosition = new Vector(row, col);
  }

  get View(): Component<{ sprite: Player }> {
    return PlayerComponent;
  }

  public update(frame: FrameInfo): void {
    this.startPosition = new Vector(this.row, this.col);
    if (this.computedPlayerSpeed === 0) {
      this.idleDuration += frame.delta;

      if (this.idleDuration >= 3) {
        this.notify();
      }
    }
  }

  public lateUpdate(frame: FrameInfo): void {
    const movedDistance = Math.abs(
      Math.abs(this.col - this.startPosition.col) +
        Math.abs(this.row - this.startPosition.row),
    );
    this.computedPlayerSpeed = movedDistance / frame.delta;
    if (this.computedPlayerSpeed !== 0) {
      this.idleDuration = 0;
    }
    this.velocity.row *= this.computedPlayerSpeed;
    this.velocity.col *= this.computedPlayerSpeed;

    frame.notifications.push(() => {
      this.notify();
    });
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

    if (!lastKeyPress) {
      return;
    }

    const step = this.player.speed * frame.delta;

    switch (lastKeyPress.key) {
      case this.keymaps.up:
        this.player.row -= step;
        this.player.dir = "up";
        this.player.velocity.col = 0;
        this.player.velocity.row = -1;
        break;
      case this.keymaps.right:
        this.player.col += step;
        this.player.dir = "right";
        this.player.velocity.col = 1;
        this.player.velocity.row = 0;
        break;
      case this.keymaps.down:
        this.player.row += step;
        this.player.dir = "down";
        this.player.velocity.col = 0;
        this.player.velocity.row = 1;
        break;
      case this.keymaps.left:
        this.player.col -= step;
        this.player.dir = "left";
        this.player.velocity.col = -1;
        this.player.velocity.row = 0;
        break;
      default:
        break;
    }
  }
}
