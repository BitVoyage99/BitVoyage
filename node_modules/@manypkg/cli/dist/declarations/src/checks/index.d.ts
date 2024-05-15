export declare let checks: {
    EXTERNAL_MISMATCH: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "EXTERNAL_MISMATCH";
            workspace: import("@manypkg/tools").Package;
            dependencyName: string;
            dependencyRange: string;
            mostCommonDependencyRange: string;
        }[];
        fix: (error: {
            type: "EXTERNAL_MISMATCH";
            workspace: import("@manypkg/tools").Package;
            dependencyName: string;
            dependencyRange: string;
            mostCommonDependencyRange: string;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "EXTERNAL_MISMATCH";
            workspace: import("@manypkg/tools").Package;
            dependencyName: string;
            dependencyRange: string;
            mostCommonDependencyRange: string;
        }, options: import("./utils").Options) => string;
    };
    INTERNAL_MISMATCH: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => import("./INTERNAL_MISMATCH").ErrorType[];
        fix: (error: import("./INTERNAL_MISMATCH").ErrorType, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: import("./INTERNAL_MISMATCH").ErrorType, options: import("./utils").Options) => string;
    };
    INVALID_DEV_AND_PEER_DEPENDENCY_RELATIONSHIP: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "INVALID_DEV_AND_PEER_DEPENDENCY_RELATIONSHIP";
            workspace: import("@manypkg/tools").Package;
            peerVersion: string;
            dependencyName: string;
            devVersion: string | null;
            idealDevVersion: string;
        }[];
        fix: (error: {
            type: "INVALID_DEV_AND_PEER_DEPENDENCY_RELATIONSHIP";
            workspace: import("@manypkg/tools").Package;
            peerVersion: string;
            dependencyName: string;
            devVersion: string | null;
            idealDevVersion: string;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "INVALID_DEV_AND_PEER_DEPENDENCY_RELATIONSHIP";
            workspace: import("@manypkg/tools").Package;
            peerVersion: string;
            dependencyName: string;
            devVersion: string | null;
            idealDevVersion: string;
        }, options: import("./utils").Options) => string;
    };
    INVALID_PACKAGE_NAME: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "INVALID_PACKAGE_NAME";
            workspace: import("@manypkg/tools").Package;
            errors: string[];
        }[];
        fix?: ((error: {
            type: "INVALID_PACKAGE_NAME";
            workspace: import("@manypkg/tools").Package;
            errors: string[];
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        }) | undefined;
        print: (error: {
            type: "INVALID_PACKAGE_NAME";
            workspace: import("@manypkg/tools").Package;
            errors: string[];
        }, options: import("./utils").Options) => string;
    };
    MULTIPLE_DEPENDENCY_TYPES: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "MULTIPLE_DEPENDENCY_TYPES";
            workspace: import("@manypkg/tools").Package;
            dependencyType: "devDependencies" | "optionalDependencies";
            dependencyName: string;
        }[];
        fix: (error: {
            type: "MULTIPLE_DEPENDENCY_TYPES";
            workspace: import("@manypkg/tools").Package;
            dependencyType: "devDependencies" | "optionalDependencies";
            dependencyName: string;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "MULTIPLE_DEPENDENCY_TYPES";
            workspace: import("@manypkg/tools").Package;
            dependencyType: "devDependencies" | "optionalDependencies";
            dependencyName: string;
        }, options: import("./utils").Options) => string;
    };
    ROOT_HAS_DEV_DEPENDENCIES: {
        type: "root";
        validate: (rootPackage: import("@manypkg/tools").Package, allPackages: Map<string, import("@manypkg/tools").Package>, options: import("./utils").Options) => {
            type: "ROOT_HAS_DEV_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }[];
        fix: (error: {
            type: "ROOT_HAS_DEV_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "ROOT_HAS_DEV_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }, options: import("./utils").Options) => string;
    };
    UNSORTED_DEPENDENCIES: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "UNSORTED_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }[];
        fix: (error: {
            type: "UNSORTED_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "UNSORTED_DEPENDENCIES";
            workspace: import("@manypkg/tools").Package;
        }, options: import("./utils").Options) => string;
    };
    INCORRECT_REPOSITORY_FIELD: {
        type: "all";
        validate: (workspace: import("@manypkg/tools").Package, allWorkspaces: Map<string, import("@manypkg/tools").Package>, rootWorkspace: import("@manypkg/tools").Package | undefined, options: import("./utils").Options) => {
            type: "INCORRECT_REPOSITORY_FIELD";
            workspace: import("@manypkg/tools").Package;
            currentRepositoryField: string | undefined;
            correctRepositoryField: string;
        }[];
        fix: (error: {
            type: "INCORRECT_REPOSITORY_FIELD";
            workspace: import("@manypkg/tools").Package;
            currentRepositoryField: string | undefined;
            correctRepositoryField: string;
        }, options: import("./utils").Options) => void | {
            requiresInstall: boolean;
        };
        print: (error: {
            type: "INCORRECT_REPOSITORY_FIELD";
            workspace: import("@manypkg/tools").Package;
            currentRepositoryField: string | undefined;
            correctRepositoryField: string;
        }, options: import("./utils").Options) => string;
    };
};
