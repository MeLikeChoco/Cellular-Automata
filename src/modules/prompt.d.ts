declare module "electron-prompt" {

    import "electron-prompt";
    import { BrowserWindow } from "electron";

    function electronPrompt(options?: {
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
        resizable?: boolean;
        title?: string;
        label?: string;
        alwaysOnTop?: boolean;
        value?: string;
        type?: "input" | "select";
        selectOptions?: { [value: string]: string };
        icon?: string;
        useHtmlLabel?: boolean;
        customStylesheet?: string;
        menuBarVisible?: boolean;
        skipTaskbar?: boolean;
        buttonLabels?: {
            ok?: string;
            cancel?: string;
        };
        inputAttrs?: { [key: string]: string };
    }, parentWindow?: BrowserWindow): Promise<string>;

    export = electronPrompt;

}