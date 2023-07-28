var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// source/index.ts
import "reflect-metadata";
import { container as container4 } from "tsyringe";

// source/lib/common/index.ts
function random(minRange, maxRange) {
  let range = maxRange - minRange;
  if (typeof minRange === "undefined") {
    minRange = 0;
  }
  if (range <= 0) {
    range = maxRange;
    minRange = 0;
  }
  return Math.floor(Math.random() * range) + minRange;
}
__name(random, "random");

// source/services/radioService/radio/index.ts
var _Radio = class _Radio {
  constructor() {
    __publicField(this, "registry", {});
  }
  /**
  * Returns a random sequence of characters to the specified length
  */
  static tokenGenerator(length) {
    const token = [];
    for (let i = 0; i < length; i += 1) {
      let randomNumber;
      do {
        randomNumber = random(48, 122);
      } while (
        // avoid characters that are not 0-0, a-z, A-Z
        randomNumber > 57 && randomNumber < 65 || randomNumber > 90 && randomNumber < 97
      );
      token.push(String.fromCharCode(randomNumber));
    }
    return token.join("");
  }
  /**
  * Broadcast a message to all listeners on channel
  *
  * Executes listener handlers
  */
  broadcastOnChannel(channel, signal) {
    if (!this.registry[channel]) {
      console.warn(`Channel ${channel} has no listeners`);
      return;
    }
    Object.values(this.registry[channel]).forEach((listener) => listener(signal));
  }
  /**
  * Register a listener to a channel
  *
  * Returns a deregister function, which is used to deregister the listener from the radio registry
  */
  listenToChannel(channel, handler) {
    const listenerToken = _Radio.tokenGenerator(32);
    if (!this.registry[channel]) {
      this.registry[channel] = {};
    }
    this.registry[channel][listenerToken] = handler;
    return () => this.stopListening(listenerToken);
  }
  /**
  * Remove a listener from a channel, using the unique listener token
  */
  stopListening(listenerToken) {
    const channel = Object.keys(this.registry).filter((channel2) => {
      const tokens = Object.keys(this.registry[channel2]);
      return tokens.includes(listenerToken);
    })[0];
    if (!channel) {
      console.warn("Listener token not found");
      return;
    }
    delete this.registry[channel][listenerToken];
    if (!Object.keys(this.registry[channel]).length) {
      delete this.registry[channel];
    }
  }
};
__name(_Radio, "Radio");
var Radio = _Radio;
var radio = new Radio();

// source/services/radioService/channelTypes.ts
var RadioChannel;
(function(RadioChannel2) {
  RadioChannel2["DIRECTOR_PLAY"] = "director:play";
  RadioChannel2["DIRECTOR_PAUSE"] = "director:pause";
  RadioChannel2["DIRECTOR_SCENE_CHANGE"] = "director:scenechange";
  RadioChannel2["DIRECTOR_SCENE_EVENT"] = "director:sceneevent";
  RadioChannel2["VIDEO_ENDED"] = "video:ended";
  RadioChannel2["VIDEO_DURATION_CHANGED"] = "video:durationchange";
  RadioChannel2["VIDEO_PAUSED"] = "video:paused";
  RadioChannel2["VIDEO_PLAYING"] = "video:playing";
  RadioChannel2["VIDEO_SEEKED"] = "video:seeked";
  RadioChannel2["VIDEO_SEEKING"] = "video:seeking";
  RadioChannel2["VIDEO_TIMEUPDATE"] = "video:timeupdate";
  RadioChannel2["SUBTITLE_POST"] = "subtitle:post";
  RadioChannel2["SUBTITLE_CLEAR"] = "subtitle:clear";
})(RadioChannel || (RadioChannel = {}));

