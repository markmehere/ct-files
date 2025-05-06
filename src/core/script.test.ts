import { load_script, save_and_commit_script, save_script } from './script';

jest.mock("fs-extra", () => {
    let filesystem: Record<string, string> = {};
    return {
        pathExists: (path: string) => Promise.resolve(!!filesystem[path]),
        readFile: (path: string, _encoding: string) => {
            if (!filesystem[path]) {
                throw new Error(`File not found: ${path}`);
            }
            return Promise.resolve(filesystem[path]);
        },
        outputFile: (path: string, data: string, _encoding: string) => {
            filesystem[path] = data;
            return Promise.resolve();
        },
        remove: (path: string) => delete filesystem[path],
        reset: () => {
            filesystem = {};
        }
    }
});

const fs = require("fs-extra");

describe('script', () => {

    test('saves and loads scripts correctly', async () => {
        await save_script(
            'move.coffee',
            'move = (sprite) ->\n    sprite.x += 10\n    sprite.y += 10\n',
            { _switched: false }
        );
        expect(await load_script('move.coffee', {}, 'compile')).toBe('move = (sprite) ->\n    sprite.x += 10\n    sprite.y += 10\n');
        await save_script(
            'move.coffee',
            'move = (sprite) ->\r\tsprite.x += 15\r\tsprite.y += 15\r',
            { _switched: true }
        );
        expect(await load_script('move.coffee', { _switched: true }, 'compile'))
            .toBe('move = (sprite) ->\n    sprite.x += 15\n    sprite.y += 15\n');
        expect(await load_script('move.coffee', {}, 'compile'))
            .toBe('move = (sprite) ->\n    sprite.x += 10\n    sprite.y += 10\n');
    });

    test('saves and commits scripts correctly', async () => {
        const script = {
            _switched: true,
            _can_switch: true,
            uid: '34fe203c'
        };
        expect(await fs.pathExists('move.coffee.ictvers')).toBe(true);
        await save_and_commit_script(
            'move.coffee',
            'move = (sprite) ->\r\tsprite.x += 15\r\tsprite.y += 15\r',
            script
        );
        expect(await fs.pathExists('move.coffee.ictvers')).toBe(false);
        expect(await fs.pathExists('move.coffee')).toBe(true);
        expect(await fs.readFile('move.coffee', 'utf8')).toBe(
            'move = (sprite) ->\n    sprite.x += 15\n    sprite.y += 15\n'
        );
    });

})
