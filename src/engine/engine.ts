import { logging } from '@angular-devkit/core';
import exec from './utils/exec-async';

import { Schema } from '../deploy/schema';
import { defaults } from './defaults';

export async function run(
  dir: string,
  options: Schema,
  logger: logging.LoggerApi
) {
  try {
    options = exports.prepareOptions(options, logger);

    const commandToPublish = `npm publish ${dir} ${exports.getOptionsString(
      options
    )}`;
    const { stdout, stderr } = await exec(commandToPublish);

    logger.info(stdout);
    logger.info(stderr);

    if (options.dryRun) {
      await logger.info('The options are:');
      await logger.info(JSON.stringify(options, null, 1));
    }

    await logger.info(
      '🚀 Successfully published via ngx-deploy-npm! Have a nice day!'
    );
  } catch (error) {
    logger.error('❌ An error occurred!');
    throw error;
  }
}

export function prepareOptions(origOptions: Schema, logger: logging.LoggerApi) {
  const options = {
    ...defaults,
    ...origOptions
  };

  if (options.dryRun) {
    logger.info('Dry-run: No changes are applied at all.');
  }

  return options;
}

export function getOptionsString(options: Schema) {
  return (
    Object.keys(options)
      // Get only options with value
      .filter(optKey => !!options[optKey])
      // to CMD option
      .map(optKey => ({
        cmdOptions: `--${toKebabCase(optKey)}`,
        value: options[optKey]
      }))
      // to string
      .map(
        cmdOptionValue => `${cmdOptionValue.cmdOptions} ${cmdOptionValue.value}`
      )
      .join(' ')
  );

  function toKebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}
