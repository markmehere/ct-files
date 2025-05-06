/**
 *  Moves a template (effectively a sprite) to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export declare function soft_delete_template(path: string, trash_path: string): Promise<boolean>;
/**
 * Moves a room (effectively a sprite) to the trash directory. Effectively
 * an alias for soft_delete_template.
 *
 * @param path the path to the room (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @returns a promise that resolves to true if the file was moved, false otherwise
 */
export declare function soft_delete_room(path: string, trash_path: string): Promise<boolean>;
/**
 *  Deletes a template (effectively a sprite) from the file system.
 *
 * @param path the path to the copy (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export declare function hard_delete_template(path: string): Promise<boolean>;
/**
 * Deletes a room from the file system. Effectively
 * an alias for hard_delete_copy.
 *
 * @param path the path to the room (never the .ictvers file)
 * @returns a promise that resolves to true if the file was deleted, false otherwise
 */
export declare function hard_delete_room(path: string): Promise<boolean>;
