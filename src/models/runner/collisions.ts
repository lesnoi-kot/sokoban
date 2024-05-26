import { Collider } from "../colliders";
import { isCollider } from "../operators";
import { Player } from "../player";
import { FrameInfo, Processor } from "./runner";

export class CollisionProcessor extends Processor {
  process(frame: FrameInfo): void {
    for (const subject of this.runner.stage.objects) {
      if (!isCollider(subject)) continue;
      const subjCollider = subject.getFeature(Collider);
      if (!subjCollider.active || subjCollider.static) continue;

      for (const obj of this.runner.stage.objects) {
        if (obj === subject) continue;
        if (!isCollider(obj)) continue;
        const objCollider = obj.getFeature(Collider);

        if (subjCollider.hitTest(objCollider)) {
          if (subject instanceof Player) {
            if (subject.velocity.col > 0) {
              if (!(subject.row >= obj.bottom || subject.bottom <= obj.top)) {
                subject.col = obj.col - subject.width;
                break;
              }
            } else if (subject.velocity.col < 0) {
              if (!(subject.row >= obj.bottom || subject.bottom <= obj.top)) {
                subject.col = obj.col + obj.width;
                break;
              }
            } else if (subject.velocity.row > 0) {
              if (!(subject.left >= obj.right || subject.right <= obj.left)) {
                subject.row = obj.row - subject.height;
                break;
              }
            } else if (subject.velocity.row < 0) {
              if (!(subject.left >= obj.right || subject.right <= obj.left)) {
                subject.row = obj.row + obj.height;
                break;
              }
            }
          }
        }
      }
    }
  }
}
