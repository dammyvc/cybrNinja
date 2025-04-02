declare module "formidable" {
    export default any;
    export interface Fields {
        [key: string]: string[] | undefined;
    }
    export interface Files {
        [key: string]: File | File[] | undefined;
    }
    export interface File {
        filepath: string;
        originalFilename: string | null;
        mimetype: string | null;
        size: number;
    }
    export interface Formidable {
        parse: (
            req: any,
            callback: (err: any, fields: Fields, files: Files) => void
        ) => void;
    }
    export function formidable(options?: { multiples?: boolean }): Formidable;
}