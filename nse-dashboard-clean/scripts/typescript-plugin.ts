import ts from 'typescript';
import type { Plugin } from 'vite';

export default function typescriptPlugin(): Plugin {
  return {
    name: 'standalone-typescript',
    enforce: 'pre',
    transform(source, id) {
      if (id.includes('node_modules') || !/\.[jt]sx?$/.test(id)) return;
      const result = ts.transpileModule(source, { fileName: id, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, sourceMap: true } });
      return { code: result.outputText, map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null };
    },
  };
}
