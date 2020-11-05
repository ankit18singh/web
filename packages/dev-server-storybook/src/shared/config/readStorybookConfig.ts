import path from 'path';
import fs from 'fs';

import { StorybookPluginConfig } from './StorybookPluginConfig';
import { createError } from '../utils';
import { MainJs, StorybookConfig } from './StorybookConfig';

const defaultConfigDir = path.join(process.cwd(), '.storybook');

function validateMainJs(mainJs: MainJs): MainJs {
  if (typeof mainJs !== 'object') {
    throw createError('main.js must export an bject');
  }
  if (mainJs.stories == null) {
    throw createError('Missing stories option in main.js');
  }
  if (!Array.isArray(mainJs.stories)) {
    throw createError('Stories option main.js must be an array');
  }
  if (mainJs.addons != null && !Array.isArray(mainJs.addons)) {
    throw createError('Addons in main.js must be an array');
  }
  return mainJs;
}

export function readStorybookConfig(pluginConfig: StorybookPluginConfig): StorybookConfig {
  const configDir = pluginConfig.configDir
    ? path.resolve(pluginConfig.configDir)
    : defaultConfigDir;
  const mainJsPath = path.join(configDir, 'main.js');
  const previewJsPath = path.join(configDir, 'preview.js');
  const managerHeadPath = path.join(configDir, 'manager-head.html');
  const previewHeadPath = path.join(configDir, 'preview-head.html');
  const previewBodyPath = path.join(configDir, 'preview-body.html');
  let managerHead: string | undefined = undefined;
  let previewHead: string | undefined = undefined;
  let previewBody: string | undefined = undefined;

  if (!fs.existsSync(mainJsPath)) {
    throw createError(
      `Could not find any storybook configuration at ${mainJsPath}. You can change the storybook config directory using the configDir option.`,
    );
  }

  if (fs.existsSync(managerHeadPath)) {
    managerHead = fs.readFileSync(managerHeadPath, 'utf-8');
  }
  if (fs.existsSync(previewHeadPath)) {
    previewHead = fs.readFileSync(previewHeadPath, 'utf-8');
  }
  if (fs.existsSync(previewBodyPath)) {
    previewBody = fs.readFileSync(previewBodyPath, 'utf-8');
  }

  const mainJs = validateMainJs(require(mainJsPath));

  return { mainJs, mainJsPath, previewJsPath, managerHead, previewHead, previewBody };
}
