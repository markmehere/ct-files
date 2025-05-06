import { move, safeName } from "./move";

jest.mock("fs-extra", () => ({
    pathExists: () => Promise.resolve(true),
    readFile: () => Promise.resolve("ae6d3c: asteroid.png"),
    outputFile: jest.fn().mockReturnValue(Promise.resolve()),
    move: jest.fn().mockReturnValue(Promise.resolve()),
}));

const fs = require("fs-extra");

describe("move", () => {

    test("move works correctly", async () => {
        const src = "my-game/img/3feda62c.png";
        const dest = "my-game/img/spaceship.png";
        const uid_db = ".uid_db.yaml";
        const uid = "3feda62c";

        await move(src, dest, uid_db, uid);

        expect(fs.outputFile).toHaveBeenCalledWith(
            uid_db,
            'ae6d3c: asteroid.png\n3feda62c: spaceship.png\n',
            "utf8"
        );
    });

    test("safeName works correctly", async () => {
        expect(safeName('Works for me!')).toBe('works_for_me');
        expect(safeName('Spaceship II')).toBe('spaceship_ii');
        expect(safeName('Red-Blue-Green')).toBe('red-blue-green');
        expect(safeName('Blue, Purple & Thyme')).toBe('blue_purple_thyme');
        expect(safeName('Works for me!.png')).toBe('works_for_me.png');
        expect(safeName('Spaceship II.bmp')).toBe('spaceship_ii.bmp');
        expect(safeName('Red-Blue-Green.ts')).toBe('red-blue-green.ts');
        expect(safeName('Blue, Purple & Thyme.yaml')).toBe('blue_purple_thyme.yaml');
        expect(safeName('Works for me!', 'coffeescript')).toBe('works_for_me.coffee');
        expect(safeName('Works for me!', 'typescript')).toBe('works_for_me.ts');
        expect(safeName('Works for me!', 'hello.coffee')).toBe('works_for_me.coffee');
        expect(safeName('Works for me!', 'ts')).toBe('works_for_me.ts');
        expect(safeName('Works for me!', 'coffee')).toBe('works_for_me.coffee');
        expect(safeName('Works for me!', '.cpp')).toBe('works_for_me.cpp');
        expect(safeName('Works for me!', 'cpp')).toBe('works_for_me.cpp');
    });

});
