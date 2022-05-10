import fs from 'fs';
import path from 'path';

export default class System {
    static ENOENT_FILE = `The provided file path is invalid or the file does not exist`;
    static ENOENT_FOLDER = `The provided directory path is invalid or the directory does not exist`;

    static EEXIST_FOLE = `The provided file already exists; please delete the file before continuing`;
    static EEXIST_FOLDER = `The provided directory already exists; please delete the directory before continuing`;

    static VALIDATION_MODE = {
        FILE_EXISTS: 1,
        FILE_NOT_EXISTS: 2,
        FOLDER_EXISTS: 3,
        FOLDER_NOT_EXISTS: 4,
    };

    static resolvePath(filePath) {
        if (filePath[0] === `~`) {
            return path.resolve(process.env.HOME, filePath.slice(1));
        }
        return path.resolve(filePath);
    };

    static validatePath(filePath, validationMode) {
        const resolvedPath = this.resolvePath(filePath);

        switch (validationMode) {
            case this.VALIDATION_MODE.FILE_EXISTS:
                return fs.existsSync(resolvedPath) && fs.lstatSync(filePath).isFile();
            case this.VALIDATION_MODE.FILE_NOT_EXISTS:
                return !fs.existsSync(resolvedPath);
            case this.VALIDATION_MODE.FOLDER_EXISTS:
                return fs.existsSync(resolvedPath) && fs.lstatSync(filePath).isDirectory();
            case this.VALIDATION_MODE.FOLDER_NOT_EXISTS:
                return !fs.existsSync(resolvedPath);
        }
    };

    static getFileExtension(filePath) {
        return path.extname(filePath);
    };
}