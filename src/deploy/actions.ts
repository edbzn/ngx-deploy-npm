import { BuilderContext, Target } from '@angular-devkit/architect';
import { logging } from '@angular-devkit/core';

import { Schema } from './schema';

export default async function deploy(
  engine: {
    run: (
      dir: string,
      options: Schema,
      logger: logging.LoggerApi
    ) => Promise<void>;
  },
  context: BuilderContext,
  projectRoot: string,
  options: Schema
) {
  if (options.noBuild) {
    context.logger.info(`📦 Skipping build`);
  } else {
    if (!context.target) {
      throw new Error('Cannot execute the build target');
    }

    const configuration = options.configuration
      ? options.configuration
      : undefined;

    context.logger.info(
      `📦 Building "${context.target.project}". ${
        configuration ? `Configuration "${configuration}"` : ''
      }`
    );

    const target = {
      target: 'build',
      project: context.target.project
    } as Target;

    // Set the configuration if set on the options
    if (configuration) {
      target.configuration = configuration;
    }

    const build = await context.scheduleTarget(target);
    await build.result;
  }

  await engine.run(
    projectRoot,
    options,
    (context.logger as unknown) as logging.LoggerApi
  );
}
