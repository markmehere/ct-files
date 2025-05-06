
import { LoadStyles } from "./load_event";
import { hash } from "./utils/hash";
import { CtScript } from "./save_event";
import { normalize_code } from "./utils/normalize";
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
export async function load_script(path: string, script: CtScript, style: LoadStyles) {
    if (script._switched) {
        path = `${path}.ictvers`;
    }

    if (style === 'refresh') {
        if (!script._lastmod) {
            throw Error('refresh requires _lastmod to be set');
        }
        if (await fs.pathExists(path)) {
            const stats = await fs.stat(path);
            if (stats.mtimeMs < script._lastmod) {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }

    if (await fs.pathExists(path)) {
        script._lastmod = Number(new Date()) + 100;
        const content = normalize_code(await fs.readFile(path, 'utf8'));
        if (style === 'initial' && !script._switched && script.last && hash(content) !== script.last) {
            script._can_switch = true;
            const unzippedContent = zlib.inflateSync(Buffer.from(script.last, 'base64')).toString();
            await fs.outputFile(`${path}.ictvers`, unzippedContent, 'utf8');
        }
        return content;
    }
    else if (script.last) {
        const unzippedContent = zlib.inflateSync(Buffer.from(script.last, 'base64')).toString();
        return unzippedContent;
    }

    throw Error(`File not found: ${path}`);
}

/**
 * Saves a script to the file system.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param code the script code to save
 * @param script the script metadata
 * @param safeOverwrite if true, file will be moved .backup if it exists and is different
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 */
export async function save_script(path: string, code: string, script: CtScript, safeOverwrite: boolean = false) {
    if (script._switched) {
        path = `${path}.ictvers`;
    }
    const corrected = normalize_code(code);
    if (safeOverwrite && await fs.pathExists(path)) {
        const existingContent = hash(await fs.readFile(path, 'utf8'));
        if (existingContent !== hash(code)) {
            await fs.move(path, `${path}.backup`, { overwrite: true });
        }
    }
    script._lastmod = Number(new Date()) + 100;
    await fs.outputFile(`${path}`, corrected, 'utf8');
    return corrected;
}

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
export async function save_and_commit_script(path: string, code: string, script: CtScript, safeOverwrite: boolean = false) {
    if (await fs.pathExists(path + '.ictvers'))
        await fs.remove(path + '.ictvers');
    script._switched = false;
    script._can_switch = false;

    script._lastmod = Number(new Date()) + 100;
    const result = await save_script(path, code, script, safeOverwrite);

    const compressedScript = zlib.deflateSync(result).toString('base64');
    script.last = compressedScript;
    script.hash = hash(result);
}

/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param trash_path the path to the trash directory
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export async function soft_delete_script(path: string, trash_path: string, _script: CtScript) {
    const filename = upath.basename(path);
    await fs.move(path, upath.join(trash_path, filename));
    if (await fs.pathExists(`${path}.ictvers`)) {
        await fs.remove(`${path}.ictvers`);
        return true;
    }
    return false;
}

/**
 * Deletes a script from the file system.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export async function hard_delete_script(path: string, _script: CtScript) {
    await fs.remove(path);
    if (await fs.pathExists(`${path}.ictvers`)) {
        await fs.remove(`${path}.ictvers`);
        return true;
    }
    return false;
}