// source/services/radioService/listeners.ts
var listenToDirectorPause = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.DIRECTOR_PAUSE, handler), "listenToDirectorPause");
var listenToDirectorPlay = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.DIRECTOR_PLAY, handler), "listenToDirectorPlay");
var listenToDirectorSceneChange = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_CHANGE, handler), "listenToDirectorSceneChange");
var listenToDirectorSceneEvent = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_EVENT, handler), "listenToDirectorSceneEvent");
var listenToVideoDurationChanged = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.VIDEO_DURATION_CHANGED, handler), "listenToVideoDurationChanged");
var listenToVideoTimeUpdate = /* @__PURE__ */ __name((handler) => radio.listenToChannel(RadioChannel.VIDEO_TIMEUPDATE, handler), "listenToVideoTimeUpdate");

// source/services/pluginRegistryService/index.ts
import { singleton } from "tsyringe";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var _a;
var PluginRegistryServiceError = (_a = class extends Error {
}, __name(_a, "PluginRegistryServiceError"), _a);
var _a2;
var PluginRegistryService = (_a2 = class {
  constructor() {
    __publicField(this, "registry", {});
  }
  registerPlugin(plugin) {
    if (this.registry[plugin.name])
      throw new PluginRegistryServiceError(`Unable to register plugin: A plugin with the name "${plugin.name}" has already been registered`);
    this.registry[plugin.name] = plugin;
  }
  getPlugin(name) {
    if (!this.registry[name]) {
      return;
    }
    return this.registry[name];
  }
}, __name(_a2, "PluginRegistryService"), _a2);
PluginRegistryService = _ts_decorate([
  singleton()
], PluginRegistryService);

// source/services/reporterService/index.ts
import { singleton as singleton2 } from "tsyringe";

// source/services/reporterService/SceneReporter/index.ts
var _SceneReporter = class _SceneReporter {
  constructor() {
    __publicField(this, "currentScene");
    this.currentScene = "";
    this.registerListeners();
  }
  registerListeners() {
    listenToDirectorSceneChange((sceneId) => {
      this.currentScene = sceneId;
    });
  }
};
__name(_SceneReporter, "SceneReporter");
var SceneReporter = _SceneReporter;

// source/services/reporterService/VideoReporter/index.ts
var _VideoReporter = class _VideoReporter {
  constructor() {
    __publicField(this, "currentDuration", 0);
    __publicField(this, "currentTime", 0);
    this.registerListeners();
  }
  registerListeners() {
    listenToVideoDurationChanged((duration) => {
      this.currentDuration = duration;
    });
    listenToVideoTimeUpdate((time) => {
      this.currentTime = time;
    });
  }
};
__name(_VideoReporter, "VideoReporter");
var VideoReporter = _VideoReporter;

// source/services/reporterService/index.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var _a3;
var ReporterService = (_a3 = class {
  constructor(sceneReporter, videoReporter) {
    __publicField(this, "sceneReporter");
    __publicField(this, "videoReporter");
    this.sceneReporter = sceneReporter;
    this.videoReporter = videoReporter;
  }
  getCurrentTime() {
    return this.videoReporter.currentTime;
  }
  getCurrentDuration() {
    return this.videoReporter.currentDuration;
  }
  getCurrentScene() {
    return this.sceneReporter.currentScene;
  }
}, __name(_a3, "ReporterService"), _a3);
ReporterService = _ts_decorate2([
  singleton2(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof SceneReporter === "undefined" ? Object : SceneReporter,
    typeof VideoReporter === "undefined" ? Object : VideoReporter
  ])
], ReporterService);

// source/services/scriptedEventService/index.ts
import { mount } from "redom";
import { injectable } from "tsyringe";

