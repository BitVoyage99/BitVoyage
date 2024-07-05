import { Package } from "@manypkg/get-packages";
export declare const NORMAL_DEPENDENCY_TYPES: readonly ["dependencies", "devDependencies", "optionalDependencies"];
export declare const DEPENDENCY_TYPES: readonly ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
export type Options = {
    defaultBranch?: string;
    ignoredRules?: string[];
};
type RootCheck<ErrorType> = {
    type: "root";
    validate: (rootPackage: Package, allPackages: Map<string, Package>, options: Options) => ErrorType[];
    fix?: (error: ErrorType, options: Options) => void | {
        requiresInstall: boolean;
    };
    print: (error: ErrorType, options: Options) => string;
};
type RootCheckWithFix<ErrorType> = {
    type: "root";
    validate: (rootPackage: Package, allPackages: Map<string, Package>, options: Options) => ErrorType[];
    fix: (error: ErrorType, options: Options) => void | {
        requiresInstall: boolean;
    };
    print: (error: ErrorType, options: Options) => string;
};
type AllCheck<ErrorType> = {
    type: "all";
    validate: (workspace: Package, allWorkspaces: Map<string, Package>, rootWorkspace: Package | undefined, options: Options) => ErrorType[];
    fix?: (error: ErrorType, options: Options) => void | {
        requiresInstall: boolean;
    };
    print: (error: ErrorType, options: Options) => string;
};
type AllCheckWithFix<ErrorType> = {
    type: "all";
    validate: (workspace: Package, allWorkspaces: Map<string, Package>, rootWorkspace: Package | undefined, options: Options) => ErrorType[];
    fix: (error: ErrorType, options: Options) => void | {
        requiresInstall: boolean;
    };
    print: (error: ErrorType, options: Options) => string;
};
export type Check<ErrorType> = RootCheck<ErrorType> | AllCheck<ErrorType> | RootCheckWithFix<ErrorType> | AllCheckWithFix<ErrorType>;
export declare function sortObject(prevObj: {
    [key: string]: string;
}): {
    [key: string]: string;
};
export declare function sortDeps(pkg: Package): void;
export declare let getMostCommonRangeMap: (arg: Map<string, Package>) => Map<string, string>;
export declare function versionRangeToRangeType(versionRange: string): "" | "^" | "~";
export declare function isArrayEqual(arrA: Array<string>, arrB: Array<string>): boolean;
declare function makeCheck<ErrorType>(check: RootCheckWithFix<ErrorType>): RootCheckWithFix<ErrorType>;
declare function makeCheck<ErrorType>(check: AllCheckWithFix<ErrorType>): AllCheckWithFix<ErrorType>;
declare function makeCheck<ErrorType>(check: RootCheck<ErrorType>): RootCheck<ErrorType>;
declare function makeCheck<ErrorType>(check: AllCheck<ErrorType>): AllCheck<ErrorType>;
export { makeCheck };
