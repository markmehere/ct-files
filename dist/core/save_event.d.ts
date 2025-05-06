interface SaveEventDetails {
    parent: {
        name: string;
        uid: string;
    };
    entitytype: string;
    language: string;
    basetype?: 'AnimatedSprite' | 'Text' | 'BitmapText' | 'NineSlicePlane' | 'Container' | 'Button' | 'SpritedCounter' | 'RepeatingTexture' | 'TextBox';
}
interface CtCommon {
    _lastmod?: number;
    _can_switch?: boolean;
    _switched?: boolean;
    last?: string;
    hash?: string;
}
export interface CtEvent extends CtCommon {
    eventKey: string;
    fnKey?: string;
    code?: string;
    locals?: Record<string, {
        type: string;
    }>;
}
export interface CtScript extends CtCommon {
    uid?: string;
}
export declare function safeClassName(name: string, _entitytype: string): string;
export declare function findClosingBracket(lines: string[], startIndex: number): number;
export declare function save_event_ts(path: string, code: string, event: CtEvent, opts: SaveEventDetails): Promise<string>;
export declare function save_event_coffee(path: string, code: string, event: CtEvent, opts: SaveEventDetails): Promise<string>;
/**
 * Saves an event to the file system. If the event is switched (that is a recovery version not the
 * main one) it saves the code like a script to a file such as "spaceship.ts.onCreate.ictvers").
 * For events saved to the main file it tries to create a legitimate TypeScript or CoffeeScript
 * file with all events belonging to that room or copy.
 *
 * This is the heart of ct-files as these files can be easily parsed by AI and version control
 * systems. They can also be edited by advanced developers and can help with the cognitive
 * complexity of larger projects. Finally it solves [this issue](http://github.com/ct-0js/ct-js-old/issues/122)
 * allowing easy searching of code.
 *
 * @param path the path to the event file (e.g. "spaceship.ts") - never the ".ictvers" version
 * @param code the code to save
 * @param event the event metadata (largely only to update the _lastmod field)
 * @param opts a collection of related information including the parent name, entitytype and language
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 *          or undefined if the code was not saved (e.g. Catnip is kept in the project file)
 */
export declare function save_event(path: string, code: string, event: CtEvent, opts: SaveEventDetails): Promise<string | undefined>;
/**
 * Saves and commits an event to the file system. This is similar to save_event() but it also
 * removes any previous versions of the event (i.e. ".ictvers" files). And saves a compressed
 * version of the code to the project that can be restored at will.
 *
 * @param path the path to the event file (e.g. "spaceship.ts") - never the ".ictvers" version
 * @param code the code to save
 * @param event the event metadata (largely only to update the _lastmod field)
 * @param opts a collection of related information including the parent name, entitytype and language
 * @returns a promise that resolves to the saved content (line endings and tabs may have changed)
 *          or undefined if the code was not saved (e.g. Catnip is kept in the project file)
 */
export declare function save_and_commit_event(path: string, code: string, event: CtEvent, opts: SaveEventDetails): Promise<string | undefined>;
/**
 * In practice all events are committed at once - not individually. This loads each event and
 * then saves and commits them sequentially.
 *
 * @param path the path to the event file (e.g. "spaceship.ts") - never the ".ictvers" version
 * @param code the code to save
 * @param event the event metadata (largely only to update the _lastmod field)
 * @param opts a collection of related information including the parent name, entitytype and language
 * @returns a promise that resolves to an array of the saved content (line endings and tabs may
 *           have changed).
 */
export declare function save_and_commit_all_events(path: string, events: CtEvent[], opts: SaveEventDetails): Promise<{
    code: string | undefined;
    event: CtEvent;
}[]>;
export {};
