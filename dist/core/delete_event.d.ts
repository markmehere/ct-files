import { CtEvent } from "./save_event";
/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
export declare function soft_delete_event(path: string, trash_path: string, language: string, event: CtEvent): Promise<string | undefined>;
/**
 * Deletes an event from the file system.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
export declare function hard_delete_event(path: string, language: string, event: CtEvent): Promise<string | undefined>;
