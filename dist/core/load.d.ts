import { LoadOptions } from "js-yaml";
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
export declare function load(path: string, uid_db: string, opts?: LoadOptions): Promise<any>;
