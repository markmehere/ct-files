/**
 * The safe name is the file name used when saving to the file system. This is
 * important because two files cannot have the same name. Therefore safeName
 * must be called repeatedly to check for collisions.
 *
 * @param name the name of the file
 * @param ext the extension of the file (optional)
 */
export declare function safeName(name: string, ext?: string): string;
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
export declare function move(src: string, dest: string, uid_db: string, uid: string): Promise<void>;
