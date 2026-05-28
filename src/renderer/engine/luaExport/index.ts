import { CCProject } from '../../models/Project';
import { COMPONENTS_LIST, generateAllInOneFile, generateFunctionsFile, generateLogicFile, generateScreenFile, generateStartupFile, generateVarsFile, getComponentLua } from './templates';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { minifyLua, sanitize } from '../../utils/luaHelpers';

export type ExportModes = 'full' | 'uiOnly' | 'codeOnly';

export interface ExportOptions {
  mode: ExportModes;
  minify: boolean;
  allinone: boolean;
}

export interface ExportFile {
  path: string;
  content: string;
}

export function exportProject(project: CCProject, options: ExportOptions, excludedFiles?: string[]): ExportFile[] {
  const files: ExportFile[] = [];
  const blocklyStore = useBlocklyStore.getState();

  if (options.allinone === true) {
    return [{ path: 'startup.lua', content: generateAllInOneFile(project, options.mode, blocklyStore, excludedFiles) }];
  } else {
    if (options.mode !== 'codeOnly' && !excludedFiles?.includes(`components/...`)) {
      for (const component of COMPONENTS_LIST) {
        files.push({ path: `components/${component}.lua`, content: getComponentLua(project.name, project.author, component) });
      }
    }

    if (!excludedFiles?.includes('utils/vars.lua')) {
      files.push({ path: 'utils/vars.lua', content: generateVarsFile(project) });
    }
    if (!excludedFiles?.includes('utils/functions.lua')) {
      files.push({ path: 'utils/functions.lua', content: generateFunctionsFile(project.name, project.author, options.mode) });
    }

    if (options.mode !== 'codeOnly') {
      for (const screen of project.screens) {
        const safeName = sanitize(screen.name);
        if (!excludedFiles?.includes(`screens/${safeName}.lua`)) {
          files.push({
            path: `screens/${safeName}.lua`,
            content: generateScreenFile(project, screen.name, screen.uiElements),
          });
        }
      }
    }

    if (options.mode !== 'uiOnly') {
      for (const screen of project.screens) {
        const code = blocklyStore.getLuaCode(screen.id);
        if (code.trim()) {
          const safeName = sanitize(screen.name);
          if (!excludedFiles?.includes(`logic/${safeName}.lua`)) {
            files.push({ path: `logic/${safeName}.lua`, content: generateLogicFile(project, screen.name, code) });
          }
        }
      }
    }

    files.push({ path: 'startup.lua', content: generateStartupFile(project, options.mode) });
  }

  if (options.minify) {
    return files.map(f => ({ ...f, content: minifyLua(f.content) }));
  }
  
  return files;
}
