import { save, save_r } from './save'

jest.mock("fs-extra", () => ({
    outputFile: jest.fn().mockReturnValue(Promise.resolve())
}));

jest.mock("os", () => ({
    homedir: () => '/Users/pazollim'
}));

const fs = require("fs-extra");

describe('save', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('save works correctly', async () => {
        const path = 'my-game.yaml';
        const project = { name: 'My Game', _session: 'session data' };

        await save(path, project);

        expect(fs.outputFile).toHaveBeenCalledWith(
            path,
            'name: My Game\n',
            'utf8'
        );
    });

    test('save handles undefined correctly', async () => {
        const path = 'my-game.yaml';
        const project = { name: 'My Game', version: undefined, emptyString: '' };

        await save(path, project);

        expect(fs.outputFile).toHaveBeenCalledWith(
            path,
            'name: My Game\nemptyString: \'\'\n',
            'utf8'
        );
    });

    test('save_r works correctly', async () => {
        const path = 'my-game.yaml';
        const project = { name: 'My Game', version: '1.0', author: 'John Doe', rooms: [ { id: 'room-1' }, { id: 'room-2' } ] };

        await save_r(path, project);

        expect(fs.outputFile).toHaveBeenCalledWith(
            path,
            'name: My Game\nversion: \'1.0\'\nauthor: John Doe\nrooms:\n  - id: room-1\n  - id: room-2\n',
            'utf8'
        );
    });

    test('last modifications removed correctly', async () => {
        const path = 'my-game.yaml';
        const project = {
            name: 'My Game',
            version: '1.0',
            textures: [
                { uid: 'texture-1', lastmod: 1234567890 },
                { uid: 'texture-2', lastmod: 6789012345 },
                { name: 'no-uid', lastmod: 1111111111 }
            ]
        };
        const expectedOutput = 'name: My Game\nversion: \'1.0\'\n' +
            'textures:\n  - uid: texture-1\n' +
            '  - uid: texture-2\n  - name: no-uid\n    lastmod: 1111111111\n' +
            `lastmod_data: ${btoa(JSON.stringify({ 'texture-1': 1234567890, 'texture-2': 6789012345 }))}\n`;

        await save(path, project);

        expect(fs.outputFile).toHaveBeenCalledWith(
            path,
            expectedOutput,
            'utf8'
        );
    });

    test('sources simplified for privacy', async () => {
        const path = 'my-game.yaml';
        const project = {
            name: 'My Game',
            version: '1.0',
            textures: [
                { uid: 'texture-1', lastmod: 1234567890, source: '/Users/pazollim/Developer/purpletile.png' },
                { uid: 'texture-2', lastmod: 6789012345, source: '/tmp/rook.png' },
                { name: 'no-uid', lastmod: 1111111111, source: '/Users/pazollim/Downloads/greymarble.png' }
            ]
        };
        const expectedOutput = 'name: My Game\nversion: \'1.0\'\n' +
            'textures:\n  - uid: texture-1\n    source: ~/Developer/purpletile.png\n' +
            '  - uid: texture-2\n    source: /tmp/rook.png\n  - name: no-uid\n    lastmod: 1111111111\n' +
            '    source: ~/Downloads/greymarble.png\n' +
            `lastmod_data: ${btoa(JSON.stringify({ 'texture-1': 1234567890, 'texture-2': 6789012345 }))}\n`;

        await save(path, project);

        expect(fs.outputFile).toHaveBeenCalledWith(
            path,
            expectedOutput,
            'utf8'
        );
    });
})
