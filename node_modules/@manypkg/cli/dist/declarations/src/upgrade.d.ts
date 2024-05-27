import getPackageJson from "package-json";
export declare function upgradeDependency([name, tag]: string[]): Promise<void>;
export declare function getPackageInfo(pkgName: string): Promise<getPackageJson.AbbreviatedMetadata>;
