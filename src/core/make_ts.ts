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
export async function make_ts(
    proj_dir: string,
    core_typedefs_path: string,
    lib_typedefs_path: string,
    project: any
) {
    await fs.outputFile(upath.join(proj_dir, '..', 'tsconfig.json'), JSON.stringify({
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
    if (!(await fs.pathExists(upath.join(proj_dir, 'typedefs')))) {
        await fs.copy(core_typedefs_path, upath.join(proj_dir, 'typedefs'));
    }
    debugger;
    const promises = Object.keys(project.libs).map(async (lib) => {
        const libt_path = upath.join(lib_typedefs_path, lib, 'types.d.ts');
        if (await fs.pathExists(libt_path)) {
            if (!(await fs.pathExists(upath.join(proj_dir, 'typedefs', `${lib}.d.ts`)))) {
                await fs.copy(libt_path, upath.join(proj_dir, 'typedefs', `${lib}.d.ts`));
            }
        }
    });
    await Promise.all(promises);
}
