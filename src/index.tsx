/* @refresh reload */
import { render } from "solid-js/web";

import { StageComponent } from "./Stage";

import "./index.css";
import { levels } from "./stages";

const root = document.getElementById("root");

render(() => <StageComponent stage={levels[0].stage} />, root!);
