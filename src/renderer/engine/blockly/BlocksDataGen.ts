import { Blocks } from "./blocksRegistery";

const blocksModules = import.meta.glob("./blocks/**/*.ts", { eager: true });

export const blocksData = Object.keys(blocksModules).map(key => {
    const cleanKey = key.replace('./blocks/', '').replace('.ts', '');
    const [category, type] = cleanKey.split('/');
    return {
        category,
        type,
        blocks: Object.values(blocksModules[key] as any)[0] as Blocks
    };
});