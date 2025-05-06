const fs = require("fs-extra");
import { CtEvent, findClosingBracket } from "./save_event";
import { normalize_code } from "./utils/normalize";
const upath = require("path");

async function delete_event_ts(path: string, event: CtEvent) {
    const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
    let code = undefined;

    if (await fs.pathExists(path)) {
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${eventKey}\\s*\\(`);
        const functionEndRegex = new RegExp(`^.*\\/\\*\\s*end\\s*${eventKey}\\s*\\*\\/`);
        const lines = existingContent.split('\n');
        let startIndex = lines.findIndex(line => functionStartRegex.test(line.trim()));
        let endIndex = lines.findIndex(line => functionEndRegex.test(line.trim()));
        if (startIndex > -1 && endIndex > -1) {
            code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^        /, '')).join('\n') + '\n';
            await fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex + 2)).join('\n'), 'utf8');
        }
        else if (startIndex > -1 && endIndex === -1) {
            console.warn(`Warning: No closing bracket comment found for ${eventKey} in ${path}`);
            endIndex = findClosingBracket(lines, startIndex);
            if (endIndex === -1) {
                throw Error(`File could not be parsed: ${path}`);
            }
            code = lines.slice(startIndex, endIndex + 1).map(line => line.replace(/^        /, '')).join('\n') + '\n';
            await fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex + 1)).join('\n'), 'utf8');
        }
    }

    return code;
}

async function delete_event_coffee(path: string, event: CtEvent) {
    const eventKey = event.fnKey || (event.eventKey[0].toLowerCase() + event.eventKey.slice(1));
    let code = undefined;

    if (await fs.pathExists(path)) {
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${eventKey}\\s*=\\s*\\(`);
        const functionEndRegex = /^[^\s]/;
        const lines = existingContent.split('\n');
        const startIndex = lines.findIndex(line => functionStartRegex.test(line));
        if (startIndex > -1) {
            const endIndex = lines.findIndex((line, i) => i > startIndex && functionEndRegex.test(line));
            if (endIndex === -1) {
                code = lines.slice(startIndex + 1).map(line => line.replace(/^    /, '')).join('\n');
                await fs.outputFile(path, lines.slice(0, startIndex).join('\n') + '\n', 'utf8');
            }
            else {
                code = lines.slice(startIndex + 1, endIndex).map(line => line.replace(/^    /, '')).join('\n') + '\n'
                await fs.outputFile(path, lines.slice(0, startIndex).concat(lines.slice(endIndex)).join('\n'), 'utf8');
            }
        }
    }

    return code;
}

/**
 * Moves a script to the trash directory. Deletes the .ictvers file.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param trash_path the path to the trash directory
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
export async function soft_delete_event(path: string, trash_path: string, language: string, event: CtEvent) {
    const eventKey = event.eventKey[0].toLowerCase() + event.eventKey.slice(1);

    if (await fs.pathExists(`${path}.${eventKey}.ictvers`)) {
        await fs.remove(`${path}.${eventKey}.ictvers`);
    }

    if (language === 'typescript') {
        const code = await delete_event_ts(path, event);
        await fs.outputFile(upath.join(trash_path,
            upath.basename(path).split('.')
                .map((part: string, i: number, arr: string[]) => i === arr.length - 2 ? `${part}.${eventKey}` : part)
                .join('.')
        ), code, 'utf8');
        return code
    }
    else if (language === 'coffeescript') {
        delete_event_coffee(path, event)
    }

    throw Error(`The language \"${language}\" not supported for deletions`);
}

/**
 * Deletes an event from the file system.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param event the event metadata
 */
export async function hard_delete_event(path: string, language: string, event: CtEvent) {
    const eventKey = event.eventKey[0].toLowerCase() + event.eventKey.slice(1);

    if (await fs.pathExists(`${path}.${eventKey}.ictvers`)) {
        await fs.remove(`${path}.${eventKey}.ictvers`);
    }

    if (language === 'typescript') {
        return delete_event_ts(path, event);
    }
    else if (language === 'coffeescript') {
        return delete_event_coffee(path, event)
    }

    throw Error(`The language \"${language}\" not supported for deletions`);
}
