# stencil-custom-typescript-output-target

![version](https://img.shields.io/npm/v/stencil-custom-typescript-output-target) 
![license](https://img.shields.io/npm/l/stencil-custom-typescript-output-target) 
![build](https://img.shields.io/github/workflow/status/elwynelwyn/stencil-custom-typescript-output-target/build)

StencilJS output target for compiling custom TypeScript in addition to your components.

I had a situation where I wanted to compile some TypeScript, outside of the main Stencil component compile (some custom code I wanted incluided in my package).

This custom output target will make Stencil compile this code when it builds:

```typescript
// stencil.config.ts
import { Config } from '@stencil/core';
import { compileCustomTypescriptOutputTarget } from 'stencil-custom-typescript-output-target';

export const config: Config = {
    // ... rest of your config
    outputTargets: [
        // ... your other output targets
        compileCustomTypescriptOutputTarget({
            tsconfigPath: 'custom.tsconfig.json',
        }),
    ],
};
```

## Config

`CompileCustomTsOptions`: config object:

`tsconfigPath`: path to the tsconfig.json file to use. This should `include` or specify `files`. It should probably `exclude` your other Stencil code, so you're not building things twice / pulling in things you didn't mean to.

`skipValidate`: optional bool to skip the validate stage of the output target. This will mean any TS compiler errors will be allowed through without any issue.