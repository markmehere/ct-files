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
exports.rename_event = void 0;
const fs = require("fs-extra");
const normalize_1 = require("./utils/normalize");
const save_event_1 = require("./save_event");
function rename_event_ts(path, srcfn, destfn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs.pathExists(path)) {
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
            const functionStartRegex = new RegExp(`^${srcfn}\\s*\\(`);
            const functionEndRegex = new RegExp(`^.*\\/\\*\\s*end\\s*${srcfn}\\s*\\*\\/`);
            const lines = existingContent.split('\n');
            let startIndex = lines.findIndex(line => functionStartRegex.test(line.trim()));
            lines[startIndex] = lines[startIndex].replace(srcfn, destfn);
            let endIndex = lines.findIndex(line => functionEndRegex.test(line.trim()));
            if (endIndex > -1) {
                lines[endIndex] = lines[endIndex].replace(srcfn, destfn);
            }
            else {
                endIndex = (0, save_event_1.findClosingBracket)(lines, startIndex);
                if (endIndex > -1 && lines[endIndex].trim().replace(/\/\*.+/, '') === '}') {
                    lines[endIndex] = `    } /* end ${destfn} */`;
                }
            }
            return fs.outputFile(path, lines.join('\n'), 'utf8');
        }
        throw Error(`Event could not be found: "${srcfn}" in ${path}`);
    });
}
function rename_event_coffee(path, srcfn, destfn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs.pathExists(path)) {
            const existingContent = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
            const functionStartRegex = new RegExp(`^${srcfn}\\s*=\\s*\\(`);
            const lines = existingContent.split('\n');
            const startIndex = lines.findIndex(line => functionStartRegex.test(line));
            lines[startIndex] = lines[startIndex].replace(srcfn, destfn);
            return fs.outputFile(path, lines.join('\n'), 'utf8');
        }
        throw Error(`Event could not be found: "${srcfn}" in ${path}`);
    });
}
/**
 * Renames an event from srcfn to destfn.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param srcfn the source function name
 * @param destfn test dest function name
 */
function rename_event(path, language, srcfn, destfn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs.pathExists(`${path}.${srcfn}.ictvers`)) {
            yield fs.move(`${path}.${srcfn}.ictvers`, `${path}.${destfn}.ictvers`);
        }
        if (language === 'typescript') {
            return rename_event_ts(path, srcfn, destfn);
        }
        else if (language === 'coffeescript') {
            return rename_event_coffee(path, srcfn, destfn);
        }
        throw Error(`The language \"${language}\" not supported for event renames`);
    });
}
exports.rename_event = rename_event;
