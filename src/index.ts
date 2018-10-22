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
import {
    withState,
    StateSource,
    Reducer
} from "@cycle/state";


const root = document.getElementById("app") as any as HTMLElement;

type Status = "paused" | "active";

interface State<S extends Status> {
    status: S;
    count: number;
}

interface ISource {
    DOM: DOMSource;
    state: StateSource<State<Status>>;
}

interface ISink {
    DOM: Stream<VNode>;
    state: Stream<Reducer<State<Status>>>;
}

const defaultState: State<"paused"> = {
    status: "paused",
    count: 0
};

const increaseCounter = (state: State<Status> = defaultState): State<Status> => {
    return {
        ...state,
        count: state.count + 1,
    };
};

const toggleState = (state: State<Status> = defaultState): State<Status> => {

    if (state.status === "active") {
        return {
            ...state,
            status: "paused"
        };
    }
    return {
        ...state,
        status: "active"
    };
};

const main = (sources: ISource): ISink => {

    const click$ = sources.DOM.select(".inc")
        .events("click");

    const status$ = sources.state.stream
        .map((state) => state.status);

    const count$ = sources.state.stream
        .map((state) => state.count);

    const tick$: Stream<any> = status$
        .fold((stream, status) => {

            if (status === "paused") {
                return xs.never();
            }
            return xs.periodic(1000);

        }, xs.never())
        .flatten();

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

    const inc$ = tick$.mapTo(increaseCounter);

    const toggleStatus$ = click$.mapTo(toggleState);

    const button$ = status$.map((status) => button(".inc", [status]));
    const dom$ = xs
        .combine(counter$, button$)
        .map(([counterEl, buttonEl]) => {
            return div([counterEl, buttonEl]);
        });

    return {
        DOM: dom$,
        state: xs.merge(
            xs.of(toggleState), // will start the app
            inc$,
            toggleStatus$
        )
    };
};

run(withState(main), {
    DOM: makeDOMDriver(root)
});
