const fs = require("fs-extra");
const zlib = require("zlib");
import { normalize_code } from "./utils/normalize";
import { findClosingBracket, CtEvent } from "./save_event";
import { hash } from "./utils/hash";
import { load_script, save_script } from "./script";

export type LoadStyles = 'initial' | 'refresh' | 'compile' | 'switch';

async function load_event_ts(path: string, event: CtEvent) {
    const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
    let code = '';

    if (await fs.pathExists(path)) {
        event._lastmod = Number(new Date()) + 100;
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${eventKey}\\s*\\(`);
        const functionEndRegex = new RegExp(`^.*\\/\\*\\s*end\\s*${eventKey}\\s*\\*\\/`);
        const lines = existingContent.split('\n');
        let startIndex = lines.findIndex(line => functionStartRegex.test(line.trim()));
        let endIndex = lines.findIndex(line => functionEndRegex.test(line.trim()));
        if (startIndex > -1 && endIndex > -1) {
            code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^        /, '')).join('\n') + '\n';
        }
        else if (startIndex > -1 && endIndex === -1) {
            console.warn(`Warning: No closing bracket comment found for ${eventKey} in ${path}`);
            endIndex = findClosingBracket(lines, startIndex);
            if (endIndex === -1) {
                throw Error(`File could not be parsed: ${path}`);
            }
            code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^        /, '')).join('\n') + '\n';
        }
        else {
            throw Error(`${eventKey} could not be found: ${path}`);
        }
        return code;
    }

    throw Error(`File could not be found: ${path}`);
}

async function load_event_coffee(path: string, event: CtEvent) {
    const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));

    if (await fs.pathExists(path)) {
        event._lastmod = Number(new Date()) + 100;
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${eventKey}\\s*=\\s*\\(`);
        const functionEndRegex = /^[^\s]/;
        const lines = existingContent.split('\n');
        const startIndex = lines.findIndex(line => functionStartRegex.test(line));
        if (startIndex > -1) {
            const endIndex = lines.findIndex((line, i) => i > startIndex && functionEndRegex.test(line));
            if (endIndex === -1) {
                const content = lines.slice(startIndex + 1).map(line => line.replace(/^    /, '')).join('\n');
                return content;
            }
            else {
                const content = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^    /, '')).join('\n') + '\n'
                return content;
            }
        }
        else {
            throw Error(`${eventKey} could not be found: ${path}`);
        }
    }

    throw Error(`File could not be found: ${path}`);
}
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
export async function load_event(path: string, event: CtEvent, language: string, style: LoadStyles) {
    const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));

    if (event._switched) {
        path = `${path}.${eventKey}`;
        return load_script(path, event, style)
    }

    if (language !== 'typescript' && language !== 'coffeescript') {
        return undefined;
    }

    if (style === 'refresh') {
        if (!event._lastmod) {
            throw Error('refresh requires _lastmod to be set');
        }
        if (await fs.pathExists(path)) {
            const stats = await fs.stat(path);
            if (stats.mtimeMs < event._lastmod) {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }

    if (language === 'typescript') {
        if (style === 'initial') {
            return load_event_ts(path, event).then((code) => {
                if (!event._switched && event.last && hash(code) !== event.last) {
                    event._can_switch = true;
                    const code = zlib.inflateSync(Buffer.from(event.last, 'base64')).toString();
                    save_script(`${path}.${eventKey}.ictvers`, code, event);
                }
                return code;
            });
        }
        else {
            return load_event_ts(path, event);
        }
    }
    else if (language === 'coffeescript') {
        if (style === 'initial') {
            return load_event_coffee(path, event).then((code) => {
                if (!event._switched && event.last && hash(code) !== event.last) {
                    event._can_switch = true;
                    const code = zlib.inflateSync(Buffer.from(event.last, 'base64')).toString();
                    save_script(`${path}.${eventKey}.ictvers`, code, event);
                }
                return code;
            });
        }
        else {
            return load_event_coffee(path, event);
        }
    }
}
