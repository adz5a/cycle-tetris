import xs, { Stream } from "xstream";
import { run } from "@cycle/run";
import {
    makeDOMDriver,
    DOMSource,
    div,
    VNode
} from "@cycle/dom";


const root = document.getElementById("app") as any as HTMLElement;

interface ISource {
    DOM: DOMSource;
}

interface ISink {
    DOM: Stream<VNode>;
}

const main = (sources: ISource): ISink => {
    
    const DOM = xs.of(div(["hello word, how are you ?"])) as Stream<VNode>;

    return { DOM };
};

run(main, {
    DOM: makeDOMDriver(root)
});
