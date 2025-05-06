import { make_ts } from "./make_ts";

jest.mock("fs-extra", () => {
    let filesystem: Record<string, string | any> = {
        "ctjs.app": {
            typedefs: { "ct.d.ts": "abc", "keyboardWorkaround.d.ts": "123", "pixi.d.ts": "456" },
            libs: { place: { "types.d.ts": "789" }, sound: { "types.d.ts": "def" }, typeless: "ghi" }
        },
        "Users": {
            "pazollim": {
                "spaceship": {
                    "spaceship.ict": "jkl",
                    "spaceship": { "asteroid.png": "mno" }
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
                acc[part] = value;
            } else {
                acc[part] = acc[part] || {};
            }
            return acc[part];
        }, obj);
    };
    return {
        pathExists: (path: string) => Promise.resolve(!!getNestedObject(filesystem, path.split('/'))),
        readFile: (path: string, _encoding: string) => {
            return Promise.resolve(getNestedObject(filesystem, path.split('/')));
        },
        outputFile: (path: string, data: string, _encoding: string) => {
            setNestedObject(filesystem, path.split('/'), data);
            return Promise.resolve();
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
        reset: () => {
            filesystem = {};
        }
    }
});

const fs = require("fs-extra");

describe("make_ts", () => {

    test("correctly generates TypeScript files", async () => {
        const proj_dir = "Users/pazollim/spaceship/spaceship";
        const core_typedefs_path = "ctjs.app/typedefs";
        const lib_typedefs_path = "ctjs.app/libs";
        const project = {
            libs: {
                place: { types: "place" },
                sound: { types: "sound" },
                typeless: { types: "typeless" }
            }
        };

        await make_ts(proj_dir, core_typedefs_path, lib_typedefs_path, project);

        expect(await fs.readFile('Users/pazollim/spaceship/tsconfig.json')).toMatchSnapshot();
        expect(await fs.readFile('Users/pazollim/spaceship/spaceship/typedefs')).toMatchSnapshot();
    });

})
