const YAML = require("js-yaml");
const fs = require("fs-extra");
const upath = require("path");

/**
 * The safe name is the file name used when saving to the file system. This is
 * important because two files cannot have the same name. Therefore safeName
 * must be called repeatedly to check for collisions.
 *
 * @param name the name of the file
 * @param ext the extension of the file (optional)
 */
export function safeName(name: string, ext?: string) {
    const newExt = { 'coffeescript': 'coffee', 'typescript': 'ts' }[(ext || '').toLowerCase()] || ext;
    if (name.indexOf(".") > -1) {
        const pext = name.substring(name.lastIndexOf(".") + 1);
        const base = name.substring(0, name.lastIndexOf("."));
        return base.replace(/[^a-zA-Z0-9\-]+/g, "_").toLowerCase().replace(/_+$/, "")
            + "." + pext;
    }
    else if (newExt && newExt.indexOf(".") === -1) {
        return name.replace(/[^a-zA-Z0-9\-]+/g, "_").toLowerCase().replace(/_+$/, "")
            + "." + newExt.toLowerCase();
    }
    else if (newExt && newExt.indexOf(".") > -1) {
        return name.replace(/[^a-zA-Z0-9\-]+/g, "_").toLowerCase().replace(/_+$/, "")
            + "." + newExt.substring(newExt.lastIndexOf(".") + 1).toLowerCase();
    }
    else {
        return name.replace(/[^a-zA-Z0-9\-]+/g, "_").toLowerCase().replace(/_+$/, "");
    }
}

/**
 * Moves a file about the file system. This is about keeping the uid_db up-to-date.
 * Essentially at any time there will be roughly three backups of the project file.
 * One of these may refer to "spaceship.png" as "spaceship.png" but the others may
 * refer to its past name "player.png" or its uid "34fe203c.png".
 *
 * They are all different references but meant to point to the same file. Most
 * importantly they'll all have the same uid "34fe203c". The uid_db simply keeps a
 * record of uids and their paths. Upon loading of any project file, the uid_db
 * will be searched for all uids and if a match is found, the origname will be
 * updated to the entry.
 *
 * @param src the source path (absolute or relative)
 * @param dest the destination path (absolute or relative)
 * @param uid_db the path to the uid_db file
 * @param uid the uid of the file being moved
 */
export async function move(src: string, dest: string, uid_db: string, uid: string) {
    try {
        const db_txt = await fs.pathExists(uid_db).then((result: boolean) => result ? fs.readFile(uid_db!, "utf8") : '');
        const db: Record<string, string> = (YAML.load(db_txt) || {}) as any;
        db[uid] = upath.basename(dest);
        const db_yaml = YAML.dump(db);
        await fs.outputFile(uid_db, db_yaml, "utf8");
        await fs.move(src, dest);
    }
    catch (err) {
        throw err;
    }
}
