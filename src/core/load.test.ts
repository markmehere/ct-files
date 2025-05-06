import { load } from "./load";

jest.mock("fs-extra", () => {
    let filesystem: Record<string, string> = {};
    return {
        pathExists: (path: string) => Promise.resolve(true),
        readFile: (path: string, _encoding: string) => {
            if (path.includes('Spaceship.ict')) {
                return Promise.resolve(
                    'name: My Game\n' +
                    'version: \'1.0\'\n' +
                    `lastmod_data: ${btoa(JSON.stringify({ 'ac18324': 1234567890, 'afd3324': 6789012345 }))}\n` +
                    'textures:\n' +
                    '  - uid: ac18324\n' +
                    '    origname: ac18324.png\n' +
                    '    source: ~/Developer/spaceship.png\n' +
                    '  - uid: afd3324\n' +
                    '    origname: asteroid.png\n' +
                    '    source: /tmp/asteroid.png\n' +
                    '  - uid: 83d423\n' +
                    '    origname: 83d423.png\n' +
                    '    source: ~/Downloads/cannister.png\n'
                );
            }
            else if (path.includes('.uid_db.yaml')) {
                return Promise.resolve(
                    'ac18324: spaceship.png\n' +
                    'afd3324: asteroid.png\n' +
                    '83d423: cannister.png\n'
                );
            }
        }
    }
});

jest.mock("os", () => ({
    homedir: () => '/Users/pazollim'
}));

describe('load', () => {

    test('loads correctly', async () => {
        const result = await load('Spaceship.ict', '.uid_db.yaml');

        expect(result).toEqual({
            name: 'My Game',
            version: '1.0',
            lastmod_data: expect.any(String),
            textures: [
                { uid: 'ac18324', lastmod: 1234567890, origname: 'spaceship.png', source: '/Users/pazollim/Developer/spaceship.png' },
                { uid: 'afd3324', lastmod: 6789012345, origname: 'asteroid.png', source: '/tmp/asteroid.png' },
                { uid: '83d423', origname: 'cannister.png', source: '/Users/pazollim/Downloads/cannister.png' }
            ]
        });
    });

})
