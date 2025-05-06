export declare enum PathType {
    Texture = "img",
    Sound = "snd",
    Room = "rooms",
    Template = "templates",
    Font = "fonts",
    Script = "scripts"
}
/**
 * Creates a path a simple utility function that's power comes from it typing.
 *
 * @param projdir the project directory
 * @param type the asset type
 * @param origname the file name of the asset (ct.js calls this origname)
 * @returns a relative path to the asset
 */
export declare function make_path(projdir: string, type: PathType | string, origname: string): string | undefined;
/**
 * Creates a path a simple utility function that's power comes from it typing.
 *
 * @param projdir the project directory
 * @param type the asset type
 * @param origname the file name of the asset (ct.js calls this origname)
 * @returns a relative path to the asset
 */
export declare function filename(name: string, language: string): string;