// source/services/eventService/EventQueue/index.ts
var EventAction;
(function(EventAction2) {
  EventAction2["START"] = "start";
  EventAction2["STOP"] = "stop";
})(EventAction || (EventAction = {}));
var _EventQueue = class _EventQueue {
  constructor() {
    __publicField(this, "queueIndex", 0);
    __publicField(this, "queue", []);
  }
  static buildQueueFromScriptedEvents(events) {
    const queue = [];
    for (let i = 0; i < events.length; i += 1) {
      const timedObjectIn = {
        id: i,
        time: events[i].in,
        action: EventAction.START
      };
      const timedObjectOut = {
        id: i,
        time: events[i].out,
        action: EventAction.STOP
      };
      queue.push(timedObjectIn, timedObjectOut);
    }
    return queue;
  }
  reset() {
    this.queue = [];
    this.queueIndex = 0;
  }
  setQueue(timedObjects) {
    this.reset();
    this.queue = timedObjects;
    this.sort("asc");
  }
  getQueue() {
    return this.queue;
  }
  getCurrentTimedEventId() {
    return this.queue[this.queueIndex].id;
  }
  getPendingObject() {
    if (this.queueIndex > this.queue.length - 1) {
      return;
    }
    return this.queue[this.queueIndex];
  }
  advanceQueue() {
    this.queueIndex += 1;
  }
  sort(type) {
    switch (type) {
      case "desc":
        this.queue.sort((a, b) => b.time - a.time);
        break;
      case "asc":
      default:
        this.queue.sort((a, b) => a.time - b.time);
    }
  }
};
__name(_EventQueue, "EventQueue");
var EventQueue = _EventQueue;

// source/services/eventService/index.ts
import { container } from "tsyringe";
var _a4;
var EventServiceError = (_a4 = class extends Error {
}, __name(_a4, "EventServiceError"), _a4);
var _EventService = class _EventService {
  constructor(queue = container.resolve(EventQueue)) {
    __publicField(this, "queue");
    __publicField(this, "events");
    __publicField(this, "stopListeningToRadio");
    this.queue = queue;
    this.events = [];
    this.stopListeningToRadio = () => {
    };
  }
  getCurrentlyActionableEvent(seconds) {
    const pending = this.queue.getPendingObject();
    if (!pending) {
      return;
    }
    if (seconds >= pending.time) {
      const eventData = this.events[pending.id];
      if (!eventData) {
        throw new EventServiceError("Event data not found");
      }
      return {
        event: eventData,
        action: pending.action
      };
    }
  }
  actionEvent({ event, action }) {
    switch (action) {
      case EventAction.START:
        this.startEventCallback(event);
        break;
      case EventAction.STOP:
        this.stopEventCallback(event);
        break;
      default:
        return;
    }
    this.queue.advanceQueue();
  }
  setEvents(events) {
    this.events = events;
    this.queue.setQueue(EventQueue.buildQueueFromScriptedEvents(events));
    this.stopListeningToRadio = listenToVideoTimeUpdate((time) => {
      const actionableEvent = this.getCurrentlyActionableEvent(time);
      if (actionableEvent) {
        this.actionEvent(actionableEvent);
      }
    });
  }
  dispose() {
    this.queue.reset();
    this.stopListeningToRadio();
  }
};
__name(_EventService, "EventService");
var EventService = _EventService;

// source/services/radioService/broadcasters.ts
var broadcastDirectorPause = /* @__PURE__ */ __name(() => radio.broadcastOnChannel(RadioChannel.DIRECTOR_PAUSE), "broadcastDirectorPause");
var broadcastDirectorPlay = /* @__PURE__ */ __name(() => radio.broadcastOnChannel(RadioChannel.DIRECTOR_PLAY), "broadcastDirectorPlay");
var broadcastDirectorSceneChange = /* @__PURE__ */ __name((sceneId) => radio.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_CHANGE, sceneId), "broadcastDirectorSceneChange");
var broadcastDirectorSceneEvent = /* @__PURE__ */ __name((signal) => radio.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_EVENT, {
  action: signal.action,
  message: signal.payload
}), "broadcastDirectorSceneEvent");
var broadcastVideoEnded = /* @__PURE__ */ __name(() => radio.broadcastOnChannel(RadioChannel.VIDEO_ENDED), "broadcastVideoEnded");
var broadcastVideoDurationChanged = /* @__PURE__ */ __name((duration) => radio.broadcastOnChannel(RadioChannel.VIDEO_DURATION_CHANGED, duration), "broadcastVideoDurationChanged");
var broadcastVideoPaused = /* @__PURE__ */ __name(() => radio.broadcastOnChannel(RadioChannel.VIDEO_PAUSED), "broadcastVideoPaused");
var broadcastVideoPlaying = /* @__PURE__ */ __name((currentTime) => radio.broadcastOnChannel(RadioChannel.VIDEO_PLAYING, currentTime), "broadcastVideoPlaying");
var broadcastVideoSeeked = /* @__PURE__ */ __name((currentTime) => radio.broadcastOnChannel(RadioChannel.VIDEO_SEEKED, currentTime), "broadcastVideoSeeked");
var broadcastVideoSeeking = /* @__PURE__ */ __name((currentTime) => radio.broadcastOnChannel(RadioChannel.VIDEO_SEEKING, currentTime), "broadcastVideoSeeking");
var broadcastVideoTimeUpdate = /* @__PURE__ */ __name((currentTime) => radio.broadcastOnChannel(RadioChannel.VIDEO_TIMEUPDATE, currentTime), "broadcastVideoTimeUpdate");
var broadcastSubtitlePost = /* @__PURE__ */ __name((subtitle) => radio.broadcastOnChannel(RadioChannel.SUBTITLE_POST, subtitle), "broadcastSubtitlePost");
var broadcastSubtitleClear = /* @__PURE__ */ __name(() => radio.broadcastOnChannel(RadioChannel.SUBTITLE_CLEAR), "broadcastSubtitleClear");

