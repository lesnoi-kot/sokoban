import { StageComponent } from "./Stage";
import { buildStage } from "./stages/Level1";

export function App() {
  const stage = buildStage();
  return <StageComponent stage={stage} />;
}
