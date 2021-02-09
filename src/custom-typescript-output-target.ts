import { OutputTargetCustom } from '@stencil/core/internal';
import * as ts from 'typescript';

export type CompileCustomTsOptions = {
	tsconfigPath: string;
};
export function compileCustomTypescriptOutputTarget(
	config: CompileCustomTsOptions
): OutputTargetCustom {
	return {
		type: 'custom',
		name: 'compileCustomTs',
		validate: (_, diagnostics) => {
			const tsconfigJSON = ts.readConfigFile(
				config.tsconfigPath,
				ts.sys.readFile
			).config;
			const tsCompilerOptions = ts.parseJsonConfigFileContent(
				tsconfigJSON,
				ts.sys,
				'./'
			);

			let program = ts.createProgram(tsCompilerOptions.fileNames, {
				...tsCompilerOptions.options,
				noEmit: true,
			});

			let emitResult = program.emit();
			let allDiagnostics = ts
				.getPreEmitDiagnostics(program)
				.concat(emitResult.diagnostics);

			allDiagnostics.forEach((diagnostic) => {
				diagnostics.push({
					...diagnostic,
					level: getDiagnosticLevel(diagnostic.category),
					type: 'compileCustomTs',
					messageText: getDiagnosticMessageText(
						diagnostic.messageText
					),
					code: diagnostic.code.toString(),
				});
			});
		},
		async generator(_, __, buildCtx) {
			const timespan = buildCtx.createTimeSpan(
				`generate compileCustomTs started`,
				true
			);

			const tsconfigJSON = ts.readConfigFile(
				config.tsconfigPath,
				ts.sys.readFile
			).config;
			const tsCompilerOptions = ts.parseJsonConfigFileContent(
				tsconfigJSON,
				ts.sys,
				'./'
			);

			let program = ts.createProgram(
				tsCompilerOptions.fileNames,
				tsCompilerOptions.options
			);
			let emitResult = program.emit();

			if (emitResult.emitSkipped) {
				console.error('compileCustomTs: Failed to emit transpiled JS');
			}

			timespan.finish(`generate compileCustomTs finished`);
		},
	};
}

function getDiagnosticLevel(
	category: ts.DiagnosticCategory
): 'error' | 'warn' | 'info' | 'log' | 'debug' {
	switch (category) {
		case ts.DiagnosticCategory.Error:
			return 'error';
		case ts.DiagnosticCategory.Warning:
			return 'warn';
		case ts.DiagnosticCategory.Message:
			return 'info';
		case ts.DiagnosticCategory.Suggestion:
			return 'log';
	}
}

function getDiagnosticMessageText(
	text: string | ts.DiagnosticMessageChain
): string {
	if (typeof text === 'string') {
		return text;
	} else {
		return (text as ts.DiagnosticMessageChain)?.messageText;
	}
}