// source/services/scriptedEventService/index.ts
function _ts_decorate3(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate3, "_ts_decorate");
function _ts_metadata2(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata2, "_ts_metadata");
var _a5;
var ScriptedEventService = (_a5 = class extends EventService {
  constructor(pluginRegistryService) {
    super();
    __publicField(this, "pluginRegistryService");
    this.pluginRegistryService = pluginRegistryService;
  }
  startEventCallback({ pluginName, payload }) {
    var _a14, _b, _c;
    if (pluginName) {
      const plugin = this.pluginRegistryService.getPlugin(pluginName);
      if (!plugin) {
        console.warn(`Plugin "${pluginName}" not registered`);
        return;
      }
      if (((_a14 = plugin.mount) == null ? void 0 : _a14.el) && ((_b = plugin == null ? void 0 : plugin.mount) == null ? void 0 : _b.parentEl) && !plugin.mount.persist) {
        mount(plugin.mount.parentEl, plugin.mount.el);
      }
      if ((_c = plugin.hooks) == null ? void 0 : _c.run) {
        plugin.hooks.run(payload);
      }
    }
    broadcastDirectorSceneEvent({
      action: EventAction.START,
      payload
    });
  }
  stopEventCallback({ pluginName, payload }) {
    var _a14;
    if (pluginName) {
      const plugin = this.pluginRegistryService.getPlugin(pluginName);
      if (!plugin) {
        console.warn(`Plugin "${pluginName}" not registered`);
        return;
      }
      if (plugin && !((_a14 = plugin.mount) == null ? void 0 : _a14.persist)) {
        plugin == null ? void 0 : plugin.unmount();
      }
    }
    broadcastDirectorSceneEvent({
      action: EventAction.STOP,
      payload
    });
  }
}, __name(_a5, "ScriptedEventService"), _a5);
ScriptedEventService = _ts_decorate3([
  injectable(),
  _ts_metadata2("design:type", Function),
  _ts_metadata2("design:paramtypes", [
    typeof PluginRegistryService === "undefined" ? Object : PluginRegistryService
  ])
], ScriptedEventService);

// source/Services.ts
import { singleton as singleton4 } from "tsyringe";

// source/components/Plugin/index.ts
import { mount as redomMount, unmount } from "redom";
var _a6;
var PluginError = (_a6 = class extends Error {
}, __name(_a6, "PluginError"), _a6);
var _Plugin = class _Plugin {
  constructor({ name, hooks, mount: mount4 }) {
    __publicField(this, "name");
    __publicField(this, "mount");
    __publicField(this, "hooks");
    this.name = name;
    this.hooks = {
      run: hooks == null ? void 0 : hooks.run,
      cleanup: hooks == null ? void 0 : hooks.cleanup
    };
    if (mount4) {
      if (!mount4.el || !mount4.parentEl) {
        throw new PluginError("Unable to register plugin, no suitable mount point");
      }
      this.mount = mount4;
      if (mount4.onLoad) {
        redomMount(this.mount.parentEl, this.mount.el);
      }
    }
  }
  unmount() {
    var _a14;
    if ((_a14 = this.hooks) == null ? void 0 : _a14.cleanup) {
      this.hooks.cleanup();
    }
    if (this.mount) {
      unmount(this.mount.parentEl, this.mount.el);
    }
  }
};
__name(_Plugin, "Plugin");
var Plugin = _Plugin;

