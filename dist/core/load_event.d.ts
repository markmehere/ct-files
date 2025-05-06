import { CtEvent } from "./save_event";
export declare type LoadStyles = 'initial' | 'refresh' | 'compile' | 'switch';
/**
 * Loads an event from the file system. This is a little tricky because the event often inside
 * a multi-function file.
 *
 * If the event is switched, it simply returns the contents of the "{eventKey}.ictvers" file.
 * While the code suggests that refresh rules are not obeyed, they are applied by the load_script
 * function.
 *
 * If the language is not TypeScript or CoffeeScript, it returns undefined.
 *
 * If the style is "refresh", it only returns code if the file has been modified since the last
 * save or load.
 *
 * If the style is "initial" and the project version does not match the disk version, it will
 * inflates the project version and save it as a "{eventKey}.ictvers" file.
 *
 * @param path the path to the event file (e.g. "spaceship.ts") - never the ".ictvers" version
 * @param event the event metadata (used to update the _lastmod and _can_switch fields
 *              determine if the event has been switched and determine which event to load)
 * @param language either typescript or coffeescript or other (e.g. catnip)
 * @param style the load style (initial, refresh, compile or switch) - initial adds .ictvers,
 *             refresh returns undefined if the file has not been modified
 * @returns a promise that resolves to the required content (this has correct formatting and is
 *          only for the requested event - not all)
 */
export declare function load_event(path: string, event: CtEvent, language: string, style: LoadStyles): Promise<any>;
