import { ensure_dirs } from "./ensure_dirs";

jest.mock("fs-extra", () => {
    let filesystem: Record<string, string | any> = {
        "Users": {
            "pazollim": {
                "spaceship": {
                    "spaceship.ict": "abc",
                }
            }
        }
    };
    const setNestedObject = (obj: any, pathParts: string[], value: any) => {
        pathParts.reduce((acc, part, index) => {
            if (index === pathParts.length - 1) {
                acc[part] = value;
            } else {
                acc[part] = acc[part] || {};
            }
            return acc[part];
        }, obj);
    };
    return {
        mutate: () => filesystem,
        ensureDir: (path: string) => {
            return Promise.resolve(setNestedObject(filesystem, path.split('/'), {}));
        },
        reset: () => {
            filesystem = {};
        }
    }
});

const fs = require("fs-extra");

describe("ensure_dir", () => {

    it("works as expected", async () => {
        const proj_dir = "Users/pazollim/spaceship/spaceship";
        await ensure_dirs(proj_dir);
        expect(fs.mutate()).toEqual({
            Users: {
                pazollim: {
                    spaceship: {
                        spaceship: {
                            img: {},
                            snd: {},
                            include: {},
                            rooms: {},
                            templates: {},
                            scripts: {}
                        },
                        "spaceship.ict": "abc",
                    }
                }
            }
        });
    });

});
