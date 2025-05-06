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
exports.hard_delete_room = exports.hard_delete_template = exports.soft_delete_room = exports.soft_delete_template = void 0;
const fs = require("fs-extra");
const upath = require("path");
function delete_ictvers(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const parent = upath.dirname(path);
        const basename = upath.basename(path);
        const fpaths = yield fs.readdir(parent);
        for (let fpath of fpaths) {
            const filename = upath.basename(fpath);
            if (!filename.match(/\.ictvers$/))
                continue;
            if (filename.indexOf(basename + "."))
                continue;
            yield fs.remove(upath.join(parent, filename));
        }
    });
}
/**
 *  Moves a template (effectively a sprite) to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
function soft_delete_template(path, trash_path) {
    return __awaiter(this, void 0, void 0, function* () {
        delete_ictvers(path);
        if (yield fs.pathExists(path)) {
            yield fs.move(path, trash_path, { overwrite: true });
            return true;
        }
        return false;
    });
}
exports.soft_delete_template = soft_delete_template;
/**
 * Moves a room (effectively a sprite) to the trash directory. Effectively
 * an alias for soft_delete_template.
 *
 * @param path the path to the room (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
function soft_delete_room(path, trash_path) {
    return __awaiter(this, void 0, void 0, function* () {
        return soft_delete_template(path, trash_path);
    });
}
exports.soft_delete_room = soft_delete_room;
/**
 *  Deletes a template (effectively a sprite) from the file system.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
function hard_delete_template(path) {
    return __awaiter(this, void 0, void 0, function* () {
        delete_ictvers(path);
        if (yield fs.pathExists(path)) {
            yield fs.remove(path);
            return true;
        }
        return false;
    });
}
exports.hard_delete_template = hard_delete_template;
/**
 * Deletes a room from the file system. Effectively
 * an alias for hard_delete_copy.
 *
 * @param path the path to the room (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
function hard_delete_room(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return hard_delete_template(path);
    });
}
exports.hard_delete_room = hard_delete_room;
