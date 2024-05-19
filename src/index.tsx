/* @refresh reload */
import { render } from "solid-js/web";

import { Stage } from "./Stage";

import "./index.css";

const root = document.getElementById("root");

render(() => <Stage />, root!);
