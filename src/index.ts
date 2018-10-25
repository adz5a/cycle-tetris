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
    PieceName,
    makePiece,
} from "./pieces";
import {
    makeKeyboardDriver
} from "./keyboardDriver";

const root = document.getElementById("app") as any as HTMLElement;

interface ISource {
    DOM: DOMSource;
    state: StateSource<IState>;
    keyPress: Stream<KeyboardEvent>;
}

interface ISink {
    DOM: Stream<VNode>;
    state: Stream<Reducer<IState>>;
}

interface IState<K extends PieceName = PieceName> {
    currentPiece: K;
    repr: coordinate[];
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

const piecesName = Object.keys(pieces) as Array<PieceName>;

const defaultState: IState<"I"> = {
    currentPiece: "I",
    repr: pieces["I"],
    position: [0, 0]
};

const makeMoveReducer = ([x, y]: coordinate): Reducer<IState> => (state: IState) => {

    const [px, py] = state.position;
    return {
        ...state,
        position: [px + x, py + y]
    };

};

const moveRight = makeMoveReducer([1, 0]);
const moveLeft = makeMoveReducer([-1, 0]);
const moveUp = makeMoveReducer([0, -1]);
const moveDown = makeMoveReducer([0, 1]);
const moveAtStartPoint = makeMoveReducer([20, 20]);

const initReducer: Reducer<IState> = (state = defaultState) => {

    return moveAtStartPoint(defaultState);

};

const rotateLeft: Reducer<IState> = (state = defaultState) => {
    return {
        ...state,
        repr: state.repr.map(([x, y]) => [y, -x] as coordinate)
    };
};

const rotateRight: Reducer<IState> = (state: IState = defaultState) => {
    return {
        ...state,
        repr: state.repr.map(([x, y]) => [y, x] as coordinate)
    };
};

const main = (sources: ISource): ISink => {

    const keyMoves$ = sources.keyPress
        .map((e) => e.key)
        .startWith("NONE");

    const moveLeft$ = keyMoves$
        .filter((key) => key === "a")
        .mapTo(moveLeft);

    const moveRight$ = keyMoves$
        .filter((key) => key === "d")
        .mapTo(moveRight);

    const moveDown$ = keyMoves$
        .filter((key) => key === "s")
        .mapTo(moveDown);

    const moveUp$ = keyMoves$
        .filter((key) => key === "w")
        .mapTo(moveUp);

    const rotateLeft$ = keyMoves$
        .filter((key) => key === "q")
        .mapTo(rotateLeft);

    const rotateRight$ = keyMoves$
        .filter((key) => key === "e")
        .mapTo(rotateRight);

    const repr$ = sources.state.stream
        .map(({ position, repr }) => makePiece(repr, position));

    const board$ = repr$
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
                        return option({ value: K }, [K]);
                    }))
            ])
        ]));

    const view$ = xs.combine(
        controls$,
        board$,
        keyMoves$.map((key) => div([key]))
    )
        .map(([controls, board, key]) => {

            return div([
                board,
                controls,
                key
            ]);

        });

    const change$ = sources.DOM.select("select.piece")
        .events("change");

    const newPiece$ = change$
        .map((e: Event) => (e.target as any).value as any as PieceName);

    const changePiece$ = newPiece$
        .map(newPiece => {
            const changePiece: Reducer<IState> = (prevState: IState) => {
                return moveAtStartPoint({
                    ...prevState,
                    currentPiece: newPiece,
                    repr: pieces[newPiece],
                    position: [0, 0]
                });
            }; 

            return changePiece;
        });

    const reducer$ = xs.merge(
        xs.of(initReducer),
        changePiece$,
        moveUp$,
        moveLeft$,
        moveRight$,
        moveDown$,
        rotateLeft$,
        rotateRight$
    );

    return {
        DOM: view$,
        state: reducer$
    };
};

run(withState(main), {
    DOM: makeDOMDriver(root),
    keyPress: makeKeyboardDriver("keypress"),
});
