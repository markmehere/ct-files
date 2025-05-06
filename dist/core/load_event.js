"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_event = void 0;
const fs = require("fs-extra");
const zlib = require("zlib");
const normalize_1 = require("./utils/normalize");
const save_event_1 = require("./save_event");
const hash_1 = require("./utils/hash");
const script_1 = require("./script");
function load_event_ts(path, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
        let code = '';
        if (yield fs.pathExists(path)) {
            event._lastmod = Number(new Date()) + 100;
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
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
                endIndex = (0, save_event_1.findClosingBracket)(lines, startIndex);
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
    });
}
function load_event_coffee(path, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
        if (yield fs.pathExists(path)) {
            event._lastmod = Number(new Date()) + 100;
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
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
                    const content = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^    /, '')).join('\n') + '\n';
                    return content;
                }
            }
            else {
                throw Error(`${eventKey} could not be found: ${path}`);
            }
        }
        throw Error(`File could not be found: ${path}`);
    });
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
function load_event(path, event, language, style) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
        if (event._switched) {
            path = `${path}.${eventKey}`;
            return (0, script_1.load_script)(path, event, style);
        }
        if (language !== 'typescript' && language !== 'coffeescript') {
            return undefined;
        }
        if (style === 'refresh') {
            if (!event._lastmod) {
                throw Error('refresh requires _lastmod to be set');
            }
            if (yield fs.pathExists(path)) {
                const stats = yield fs.stat(path);
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
                    if (!event._switched && event.last && (0, hash_1.hash)(code) !== event.last) {
                        event._can_switch = true;
                        const code = zlib.inflateSync(Buffer.from(event.last, 'base64')).toString();
                        (0, script_1.save_script)(`${path}.${eventKey}.ictvers`, code, event);
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
                    if (!event._switched && event.last && (0, hash_1.hash)(code) !== event.last) {
                        event._can_switch = true;
                        const code = zlib.inflateSync(Buffer.from(event.last, 'base64')).toString();
                        (0, script_1.save_script)(`${path}.${eventKey}.ictvers`, code, event);
                    }
                    return code;
                });
            }
            else {
                return load_event_coffee(path, event);
            }
        }
    });
}
exports.load_event = load_event;
