import { container } from 'tsyringe';

import PluginRegistryService from './pluginRegistryService';
import ReporterService from './reporterService';
import ScriptedEventService from './scriptedEventService';
import SubtitleEventService from './subtitleEventService';

export const pluginRegistryService = container.resolve(PluginRegistryService);
export const reporterService = container.resolve(ReporterService);
export const scriptedEventService = container.resolve(ScriptedEventService);
export const subtitleEventService = container.resolve(SubtitleEventService);
