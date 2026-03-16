import { CCProject } from '../../models/Project';
import { COMPONENTS_LIST, generateFunctionsFile, generateHandlersFile, generateLogicFile, generateScreenFile, generateStartupFile, generateVarsFile, getComponentLua } from './templates';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { minifyLua, sanitize } from '../../utils/luaHelpers';

export interface ExportOptions {
  mode: 'full' | 'uiOnly';
  minify: boolean;
}

export interface ExportFile {
  path: string;
  content: string;
}

export function exportProject(project: CCProject, options: ExportOptions): ExportFile[] {
  const startScreen = project.screens.find(s => s.isStartScreen) ?? project.screens[0];
  if (!startScreen) return [];

  const files: ExportFile[] = [];
  const blocklyStore = useBlocklyStore.getState();

  for (const component of COMPONENTS_LIST) {
    files.push({ path: `components/${component}.lua`, content: getComponentLua(project.name, project.author, component) });
  }

  files.push({ path: 'utils/vars.lua', content: generateVarsFile(project) });
  if (options.mode === 'full') {
    files.push({ path: 'utils/functions.lua', content: generateFunctionsFile(project.name, project.author) });
    files.push({ path: 'utils/handlers.lua', content: generateHandlersFile(project) });
  }

  for (const screen of project.screens) {
    const safeName = sanitize(screen.name);
    files.push({
      path: `screens/${safeName}.lua`,
      content: generateScreenFile(project, screen.name, screen.uiElements),
    });
  }

  if (options.mode === 'full') {
    for (const screen of project.screens) {
      const code = blocklyStore.getLuaCode(screen.id);
      if (code.trim()) {
        const safeName = sanitize(screen.name);
        files.push({ path: `logic/${safeName}.lua`, content: generateLogicFile(project, screen.name, code) });
      }
    }
  }

  files.push({ path: 'startup.lua', content: generateStartupFile(project, options.mode !== 'full') });

  if (options.minify) {
    return files.map(f => ({ ...f, content: minifyLua(f.content) }));
  }
  return files;
}
