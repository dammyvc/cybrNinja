import { IncomingMessage } from "http";

declare module "formidable" {
    
    export interface Formidable {
        parse: (
            req: IncomingMessage, 
            callback: (err: Error | null, fields: Fields, files: Files) => void
        ) => void;
    }

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

    
    export function formidable(options?: { multiples?: boolean }): Formidable;
    export default function formidable(options?: { multiples?: boolean }): Formidable;
}