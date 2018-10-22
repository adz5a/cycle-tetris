import xs, { Stream } from "xstream";
import { run } from "@cycle/run";
import {
    makeDOMDriver,
    DOMSource,
    div,
    VNode,
    button,
    span
} from "@cycle/dom";


const root = document.getElementById("app") as any as HTMLElement;

interface ISource {
    DOM: DOMSource;
}

interface ISink {
    DOM: Stream<VNode>;
}

const main = (sources: ISource): ISink => {

    const click$ = sources.DOM.select(".inc")
        .events("click");

    const state$ = click$
        .fold((state, _) => {

            if (state.status === "active") {
                return {
                    status: "paused",
                    $: xs.never()
                };
            }
            return {
                status: "active",
                $: xs.periodic(1000)
            };

        }, {
            status: "active",
            $: xs.periodic(1000)
        });

    const tick$ = state$.map(state => state.$).flatten();
    const count$ = tick$.fold((count, _) => count + 1, 0);
    const status$ = state$.map(state => state.status);

    const counter$ = count$
        .map((count) => {
            return div([
                "Count",
                span(".counter", {
                    style: {
                        padding: "1rem"
                    }
                }, [count])
            ]);
        });

    const button$ = status$.map((status) => button(".inc", [status]));
    const dom$ = xs
        .combine(counter$, button$)
        .map(([counterEl, buttonEl]) => {
            return div([counterEl, buttonEl]);
        });

    return {
        DOM: dom$
    };
};

run(main, {
    DOM: makeDOMDriver(root)
});
