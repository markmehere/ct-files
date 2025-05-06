/**
 * Ensures all critical project directories exist. Not all directories
 * are considered critical.
 *
 * @param path the path to the project directory
 */
export declare function ensure_dirs(path: string): Promise<void>;
