import xs from "xstream";
import { run } from "@cycle/run";
import {
    makeDOMDriver,
    div
} from "@cycle/dom";


const root = document.getElementById("app");

const main = () => {
    
    const DOM = xs.of(div(["hello word, how are you ?"]));

    return { DOM };
};

run(main, {
    DOM: makeDOMDriver(root)
});