// source/Loomse.ts
import { el as el4, mount as mount3, unmount as unmount4 } from "redom";
import { container as container3, singleton as singleton3 } from "tsyringe";

// source/components/Story/index.ts
var _Story = class _Story {
  constructor({ firstScene, scenes, author, shortName, longName, description, language }) {
    __publicField(this, "firstScene");
    __publicField(this, "scenes");
    __publicField(this, "author");
    __publicField(this, "shortName");
    __publicField(this, "longName");
    __publicField(this, "description");
    __publicField(this, "language");
    this.firstScene = firstScene;
    this.scenes = scenes;
    this.shortName = shortName;
    this.longName = longName;
    this.author = author;
    this.description = description;
    this.language = language;
  }
};
__name(_Story, "Story");
var Story = _Story;

// source/components/Scene/index.ts
import { el as el3, unmount as unmount3 } from "redom";
import { container as container2 } from "tsyringe";

// source/services/subtitleEventService/index.ts
import { injectable as injectable2 } from "tsyringe";
function _ts_decorate4(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate4, "_ts_decorate");
function _ts_metadata3(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata3, "_ts_metadata");
var _a7;
var SubtitleEventService = (_a7 = class extends EventService {
  constructor() {
    super();
  }
  startEventCallback({ payload }) {
    if (payload) {
      broadcastSubtitlePost(payload);
    }
  }
  stopEventCallback() {
    broadcastSubtitleClear();
  }
}, __name(_a7, "SubtitleEventService"), _a7);
SubtitleEventService = _ts_decorate4([
  injectable2(),
  _ts_metadata3("design:type", Function),
  _ts_metadata3("design:paramtypes", [])
], SubtitleEventService);

// source/components/Video/index.ts
import { el as el2, mount as mount2, unmount as unmount2 } from "redom";

// source/components/Subtitles/index.ts
import { extractFormatFromFileName, parser } from "simple-subtitle-parser";

// source/lib/browser/fetch.ts
function getTextFile(filePath) {
  return __async(this, null, function* () {
    const response = yield fetch(filePath);
    return response.text();
  });
}
__name(getTextFile, "getTextFile");

// source/components/Subtitles/index.ts
var _a8;
var SubtitlesError = (_a8 = class extends Error {
}, __name(_a8, "SubtitlesError"), _a8);
var _Subtitles = class _Subtitles {
  constructor(filePath) {
    __publicField(this, "cues", null);
    __publicField(this, "filePath");
    __publicField(this, "fileContents", "");
    __publicField(this, "format");
    this.filePath = filePath;
    this.format = extractFormatFromFileName(filePath).format;
    this.getTextFile().catch((error) => {
      throw new SubtitlesError(`Unable to read subtitle file ${filePath}, ${error.message}`);
    });
  }
  static mapCueToScriptedEvent(cue) {
    return cue.map((cue2) => ({
      in: cue2.startTime.totals.inSeconds,
      out: cue2.endTime.totals.inSeconds,
      payload: cue2.text
    }));
  }
  getTextFile() {
    return __async(this, null, function* () {
      this.fileContents = yield getTextFile(this.filePath);
    });
  }
  parseFileContents() {
    return __async(this, null, function* () {
      try {
        this.cues = yield parser(this.format, this.fileContents);
        return _Subtitles.mapCueToScriptedEvent(this.cues);
      } catch (error) {
        throw new SubtitlesError(`Unable to parse subtitles file, ${error.message}`);
      }
    });
  }
};
__name(_Subtitles, "Subtitles");
var Subtitles = _Subtitles;

