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
exports.make_ts = void 0;
const fs = require("fs-extra");
const upath = require("path");
/**
 * Adds all type information to the project. If you're using an exotic include
 * (e.g. seedrandom) this isn't going to help you and you obviously have no
 * node_modules to help either. Nevertheless it should do a pretty good job of
 * defining most types. It is the callers responsibility to ensure that this is
 * only added to TypeScript projects - the types will be added regardless.
 *
 * @param proj_dir the project directory this is the directory alongside the
 *                 ict file.
 * @param core_typedefs_path the directory to ct.js core typedefs - keeping
 *                           in mind this should be the directory at runtime
 * @param lib_typedefs_path  the directory of ct.js libraries (a.k.a catmods)
 *                           - each contains a types.d.ts file (again this
 *                           should be the directory at runtime)
 * @param project the project object
 */
function make_ts(proj_dir, core_typedefs_path, lib_typedefs_path, project) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.outputFile(upath.join(proj_dir, '..', 'tsconfig.json'), JSON.stringify({
            "compilerOptions": {
                "target": "ES6",
                "module": "none",
                "noEmit": true,
                "skipLibCheck": true,
                "lib": ["DOM", "ES6"],
                "types": []
            },
            "include": [
                "./**/*.ts",
                "./**/*.d.ts"
            ],
            "exclude": [
                "node_modules"
            ]
        }, null, 2), "utf8");
        if (!(yield fs.pathExists(upath.join(proj_dir, 'typedefs')))) {
            yield fs.copy(core_typedefs_path, upath.join(proj_dir, 'typedefs'));
        }
        debugger;
        const promises = Object.keys(project.libs).map((lib) => __awaiter(this, void 0, void 0, function* () {
            const libt_path = upath.join(lib_typedefs_path, lib, 'types.d.ts');
            if (yield fs.pathExists(libt_path)) {
                if (!(yield fs.pathExists(upath.join(proj_dir, 'typedefs', `${lib}.d.ts`)))) {
                    yield fs.copy(libt_path, upath.join(proj_dir, 'typedefs', `${lib}.d.ts`));
                }
            }
        }));
        yield Promise.all(promises);
    });
}
exports.make_ts = make_ts;
