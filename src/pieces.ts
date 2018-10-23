import { h, VNode } from "@cycle/dom";
export type coordinate = [number, number];

export type Pieces = {
    I: [ [-1,  0], [ 0,  0], [ 1,  0], [ 2,  0] ],
    T: [ [ 0, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    O: [ [ 0, -1], [ 1, -1], [ 0,  0], [ 1,  0] ],
    J: [ [-1, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    L: [ [ 1, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    S: [ [ 0, -1], [ 1, -1], [-1,  0], [ 0,  0] ],
    Z: [ [-1, -1], [ 0, -1], [ 0,  0], [ 1,  0] ]
};


/**
 * Each element of a given piece is represented by a 10 * 10 square.
 * It is positionned relatively to the second argument
 */
export const makePiece = (piece: coordinate[], [x, y]: coordinate): VNode[] => {

    return piece
        .map(([px, py]) => [10 * (px + x), 10 * (py + y)])
        .map(([x, y]: coordinate) => h("rect.pieceElement",
            {
                attrs: {
                    width: 10,
                    height: 10,
                    x,
                    y,
                    fill: "red"
                },
                style: {
                }
            }));

};
