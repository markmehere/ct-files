const fs = require("fs-extra");
const upath = require("path");

/**
 * Ensures all critical project directories exist. Not all directories
 * are considered critical.
 *
 * @param path the path to the project directory
 */
export async function ensure_dirs(path: string): Promise<void> {
    const dirsToCheck = [
        'img',
        'snd',
        'include',
        'scripts',
        'rooms',
        'templates'
    ];
    await fs.ensureDir(path);
    const promises = dirsToCheck.map((dir) =>
        fs.ensureDir(upath.join(path, dir)) as Promise<void>
    );
    Promise.all(promises);
}

