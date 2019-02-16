import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sys } from '@sys';


export async function optimizeModule(_config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, input: string) {
  const opts: any = {
    output: {},
    compress: {}
  };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.compress.module = false;

  } else {
    opts.ecma = 7;
    opts.module = true;
    opts.output.ecma = 7;
    opts.compress.ecma = 7;
    opts.compress.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
  }
  opts.compress.pure_getters = true;
  opts.compress.keep_fargs = false;
  opts.compress.passes = 3;

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyModule', COMPILER_BUILD.id, opts, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: [] as d.Diagnostic[]
      };
    }
  }

  const results = await sys.minifyJs(input, opts);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}