// source/components/Video/Source.ts
import { el } from "redom";

// source/types/VideoSourceTypes.ts
var VideoFileExtension;
(function(VideoFileExtension2) {
  VideoFileExtension2["MP4"] = "mp4";
  VideoFileExtension2["OGG"] = "ogg";
  VideoFileExtension2["WEBM"] = "webm";
})(VideoFileExtension || (VideoFileExtension = {}));
var VideoMIME_Type;
(function(VideoMIME_Type2) {
  VideoMIME_Type2["MP4"] = "video/mp4";
  VideoMIME_Type2["OGG"] = "video/ogg";
  VideoMIME_Type2["WEBM"] = "video/webm";
})(VideoMIME_Type || (VideoMIME_Type = {}));

// source/components/Video/Source.ts
var _a9;
var SourceError = (_a9 = class extends Error {
}, __name(_a9, "SourceError"), _a9);
var _Source = class _Source {
  constructor(fileExtension, uri) {
    __publicField(this, "el");
    const videoMIME_Type = _Source.mapFileExtensionToMIME_Type(fileExtension);
    if (!_Source.canPlayMimeType(videoMIME_Type)) {
      throw new SourceError(`Video format ${videoMIME_Type} not supported by browser`);
    }
    this.el = el("source", {
      src: uri,
      type: videoMIME_Type
    });
  }
  static canPlayMimeType(videoMIME_Type) {
    const videoElement = document.createElement("video");
    return Boolean(videoElement.canPlayType(videoMIME_Type));
  }
  static mapFileExtensionToMIME_Type(fileExtension) {
    switch (fileExtension) {
      case VideoFileExtension.MP4:
        return VideoMIME_Type.MP4;
      case VideoFileExtension.OGG:
        return VideoMIME_Type.OGG;
      case VideoFileExtension.WEBM:
        return VideoMIME_Type.WEBM;
      default:
        throw new SourceError("Unable to process source in Video file");
    }
  }
};
__name(_Source, "Source");
var Source = _Source;

