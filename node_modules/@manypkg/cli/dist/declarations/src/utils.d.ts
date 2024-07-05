import { Package } from "@manypkg/get-packages";
export declare function writePackage(pkg: Package): Promise<void>;
export declare function install(toolType: string, cwd: string): Promise<void>;
