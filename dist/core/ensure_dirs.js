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
exports.ensure_dirs = void 0;
const fs = require("fs-extra");
const upath = require("path");
/**
 * Ensures all critical project directories exist. Not all directories
 * are considered critical.
 *
 * @param path the path to the project directory
 */
function ensure_dirs(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirsToCheck = [
            'img',
            'snd',
            'include',
            'scripts',
            'rooms',
            'templates'
        ];
        yield fs.ensureDir(path);
        const promises = dirsToCheck.map((dir) => fs.ensureDir(upath.join(path, dir)));
        Promise.all(promises);
    });
}
exports.ensure_dirs = ensure_dirs;
