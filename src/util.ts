import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

export function getLastItemFromPath(path: string, offset = 1) : string {
    return path.substring(path.lastIndexOf("\\") + offset);
}

export function getAllButLastItemFromPath(path: string) : string {
    return path.substring(0, path.lastIndexOf("\\"));
}

export function findTSConfig(basePath = process.cwd()) : ts.CompilerOptions|undefined {
    const allThings = fs.readdirSync(basePath, { withFileTypes: true});
    const files = allThings.filter(thing => thing.isFile());
    for (const file of files) {
        if (file.name === "tsconfig.json") {
            const res = ts.convertCompilerOptionsFromJson(undefined, basePath, "tsconfig.json");
            if (res.errors.length) throw new Error(res.errors[0].messageText.toString());
            return res.options;
        }
    }
    const directories = allThings.filter(thing => thing.isDirectory());
    for (const directory of directories) {
        const res = findTSConfig(path.join(basePath, directory.name));
        if (res) return res;
    }
    return undefined;
}