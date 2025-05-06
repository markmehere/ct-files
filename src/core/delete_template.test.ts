import { hard_delete_room, hard_delete_template, soft_delete_room, soft_delete_template } from "./delete_template";

jest.mock("fs-extra", () => {
    let filesystem: Record<string, string | any> = {
        "Users": {
            "pazollim": {
                "spaceship": {
                    "spaceship.ict": "abc",
                    "spaceship": {
                        "rooms": { "title.ts": "edf", "title.ts.onCreate.ictvers": "a",  "title.ts.onStep.ictvers": "b", "high_scores.ts": "ghi"},
                        "templates": { "spaceship.ts": "jkl", "spaceship.ts.onCreate.ictvers": "a",  "spaceship.ts.onStep.ictvers": "b", "asteroids.ts": "mno",  "keeping_this.ts": "pqr", "keeping_this.ts.onStep.ictvers": "p", },
                        "trash": {}
                    }
                }
            }
        }
    };
    const getNestedObject = (obj: any, pathParts: string[]) => {
        const result = pathParts.reduce((acc, part) => {
            if (acc === undefined || acc[part] === undefined) {
                return undefined;
            }
            return acc[part]
        }, obj);
        return result;
    };
    const setNestedObject = (obj: any, pathParts: string[], value: any) => {
        pathParts.reduce((acc, part, index) => {
            if (index === pathParts.length - 1) {
                if (value === undefined) {
                    delete acc[part];
                    return undefined;
                }
                else {
                    acc[part] = value;
                }
            } else {
                acc[part] = acc[part] || {};
            }
            return acc[part];
        }, obj);
    };
    return {
        mutate: () => filesystem,
        pathExists: (path: string) => Promise.resolve(!!getNestedObject(filesystem, path.split('/'))),
        readFile: (path: string, _encoding: string) => {
            return Promise.resolve(getNestedObject(filesystem, path.split('/')));
        },
        outputFile: (path: string, data: string, _encoding: string) => {
            setNestedObject(filesystem, path.split('/'), data);
            return Promise.resolve();
        },
        readdir: (path: string) => {
            const obj = getNestedObject(filesystem, path.split('/'));
            if (typeof obj !== 'object') {
                throw new Error(`Path is not a directory: ${path}`);
            }
            return Promise.resolve(Object.keys(obj));
        },
        copy: (src: string, dest: string) => {
            const srcParts = src.split('/');
            const destParts = dest.split('/');
            const srcContent = getNestedObject(filesystem, srcParts);
            if (srcContent === undefined) {
                throw new Error(`Source file not found: ${src}`);
            }
            setNestedObject(filesystem, destParts, srcContent);
            return Promise.resolve();
        },
        move: (src: string, dest: string, opts?: { overwrite: boolean }) => {
            const original = getNestedObject(filesystem, src.split('/'));
            if (!original) throw Error(`No such file: ${src}`);
            setNestedObject(filesystem, src.split('/'), undefined);
            const destFile = getNestedObject(filesystem, dest.split('/'));
            if (typeof(destFile) === 'string') {
                if (opts?.overwrite) {
                    setNestedObject(filesystem, dest.split('/'), original);
                } else {
                    throw Error(`File already exists: ${dest}`);
                }
            }
            else if (typeof(destFile) === 'object') {
                const new_dest =  `${dest}${dest.endsWith('/') ? '' : '/'}${src.substring(src.lastIndexOf('/') + 1)}`;
                const newDestFile = getNestedObject(filesystem, dest.split('/'));
                if (typeof(newDestFile) === 'string') {
                    if (opts?.overwrite) {
                        setNestedObject(filesystem, new_dest.split('/'), original);
                    } else {
                        throw Error(`File already exists: ${new_dest}`);
                    }
                }
                else {
                    setNestedObject(filesystem, new_dest.split('/'), original);
                }
            }
            else {
                const parent_arr = dest.split('/');
                parent_arr.pop();
                const parent = parent_arr.join('/');
                if (typeof(parent) === 'object') {
                    setNestedObject(filesystem, dest.split('/'), original);
                }
                else if (typeof(parent) === 'string') {
                    throw Error(`${parent} is not a directory`);
                }
                else {
                    throw Error(`${parent} does not exist`);
                }
            }
        },
        remove: (path: string) => setNestedObject(filesystem, path.split('/'), undefined),
        reset: () => {
            filesystem = {};
        }
    }
});

const fs = require("fs-extra");

describe("delete_template", () => {

    it("deletes successfully", async () => {
        await hard_delete_template("Users/pazollim/spaceship/spaceship/templates/spaceship.ts");
        await soft_delete_template("Users/pazollim/spaceship/spaceship/templates/asteroids.ts", "Users/pazollim/spaceship/spaceship/trash");
        await hard_delete_room("Users/pazollim/spaceship/spaceship/rooms/title.ts");
        await soft_delete_room("Users/pazollim/spaceship/spaceship/rooms/high_scores.ts", "Users/pazollim/spaceship/spaceship/trash");
        expect(fs.mutate()).toEqual({
            Users: {
                pazollim: {
                    spaceship: {
                        spaceship: {
                            rooms: { },
                            templates: {
                                "keeping_this.ts": "pqr",
                                "keeping_this.ts.onStep.ictvers": "p"
                            },
                            trash: {
                                "asteroids.ts": "mno",
                                "high_scores.ts": "ghi"
                            }
                        },
                        "spaceship.ict": "abc",
                    }
                }
            }
        });
    });

});
