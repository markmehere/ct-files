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
exports.save_r = exports.save = void 0;
const fs = require("fs-extra");
const YAML = require("js-yaml");
const os = require("os");
function cleanProject(obj, pkey, mods) {
    if (!obj || typeof obj !== "object")
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(item => cleanProject(item, pkey, mods));
    }
    const originMod = mods ? undefined : {};
    const newObj = {};
    for (const key in obj) {
        if (key[0] === '_') {
            /* session-only information do not copy */
        }
        else if (key === 'lastmod' && obj['uid'] && mods) {
            mods[obj['uid']] = obj[key];
            newObj[key] = undefined;
        }
        else if (key === 'source') {
            newObj['source'] = obj['source'].replace(os.homedir(), '~');
        }
        else {
            const value = obj[key];
            newObj[key] = typeof value === "object" ? cleanProject(value, pkey, originMod) : value;
        }
    }
    if (originMod && Object.keys(originMod).length > 0) {
        newObj['lastmod_data'] = btoa(JSON.stringify(originMod));
    }
    return newObj;
}
/**
 * Saves a project to the file system. This does a few extra things including moving lastmod
 * to the lastmod_data field, removing keys beginning with an underscore, reduces
 * the home directory path to "~" for privacy reasons.
 *
 * @param path the path to the project file (either *.ict or a backup)
 * @param project the project object to save
 * @param opts options for YAML dump (typically not used)
 * @returns the promise returned by fs.outputFile
 */
function save(path, project, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectForSave = cleanProject(project);
        const projectYAML = YAML.dump(projectForSave, opts);
        return fs.outputFile(path, projectYAML, "utf8");
    });
}
exports.save = save;
/**
 * An alias for save() that should be used for backup/recovery files.
 *
 * @param path the path to the project file (either *.ict or a backup)
 * @param project the project object to save
 * @param opts options for YAML dump (typically not used)
 * @returns the promise returned by fs.outputFile
 */
function save_r(path, project, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return save(path, project, opts);
    });
}
exports.save_r = save_r;
