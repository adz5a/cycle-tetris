import xs, { Stream, Producer } from "xstream";
import {
    Driver
} from "@cycle/run";

interface KeyboardEventProducer extends Producer<KeyboardEvent> {
    eventListener: (e: KeyboardEvent) => void;
}
/**
 *
 * This Driver attaches an EventListener on the document and listens
 * for the specified keyboard event on it.
 * This takes no sink.
 *
 */
export function makeKeyboardDriver(eventName: string): Driver<never, Stream<KeyboardEvent>> {

    return () => {
        return xs.create({
            start(listener) {
                this.eventListener = (e: KeyboardEvent) => listener.next(e);
                document.addEventListener(eventName, this.eventListener);
            },
            stop() {
                document.removeEventListener(eventName, this.eventListener);
            }
        } as KeyboardEventProducer);
    };

}
