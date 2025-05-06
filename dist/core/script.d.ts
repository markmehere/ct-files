import { LoadStyles } from "./load_event";
import { CtScript } from "./save_event";
/**
 * Loads a script from the file system.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param script the script metadata (_lastmod is updated and the ictvers is expanded if loading)
 * @param style the load style (initial, refresh, compile or switch) - initial adds .ictvers,
 *              refresh returns undefined if the file has not been modified
 * @returns a promise that resolves to the script's content
 */
export declare function load_script(path: string, script: CtScript, style: LoadStyles): Promise<any>;
/**
 * Saves a script to the file system.
 *
 * @param path the path to the script file (.ictvers will be added if _switched is true)
 * @param code the script code to save
 * @param script the script metadata
 * @param safeOverwrite if true, file will be moved .backup if it exists and is different
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 */
export declare function save_script(path: string, code: string, script: CtScript, safeOverwrite?: boolean): Promise<string>;
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
export declare function save_and_commit_script(path: string, code: string, script: CtScript, safeOverwrite?: boolean): Promise<void>;
/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param trash_path the path to the trash directory
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export declare function soft_delete_script(path: string, trash_path: string, _script: CtScript): Promise<boolean>;
/**
 * Deletes a script from the file system.
 *
 * @param path the path to the script file (.ictvers will also be deleted if necessary)
 * @param script the script metadata (not used)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export declare function hard_delete_script(path: string, _script: CtScript): Promise<boolean>;
