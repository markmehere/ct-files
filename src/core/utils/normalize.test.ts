import { normalize_code } from "./normalize";

describe('normalize', () => {

    test('does not change UNIX line endings', () => {
        const input = 'This is a test.\n  - This is another line.\n  - This is a third line.\n\n';
        const expected = 'This is a test.\n  - This is another line.\n  - This is a third line.\n\n';
        expect(normalize_code(input)).toBe(expected);
    });

    test('changes Windows line endings', () => {
        const input = 'This is a test.\r\n  - This is another line.\r\n  - This is a third line.\r\n\r\n';
        const expected = 'This is a test.\n  - This is another line.\n  - This is a third line.\n\n';
        expect(normalize_code(input)).toBe(expected);
    });

    test('changes Mac line endings', () => {
        const input = 'This is a test.\r  - This is another line.\r  - This is a third line.\r\r';
        const expected = 'This is a test.\n  - This is another line.\n  - This is a third line.\n\n';
        expect(normalize_code(input)).toBe(expected);
    });

    test('changes tab formatting', () => {
        const input = 'This is a test.\n\t- This is another line.\n\t- This is a third line.\n\n';
        const expected = 'This is a test.\n    - This is another line.\n    - This is a third line.\n\n';
        expect(normalize_code(input)).toBe(expected);
    });

    test('changes tab formatting and Windows line endings', () => {
        const input = 'This is a test.\r\n\t- This is another line.\r\n\t- This is a third line.\r\n\r\n';
        const expected = 'This is a test.\n    - This is another line.\n    - This is a third line.\n\n';
        expect(normalize_code(input)).toBe(expected);
    });
})
