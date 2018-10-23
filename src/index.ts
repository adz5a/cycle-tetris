import xs, { Stream } from "xstream";
import { run } from "@cycle/run";
import {
    makeDOMDriver,
    DOMSource,
    VNode,
    svg,
    div,
    label,
    option,
    select,
    span
} from "@cycle/dom";
import {
    Reducer,
    StateSource,
    withState
} from "@cycle/state";
import {
    coordinate,
    Pieces,
    makePiece,
} from "./pieces";


const root = document.getElementById("app") as any as HTMLElement;

interface ISource {
    DOM: DOMSource;
    state: StateSource<IState>
}

interface ISink {
    DOM: Stream<VNode>;
    state: Stream<Reducer<IState>>;
}

interface IState<K extends keyof Pieces = keyof Pieces> {
    currentPiece: K;
    repr: coordinate[] | Pieces[K];
    position: coordinate;
}

const pieces: Pieces = {
    I: [ [-1,  0], [ 0,  0], [ 1,  0], [ 2,  0] ],
    T: [ [ 0, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    O: [ [ 0, -1], [ 1, -1], [ 0,  0], [ 1,  0] ],
    J: [ [-1, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    L: [ [ 1, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    S: [ [ 0, -1], [ 1, -1], [-1,  0], [ 0,  0] ],
    Z: [ [-1, -1], [ 0, -1], [ 0,  0], [ 1,  0] ]
};

const piecesName = Object.keys(pieces) as Array<keyof Pieces>;

const defaultState: IState<"I"> = {
    currentPiece: "I",
    repr: pieces["I"],
    position: [20, 20]
};

const initReducer: Reducer<IState<"I">> = (state = defaultState) => {

    return defaultState;

};

const main = (sources: ISource): ISink => {

    const repr$ = sources.state.stream
        .map(({ repr, position }) => makePiece(repr, position));

    const board$ = repr$
        .debug("REPR")
        .map((repr) => svg({
            attrs: {
                width: 400,
                height: 700
            },
            style: {
                border: "solid"
            }
        },
            repr));

    const controls$ = sources.state.stream
        .map((state) => div([
            label([
                span({
                    style: {
                        padding: "1rem"
                    }
                }, ["Choose a piece"]),
                select(".piece", 
                    {
                        value: state.currentPiece
                    },
                    piecesName.map((K) => {
                        return option([K]);
                    }))
            ])
        ]));

    const view$ = xs.combine(
        controls$,
        board$
    )
        .map(([controls, board]) => {

            return div([
                board,
                controls
            ]);

        });


    return {
        DOM: view$,
        state: xs.of(initReducer)
    };
};

run(withState(main), {
    DOM: makeDOMDriver(root)
});
