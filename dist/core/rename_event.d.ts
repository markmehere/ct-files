/**
 * Renames an event from srcfn to destfn.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param srcfn the source function name
 * @param destfn test dest function name
 */
export declare function rename_event(path: string, language: string, srcfn: string, destfn: string): Promise<any>;
