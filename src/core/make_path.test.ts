import { filename, make_path, PathType } from "./make_path";

describe("make_path", () => {

    test("make_path(...) works as expected", () => {
        expect(make_path("spaceship", PathType.Room, "title.ts"))
            .toBe("spaceship/rooms/title.ts");
        expect(make_path("spaceship", PathType.Texture, "asteroid.png"))
            .toBe("spaceship/img/asteroid.png");
        expect(make_path("spaceship", PathType.Template, "asteroid.coffee"))
            .toBe("spaceship/templates/asteroid.coffee");
        expect(make_path("spaceship", "templates", "asteroid.png"))
            .toBe("spaceship/templates/asteroid.png");
    });

    test("filename(...) works as expected", () => {
        expect(filename("asteroid", "coffee")).toBe("asteroid.coffee");
        expect(filename("asteroid", "coffeescript")).toBe("asteroid.coffee");
        expect(filename("asteroid", "typescript")).toBe("asteroid.ts");
        expect(filename("asteroid", "ts")).toBe("asteroid.ts");
        expect(filename("asteroid", "catnip")).toBe("asteroid.catnip");
        expect(filename("Spaceship II", "coffee")).toBe("spaceship_ii.coffee");
        expect(filename("Spaceship II", "coffeescript")).toBe("spaceship_ii.coffee");
        expect(filename("Spaceship II", "typescript")).toBe("spaceship_ii.ts");
        expect(filename("Spaceship II", "ts")).toBe("spaceship_ii.ts");
        expect(filename("Spaceship II", "catnip")).toBe("spaceship_ii.catnip");
    });

})
