import { DumpOptions } from "js-yaml";
const fs = require("fs-extra");
const YAML = require("js-yaml");
const os = require("os");

function cleanProject(obj: any, pkey?: string, mods?: Record<string, number>): any {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => cleanProject(item, pkey, mods));
    }

    const originMod = mods ? undefined : {};

    const newObj: any = {};
    for (const key in obj) {
        if (key[0] === '_') {
            /* session-only information do not copy */
        }
        else if (key === 'lastmod' && obj['uid'] && mods) {
            mods[obj['uid']] = obj[key];
            newObj[key] = undefined;
        }
        else if (key === 'source') {
            newObj['source'] = obj['source'].replace(os.homedir(), '~')
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
export async function save(path: string, project: any, opts?: DumpOptions) {
    const projectForSave = cleanProject(project);
    const projectYAML = YAML.dump(projectForSave, opts);
    return fs.outputFile(path, projectYAML, "utf8");
}

/**
 * An alias for save() that should be used for backup/recovery files.
 *
 * @param path the path to the project file (either *.ict or a backup)
 * @param project the project object to save
 * @param opts options for YAML dump (typically not used)
 * @returns the promise returned by fs.outputFile
 */
export async function save_r(path: string, project: any, opts?: DumpOptions) {
    return save(path, project, opts);
}
