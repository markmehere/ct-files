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
exports.hard_delete_script = exports.soft_delete_script = exports.save_and_commit_script = exports.save_script = exports.load_script = void 0;
const hash_1 = require("./utils/hash");
const normalize_1 = require("./utils/normalize");
const zlib = require("zlib");
const fs = require("fs-extra");
const upath = require("path");
/**
 * Loads a script from the file system.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param script the script metadata (_lastmod is updated and the ictvers is expanded if loading)
 * @param style the load style (initial, refresh, compile or switch) - initial adds .ictvers,
 *              refresh returns undefined if the file has not been modified
 * @returns a promise that resolves to the script's content
 */
function load_script(path, script, style) {
    return __awaiter(this, void 0, void 0, function* () {
        if (script._switched) {
            path = `${path}.ictvers`;
        }
        if (style === 'refresh') {
            if (!script._lastmod) {
                throw Error('refresh requires _lastmod to be set');
            }
            if (yield fs.pathExists(path)) {
                const stats = yield fs.stat(path);
                if (stats.mtimeMs < script._lastmod) {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }
        if (yield fs.pathExists(path)) {
            script._lastmod = Number(new Date()) + 100;
            const content = (0, normalize_1.normalize_code)(yield fs.readFile(path, 'utf8'));
            if (style === 'initial' && !script._switched && script.last && (0, hash_1.hash)(content) !== script.last) {
                script._can_switch = true;
                const unzippedContent = zlib.inflateSync(Buffer.from(script.last, 'base64')).toString();
                yield fs.outputFile(`${path}.ictvers`, unzippedContent, 'utf8');
            }
            return content;
        }
        else if (script.last) {
            const unzippedContent = zlib.inflateSync(Buffer.from(script.last, 'base64')).toString();
            return unzippedContent;
        }
        throw Error(`File not found: ${path}`);
    });
}
exports.load_script = load_script;
/**
 * Saves a script to the file system.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param code the script code to save
 * @param script the script metadata
 * @param safeOverwrite if true, file will be moved .backup if it exists and is different
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 */
function save_script(path, code, script, safeOverwrite = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (script._switched) {
            path = `${path}.ictvers`;
        }
        const corrected = (0, normalize_1.normalize_code)(code);
        if (safeOverwrite && (yield fs.pathExists(path))) {
            const existingContent = (0, hash_1.hash)(yield fs.readFile(path, 'utf8'));
            if (existingContent !== (0, hash_1.hash)(code)) {
                yield fs.move(path, `${path}.backup`, { overwrite: true });
            }
        }
        script._lastmod = Number(new Date()) + 100;
        yield fs.outputFile(`${path}`, corrected, 'utf8');
        return corrected;
    });
}
exports.save_script = save_script;
/**
 * Saves and commits a script. Commiting means the script is saved to the project as
 * well as the file system removing any previous verision. It is hashed for easy
 * comparison between the file system and project later.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param code the script code to save
 * @param script the script metadata
 * @param safeOverwrite if true, file will be moved .backup if it exists and is different
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 */
function save_and_commit_script(path, code, script, safeOverwrite = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs.pathExists(path + '.ictvers'))
            yield fs.remove(path + '.ictvers');
        script._switched = false;
        script._can_switch = false;
        script._lastmod = Number(new Date()) + 100;
        const result = yield save_script(path, code, script, safeOverwrite);
        const compressedScript = zlib.deflateSync(result).toString('base64');
        script.last = compressedScript;
        script.hash = (0, hash_1.hash)(result);
    });
}
exports.save_and_commit_script = save_and_commit_script;
/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param trash_path the path to the trash directory
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
function soft_delete_script(path, trash_path, _script) {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = upath.basename(path);
        yield fs.move(path, upath.join(trash_path, filename));
        if (yield fs.pathExists(`${path}.ictvers`)) {
            yield fs.remove(`${path}.ictvers`);
            return true;
        }
        return false;
    });
}
exports.soft_delete_script = soft_delete_script;
/**
 * Deletes a script from the file system.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
function hard_delete_script(path, _script) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.remove(path);
        if (yield fs.pathExists(`${path}.ictvers`)) {
            yield fs.remove(`${path}.ictvers`);
            return true;
        }
        return false;
    });
}
exports.hard_delete_script = hard_delete_script;
