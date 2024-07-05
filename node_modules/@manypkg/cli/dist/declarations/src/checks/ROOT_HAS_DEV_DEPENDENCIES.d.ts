import { Package } from "@manypkg/get-packages";
type ErrorType = {
    type: "ROOT_HAS_DEV_DEPENDENCIES";
    workspace: Package;
};
declare const _default: {
    type: "root";
    validate: (rootPackage: Package, allPackages: Map<string, Package>, options: import("./utils").Options) => ErrorType[];
    fix: (error: ErrorType, options: import("./utils").Options) => void | {
        requiresInstall: boolean;
    };
    print: (error: ErrorType, options: import("./utils").Options) => string;
};
export default _default;
