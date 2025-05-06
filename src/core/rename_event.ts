const fs = require("fs-extra");
import { normalize_code } from "./utils/normalize";
import { findClosingBracket } from "./save_event";

async function rename_event_ts(path: string, srcfn: string, destfn: string) {
    if (await fs.pathExists(path)) {
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${srcfn}\\s*\\(`);
        const functionEndRegex = new RegExp(`^.*\\/\\*\\s*end\\s*${srcfn}\\s*\\*\\/`);
        const lines = existingContent.split('\n');
        let startIndex = lines.findIndex(line => functionStartRegex.test(line.trim()));
        lines[startIndex] = lines[startIndex].replace(srcfn, destfn);
        let endIndex = lines.findIndex(line => functionEndRegex.test(line.trim()));
        if (endIndex > -1) {
            lines[endIndex] = lines[endIndex].replace(srcfn, destfn);
        }
        else {
            endIndex = findClosingBracket(lines, startIndex);
            if (endIndex > -1 && lines[endIndex].trim().replace(/\/\*.+/, '') === '}') {
                lines[endIndex] = `    } /* end ${destfn} */`;
            }
        }
        return fs.outputFile(path, lines.join('\n'), 'utf8');
    }

    throw Error(`Event could not be found: "${srcfn}" in ${path}`);
}

async function rename_event_coffee(path: string, srcfn: string, destfn: string) {
    if (await fs.pathExists(path)) {
        const existingContent = normalize_code(await fs.readFile(path, 'utf8'));
        const functionStartRegex = new RegExp(`^${srcfn}\\s*=\\s*\\(`);
        const lines = existingContent.split('\n');
        const startIndex = lines.findIndex(line => functionStartRegex.test(line));
        lines[startIndex] = lines[startIndex].replace(srcfn, destfn);
        return fs.outputFile(path, lines.join('\n'), 'utf8');
    }

    throw Error(`Event could not be found: "${srcfn}" in ${path}`);
}

/**
 * Renames an event from srcfn to destfn.
 *
 * @param path the path to the script file (never the .ictvers file)
 * @param language the language (only typescript or coffee)
 * @param srcfn the source function name
 * @param destfn test dest function name
 */
export async function rename_event(path: string, language: string, srcfn: string, destfn: string) {
    if (await fs.pathExists(`${path}.${srcfn}.ictvers`)) {
        await fs.move(`${path}.${srcfn}.ictvers`, `${path}.${destfn}.ictvers`);
    }

    if (language === 'typescript') {
        return rename_event_ts(path, srcfn, destfn);
    }
    else if (language === 'coffeescript') {
        return rename_event_coffee(path, srcfn, destfn)
    }

    throw Error(`The language \"${language}\" not supported for event renames`);
}
