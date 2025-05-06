# ct-files

**ct-files** provides a collection of utility functions for the file management
of [ct.js](https://github.com/ct-js/) projects. It was intended to replace
**js-yaml** but now does a fair bit more. The aim of the project is to provide
a natural searchable collection of code files that can be used and searched by
modern code tools rather than putting everything in the ".ict" file or behind
uuid keys. Now the texture of a spaceship can be called `spaceship.png` and
the code for that spaceship will be contained in `spaceship.ts`.

The spaceship metadata itself (e.g. its location, which rooms it is included in,
etc.) remains in the ".ict" file. That said, this utility functions should still
provide significant advantages.

### Advantages

* **Better version control** - code is changed in its respective CoffeeScript or
TypeScript file - not a single monolithic ".ict" file. The many `lastmod` changes
also now take place in a single line.
* **Multi-file searching** - it's now easy to search and replace across all code
files. Compilation uses with the disk versions so any changes can be seen with the
next build.
* **Vibe-code friendly** - some AI code tools already recognise [ct.js](https://github.com/ct-js/)
but this utility structures the code in a more familiar way so both the AI and users
can easily identify and replace the relevant code for any problem.
* **Enhanced privacy** - home directory paths are now shortened to "~/somefile.ts"
so the user's username is not disclosed.
* **Easier design** - direct media editing is now easier as media is stored by its
name not its uuid.

## Installation

To install the package, use npm:

```
npm install ct-files@https://github.com/markmehere/ct-files
```

## Usage

Here is an example of how to move a texture with the package:

```typescript
const ctFiles = require('ct-files');
const newName = ctFiles.safeName(texture.name, 'example.png');
const nameInUse = textures.filter(
    ctex => ctex !== tex
).reduce((acc, tex) =>
    acc || (ctFiles.safeName(tex.name) === newName)
, false);
if (nameInUse) {
    throw Error("Name is already being used.");
}
else {
    ctFiles.move(
        `img/${texture.origName}`, `img/${newName}`, '.uid_db', texture.uid
    );
}
```

Here is an example of how to save, refresh and load a script with the package:

```typescript
const ctFiles = require('ct-files');
let content = await ctFiles.load_script('scoring.ts', script, 'initial');
content = content.replace(
    "window.score += score;",
    "window.score += score * 5; /* increase scoring five-fold */"
);
await ctFiles.save_script('scoring.ts', content, script);

console.log("Allow five minutes for disk editing...");
await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));

const refreshed = await ctFiles.load_script('scoring.ts', script, 'refresh');
if (refreshed) {
    content = refreshed;
}

console.log("Close and commit the script...");
ctFiles.save_and_commit_script('scoring.ts', content, script);
```

## Running tests

The package has a full suite of unit tests:

```
npm test
```

## Contributors

Contributions are welcome to https://github.com/markmehere/ct-files

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software under the terms of the license.