// source/components/Video/index.ts
var _a10;
var VideoError = (_a10 = class extends Error {
}, __name(_a10, "VideoError"), _a10);
var _Video = class _Video {
  constructor(subtitleEventService, { controls = false, loop = false, muted = false, sources, subtitles }) {
    __publicField(this, "subtitleEventService");
    __publicField(this, "el");
    __publicField(this, "broadcastEndedEvent");
    __publicField(this, "broadcastDurationChangeEvent");
    __publicField(this, "broadcastPlayingEvent");
    __publicField(this, "broadcastPausedEvent");
    __publicField(this, "broadcastSeekedEvent");
    __publicField(this, "broadcastSeekingEvent");
    __publicField(this, "broadcastTimeUpdateEvent");
    __publicField(this, "stopListeningToVideoPause");
    __publicField(this, "stopListeningToVideoPlay");
    __publicField(this, "sources");
    this.subtitleEventService = subtitleEventService;
    this.el = el2("video", {
      autoplay: false,
      controls,
      loop,
      muted
    });
    this.el.className = "loomse__video";
    this.sources = this.setSources(sources);
    this.mountSources();
    this.broadcastEndedEvent = () => broadcastVideoEnded();
    this.broadcastDurationChangeEvent = () => broadcastVideoDurationChanged(this.el.duration);
    this.broadcastPlayingEvent = () => broadcastVideoPlaying(this.el.currentTime);
    this.broadcastPausedEvent = () => broadcastVideoPaused();
    this.broadcastSeekedEvent = () => broadcastVideoSeeked(this.el.currentTime);
    this.broadcastSeekingEvent = () => broadcastVideoSeeking(this.el.currentTime);
    this.broadcastTimeUpdateEvent = () => broadcastVideoTimeUpdate(this.el.currentTime);
    this.stopListeningToVideoPause = listenToDirectorPause(() => this.pause());
    this.stopListeningToVideoPlay = listenToDirectorPlay(() => this.play());
    this.listenToVideoEvents();
    if (subtitles) {
      this.setSubtitles(subtitles).catch((error) => {
        console.warn(`Unable to setup subtitles, ${error}`);
      });
    }
  }
  setSubtitles(subtitlesFilePath) {
    return __async(this, null, function* () {
      const subtitles = new Subtitles(subtitlesFilePath);
      const cues = yield subtitles.parseFileContents();
      this.subtitleEventService.setEvents(cues);
    });
  }
  setSources(sources) {
    if (!sources) {
      throw new VideoError("No video sources found");
    }
    const generatedSources = {};
    for (const key in sources) {
      if (!sources.hasOwnProperty(key)) {
        continue;
      }
      try {
        generatedSources[key] = new Source(key, sources[key]);
      } catch (error) {
        console.warn(`${error}, skipping...`);
      }
    }
    return generatedSources;
  }
  manageSources(callback) {
    for (const key in this.sources) {
      if (!this.sources.hasOwnProperty(key)) {
        continue;
      }
      const source = this.sources[key];
      callback(source);
    }
  }
  mountSources() {
    this.manageSources((source) => mount2(this.el, source.el));
  }
  unmountSources() {
    this.manageSources((source) => unmount2(this.el, source.el));
  }
  listenToVideoEvents() {
    this.el.addEventListener("ended", this.broadcastEndedEvent);
    this.el.addEventListener("durationchange", this.broadcastDurationChangeEvent);
    this.el.addEventListener("paused", this.broadcastPausedEvent);
    this.el.addEventListener("playing", this.broadcastPlayingEvent);
    this.el.addEventListener("seeked", this.broadcastSeekedEvent);
    this.el.addEventListener("seeking", this.broadcastSeekingEvent);
    this.el.addEventListener("timeupdate", this.broadcastTimeUpdateEvent);
  }
  stopListeningToVideoEvents() {
    this.el.removeEventListener("ended", this.broadcastEndedEvent);
    this.el.removeEventListener("durationchange", this.broadcastDurationChangeEvent);
    this.el.removeEventListener("paused", this.broadcastPausedEvent);
    this.el.removeEventListener("playing", this.broadcastPlayingEvent);
    this.el.removeEventListener("seeked", this.broadcastSeekedEvent);
    this.el.removeEventListener("seeking", this.broadcastSeekingEvent);
    this.el.removeEventListener("timeupdate", this.broadcastTimeUpdateEvent);
  }
  stopListeningToRadio() {
    this.stopListeningToVideoPause();
    this.stopListeningToVideoPlay();
  }
  play() {
    this.el.play().catch((error) => {
      console.warn(error);
    });
  }
  pause() {
    this.el.pause();
  }
  playPause() {
    if (this.el.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  onunmount() {
    this.subtitleEventService.dispose();
    this.stopListeningToVideoEvents();
    this.stopListeningToRadio();
    this.unmountSources();
  }
};
__name(_Video, "Video");
var Video = _Video;

// source/components/Scene/index.ts
var _Scene = class _Scene {
  constructor(scriptedEventService, sceneName, { events, longName, video }) {
    __publicField(this, "scriptedEventService");
    __publicField(this, "el");
    __publicField(this, "sceneName");
    __publicField(this, "video");
    __publicField(this, "longName");
    this.scriptedEventService = scriptedEventService;
    broadcastDirectorSceneChange(sceneName);
    this.el = el3("div.loomse__scene", this.video = new Video(container2.resolve(SubtitleEventService), video));
    this.sceneName = sceneName;
    this.longName = longName;
    this.scriptedEventService.setEvents(events);
    this.video.play();
  }
  cleanup() {
    this.scriptedEventService.dispose();
    unmount3(this.el, this.video.el);
  }
};
__name(_Scene, "Scene");
var Scene = _Scene;

// source/Loomse.ts
function _ts_decorate5(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate5, "_ts_decorate");
function _ts_metadata4(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata4, "_ts_metadata");
var _a11;
var LoomseError = (_a11 = class extends Error {
}, __name(_a11, "LoomseError"), _a11);
var _a12;
var Loomse = (_a12 = class {
  constructor(root, json) {
    __publicField(this, "el");
    __publicField(this, "scene", null);
    __publicField(this, "story", null);
    this.el = el4("div.loomse__root");
    mount3(root, this.el);
    try {
      this.setStory(json);
      this.loadScene(json.firstScene);
    } catch (error) {
      throw new LoomseError(`Unable to load story object, ${error}`);
    }
  }
  setStory(storyObject) {
    this.story = new Story(storyObject);
  }
  unloadExistingScene() {
    if (this.scene) {
      this.scene.cleanup();
      unmount4(this.el, this.scene);
    }
  }
  loadScene(sceneName) {
    if (!this.story) {
      throw new LoomseError("No story loaded");
    }
    const newScene = this.story.scenes[sceneName];
    if (!newScene) {
      throw new LoomseError(`Scene "${sceneName}" does not exist in script`);
    }
    this.scene = new Scene(container3.resolve(ScriptedEventService), sceneName, newScene);
    mount3(this.el, this.scene);
  }
  pause() {
    broadcastDirectorPause();
  }
  play() {
    broadcastDirectorPlay();
  }
  reloadScene() {
    var _a14, _b;
    this.unloadExistingScene();
    if ((_a14 = this.scene) == null ? void 0 : _a14.sceneName) {
      this.loadScene((_b = this.scene) == null ? void 0 : _b.sceneName);
    }
  }
  changeScene(sceneName) {
    this.unloadExistingScene();
    this.loadScene(sceneName);
  }
}, __name(_a12, "Loomse"), _a12);
Loomse = _ts_decorate5([
  singleton3(),
  _ts_metadata4("design:type", Function),
  _ts_metadata4("design:paramtypes", [
    typeof HTMLElement === "undefined" ? Object : HTMLElement,
    Object
  ])
], Loomse);

// source/Services.ts
function _ts_decorate6(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate6, "_ts_decorate");
function _ts_metadata5(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata5, "_ts_metadata");
var _a13;
var Services = (_a13 = class extends Loomse {
  constructor(pluginRegistryService, reporterService, scriptedEventService, root, json) {
    super(root, json);
    __publicField(this, "pluginRegistryService");
    __publicField(this, "reporterService");
    __publicField(this, "scriptedEventService");
    this.pluginRegistryService = pluginRegistryService;
    this.reporterService = reporterService;
    this.scriptedEventService = scriptedEventService;
  }
  currentDuration() {
    return this.reporterService.getCurrentDuration();
  }
  currentTime() {
    return this.reporterService.getCurrentTime();
  }
  currentScene() {
    return this.reporterService.getCurrentScene();
  }
  currentEvents() {
    return this.scriptedEventService.events;
  }
  registerPlugin(pluginProps) {
    const plugin = new Plugin(pluginProps);
    this.pluginRegistryService.registerPlugin(plugin);
    console.log(`Loomse: Plugin "${pluginProps.name}" registered`);
  }
}, __name(_a13, "Services"), _a13);
Services = _ts_decorate6([
  singleton4(),
  _ts_metadata5("design:type", Function),
  _ts_metadata5("design:paramtypes", [
    typeof PluginRegistryService === "undefined" ? Object : PluginRegistryService,
    typeof ReporterService === "undefined" ? Object : ReporterService,
    typeof ScriptedEventService === "undefined" ? Object : ScriptedEventService,
    typeof HTMLElement === "undefined" ? Object : HTMLElement,
    Object
  ])
], Services);

// source/index.ts
function createStory(root, json) {
  return new Services(container4.resolve(PluginRegistryService), container4.resolve(ReporterService), container4.resolve(ScriptedEventService), root, json);
}
__name(createStory, "createStory");
export {
  createStory,
  listenToDirectorPause,
  listenToDirectorPlay,
  listenToDirectorSceneChange,
  listenToDirectorSceneEvent,
  listenToVideoDurationChanged,
  listenToVideoTimeUpdate
};
