"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filename = exports.make_path = exports.PathType = void 0;
const move_1 = require("./move");
var PathType;
(function (PathType) {
    PathType["Texture"] = "img";
    PathType["Sound"] = "snd";
    PathType["Room"] = "rooms";
    PathType["Template"] = "templates";
    PathType["Font"] = "fonts";
    PathType["Script"] = "scripts";
})(PathType = exports.PathType || (exports.PathType = {}));
/**
 * Creates a path a simple utility function that's power comes from it typing.
 *
 * @param projdir the project directory
 * @param type the asset type
 * @param origname the file name of the asset (ct.js calls this origname)
 * @returns a relative path to the asset
 */
function make_path(projdir, type, origname) {
    if (typeof origname === 'undefined')
        return undefined;
    if (type === "room")
        type = PathType.Room;
    if (type === "template")
        type = PathType.Template;
    return `${projdir}/${type}/${origname}`;
}
exports.make_path = make_path;
/**
 * Creates a path a simple utility function that's power comes from it typing.
 *
 * @param projdir the project directory
 * @param type the asset type
 * @param origname the file name of the asset (ct.js calls this origname)
 * @returns a relative path to the asset
 */
function filename(name, language) {
    const ext = {
        typescript: "ts",
        ts: "ts",
        javascript: "ts",
        coffee: "coffee",
        coffeescript: "coffee"
    }[language.toLowerCase()] || language.toLowerCase();
    const base = (0, move_1.safeName)(name);
    return `${base}.${ext}`;
}
exports.filename = filename;
