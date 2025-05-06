const fs = require("fs-extra");
const upath = require("path");

async function delete_ictvers(path: string) {
    const parent = upath.dirname(path);
    const basename = upath.basename(path);
    const fpaths = await fs.readdir(parent);
    for (let fpath of fpaths) {
        const filename = upath.basename(fpath);
        if (!filename.match(/\.ictvers$/)) continue;
        if (filename.indexOf(basename + ".")) continue;
        await fs.remove(upath.join(parent, filename));
    }
}

/**
 *  Moves a template (effectively a sprite) to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export async function soft_delete_template(path: string, trash_path: string) {
    delete_ictvers(path);
    if (await fs.pathExists(path)) {
        await fs.move(path, trash_path, { overwrite: true });
        return true;
    }

    return false;
}

/**
 * Moves a room (effectively a sprite) to the trash directory. Effectively
 * an alias for soft_delete_template.
 *
 * @param path the path to the room (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export async function soft_delete_room(path: string, trash_path: string) {
    return soft_delete_template(path, trash_path);
}


/**
 *  Deletes a template (effectively a sprite) from the file system.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export async function hard_delete_template(path: string) {
    delete_ictvers(path);
    if (await fs.pathExists(path)) {
        await fs.remove(path);
        return true;
    }

    return false;
}

/**
 * Deletes a room from the file system. Effectively
 * an alias for hard_delete_copy.
 *
 * @param path the path to the room (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export async function hard_delete_room(path: string) {
    return hard_delete_template(path);
}
