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
exports.hard_delete_event = exports.soft_delete_event = void 0;
const fs = require("fs-extra");
const save_event_1 = require("./save_event");
const normalize_1 = require("./utils/normalize");
const upath = require("path");
function delete_event_ts(path, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
        let code = undefined;
        if (yield fs.pathExists(path)) {
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
            const functionStartRegex = new RegExp(`^${eventKey}\\s*\\(`);
            const functionEndRegex = new RegExp(`^.*\\/\\*\\s*end\\s*${eventKey}\\s*\\*\\/`);
            const lines = existingContent.split('\n');
            let startIndex = lines.findIndex(line => functionStartRegex.test(line.trim()));
            let endIndex = lines.findIndex(line => functionEndRegex.test(line.trim()));
            if (startIndex > -1 && endIndex > -1) {
                code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^        /, '')).join('\n') + '\n';
                yield fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex + 2)).join('\n'), 'utf8');
            }
            else if (startIndex > -1 && endIndex === -1) {
                console.warn(`Warning: No closing bracket comment found for ${eventKey} in ${path}`);
                endIndex = (0, save_event_1.findClosingBracket)(lines, startIndex);
                if (endIndex === -1) {
                    throw Error(`File could not be parsed: ${path}`);
                }
                code = lines.slice(startIndex, endIndex + 1).map(line => line.replace(/^        /, '')).join('\n') + '\n';
                yield fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex + 1)).join('\n'), 'utf8');
            }
        }
        return code;
    });
}
function delete_event_coffee(path, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
        let code = undefined;
        if (yield fs.pathExists(path)) {
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
            const functionStartRegex = new RegExp(`^${eventKey}\\s*=\\s*\\(`);
            const functionEndRegex = /^[^\s]/;
            const lines = existingContent.split('\n');
            const startIndex = lines.findIndex(line => functionStartRegex.test(line));
            if (startIndex > -1) {
                const endIndex = lines.findIndex((line, i) => i > startIndex && functionEndRegex.test(line));
                if (endIndex === -1) {
                    code = lines.slice(startIndex + 1).map(line => line.replace(/^    /, '')).join('\n');
                    yield fs.outputFile(path, lines.slice(0, startIndex).join('\n') + '\n', 'utf8');
                }
                else {
                    code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^    /, '')).join('\n') + '\n';
                    yield fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex)).join('\n'), 'utf8');
                }
            }
        }
        return code;
    });
}
/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
function soft_delete_event(path, trash_path, language, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.eventKey[0].toLowerCase() + event.eventKey.slice(1);
        if (yield fs.pathExists(`${path}.${eventKey}.ictvers`)) {
            yield fs.remove(`${path}.${eventKey}.ictvers`);
        }
        if (language === 'typescript') {
            const code = yield delete_event_ts(path, event);
            yield fs.outputFile(upath.join(trash_path, upath.basename(path).split('.')
                .map((part, i, arr) => i === arr.length - 2 ? `${part}.${eventKey}` : part)
                .join('.')), code, 'utf8');
            return code;
        }
        else if (language === 'coffeescript') {
            delete_event_coffee(path, event);
        }
        throw Error(`The language \"${language}\" not supported for deletions`);
    });
}
exports.soft_delete_event = soft_delete_event;
/**
 * Deletes an event from the file system.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
function hard_delete_event(path, language, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = event.eventKey[0].toLowerCase() + event.eventKey.slice(1);
        if (yield fs.pathExists(`${path}.${eventKey}.ictvers`)) {
            yield fs.remove(`${path}.${eventKey}.ictvers`);
        }
        if (language === 'typescript') {
            return delete_event_ts(path, event);
        }
        else if (language === 'coffeescript') {
            return delete_event_coffee(path, event);
        }
        throw Error(`The language \"${language}\" not supported for deletions`);
    });
}
exports.hard_delete_event = hard_delete_event;
