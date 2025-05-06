import { LoadOptions } from "js-yaml";
const fs = require("fs-extra");
const YAML = require("js-yaml");
const os = require("os");

function prepareProject(obj: any, mods: Record<string, number>, db: Record<string, string>, pkey?: string): any {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => prepareProject(item, mods, db, pkey));
    }

    const newObj: any = {};
    for (const key in obj) {
        if (key === 'uid') {
            if (mods && mods[obj['uid']]) {
                newObj['lastmod'] = mods[obj['uid']];
            }
            else if (obj['lastmod']) {
                newObj['lastmod'] = obj['lastmod'];
            }
            if (db[obj['uid']]) {
                newObj['origname'] = db[obj['uid']];
            }
            else if (obj['origname']) {
                newObj['origname'] = obj['origname'];
            }
            newObj['uid'] = obj['uid'];
        }
        else if (key === 'source') {
            newObj['source'] = obj['source'].replace('~', os.homedir())
        }
        else if (!obj.uid || (key !== 'origname' && key !== 'lastmod')) {
            const value = obj[key];
            newObj[key] = typeof value === "object" ? prepareProject(value, mods, db, pkey) : value;
        }
    }

    return newObj;
}

function safeExecute(fn: () => any, defaultValue: any) {
    try {
        return fn();
    } catch (e) {
        console.error(e);
        return defaultValue;
    }
}

/**
 * Loads a project from the file system. It does a few things transparently to the user:
 *
 *  - It expands the "~" in paths with the home directory path.
 *  - It extracts the lastmod values from the lastmod_data field.
 *  - It updates the origname with values from the uid_db.
 *
 * @param path the path to the project file (either *.ict or a backup)
 * @param uid_db the path to the uid_db file
 * @param opts options for YAML load (typically not used)
 * @returns a promise containing the project object
 */
export async function load(path: string, uid_db: string, opts?: LoadOptions) {
    const project = await fs.readFile(path, "utf8");
    if (project.indexOf('{') === 0) {
        return JSON.parse(project);
    }
    else {
        // unimpressed by this not being handled automatically
        const undefinedType = new YAML.Type('tag:yaml.org,2002:js/undefined', {
            kind: 'scalar',
            resolve: () => true,
            construct: () => undefined
        });
        let backwardsCompatible = YAML.DEFAULT_SCHEMA.extend([undefinedType]);
        const projectYAML = YAML.load(project, { schema: backwardsCompatible, ...opts });
        const mod_dates = projectYAML['lastmod_data'] ?
            safeExecute(() => JSON.parse(atob(projectYAML['lastmod_data'])), {}) : {};
        const db_txt = await fs.pathExists(uid_db).then((result: boolean) => result ? fs.readFile(uid_db!, "utf8") : '');
        const db: Record<string, string> = (YAML.load(db_txt) || {}) as any;
        return prepareProject(projectYAML, mod_dates, db);
    }
}
