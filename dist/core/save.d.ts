import { DumpOptions } from "js-yaml";
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
export declare function save(path: string, project: any, opts?: DumpOptions): Promise<any>;
/**
 * An alias for save() that should be used for backup/recovery files.
 *
 * @param path the path to the project file (either *.ict or a backup)
 * @param project the project object to save
 * @param opts options for YAML dump (typically not used)
 * @returns the promise returned by fs.outputFile
 */
export declare function save_r(path: string, project: any, opts?: DumpOptions): Promise<any>;
