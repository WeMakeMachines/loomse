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

// source/Loomse.ts
import { el as el4, mount as mount2, unmount as unmount4 } from "redom";

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
import { el as el3, unmount as unmount2 } from "redom";

// source/components/Video/index.ts
import { el as el2, mount, unmount } from "redom";

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
var _a;
var SourceError = (_a = class extends Error {
}, __name(_a, "SourceError"), _a);
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

// source/services/index.ts
import { container as container3 } from "tsyringe";

// source/services/pluginRegistryService/index.ts
var _a2;
var PluginRegistryServiceError = (_a2 = class extends Error {
}, __name(_a2, "PluginRegistryServiceError"), _a2);
var _PluginRegistryService = class _PluginRegistryService {
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
};
__name(_PluginRegistryService, "PluginRegistryService");
var PluginRegistryService = _PluginRegistryService;

// source/services/reporterService/index.ts
import { injectable, singleton } from "tsyringe";

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
ReporterService = _ts_decorate([
  injectable(),
  singleton(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof SceneReporter === "undefined" ? Object : SceneReporter,
    typeof VideoReporter === "undefined" ? Object : VideoReporter
  ])
], ReporterService);

// source/services/scriptedEventService/index.ts
import { container, singleton as singleton2 } from "tsyringe";

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
  setQueue(timedObjects) {
    this.queueIndex = 0;
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
var _a4;
var EventServiceError = (_a4 = class extends Error {
}, __name(_a4, "EventServiceError"), _a4);
var _EventService = class _EventService {
  constructor(queue) {
    __publicField(this, "queue");
    __publicField(this, "stopListeningToRadio");
    __publicField(this, "events");
    this.queue = queue;
    this.stopListeningToRadio = () => {
    };
    this.events = [];
  }
  setEvents(events) {
    this.events = events;
    this.queue.setQueue(EventQueue.buildQueueFromScriptedEvents(events));
    this.stopListeningToRadio = listenToVideoTimeUpdate((time) => this.isReadyToAction(time));
  }
  isReadyToAction(time) {
    if (!time) {
      return;
    }
    const milliseconds = time;
    const pending = this.queue.getPendingObject();
    if (!milliseconds || !pending) {
      return;
    }
    if (milliseconds >= pending.time) {
      this.parseAction(pending);
    }
  }
  parseAction(event) {
    const eventId = this.queue.getCurrentTimedEventId();
    const eventData = this.events[eventId];
    if (!eventData) {
      throw new EventServiceError("Event data not found");
    }
    switch (event.action) {
      case EventAction.START:
        this.startEventCallback(eventData);
        break;
      case EventAction.STOP:
        this.stopEventCallback(eventData);
        break;
      default:
        return;
    }
    this.queue.advanceQueue();
  }
};
__name(_EventService, "EventService");
var EventService = _EventService;

// source/services/scriptedEventService/index.ts
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
function _ts_metadata2(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata2, "_ts_metadata");
var _a5;
var ScriptedEventService = (_a5 = class extends EventService {
  constructor() {
    super(container.resolve(EventQueue));
  }
  setEvents(events) {
    super.setEvents(events);
  }
  startEventCallback({ pluginName, payload }) {
    var _a12;
    if (pluginName) {
      const plugin = pluginRegistryService.getPlugin(pluginName);
      if (!plugin) {
        console.warn(`Plugin "${pluginName}" not registered`);
      }
      if ((_a12 = plugin == null ? void 0 : plugin.hooks) == null ? void 0 : _a12.run) {
        plugin.hooks.run(payload);
      }
    }
    broadcastDirectorSceneEvent({
      action: EventAction.START,
      payload
    });
  }
  stopEventCallback({ pluginName, payload }) {
    var _a12;
    if (pluginName) {
      const plugin = pluginRegistryService.getPlugin(pluginName);
      if (plugin && !((_a12 = plugin.mount) == null ? void 0 : _a12.persist)) {
        plugin == null ? void 0 : plugin.unmount();
      }
    }
    broadcastDirectorSceneEvent({
      action: EventAction.STOP,
      payload
    });
  }
}, __name(_a5, "ScriptedEventService"), _a5);
ScriptedEventService = _ts_decorate2([
  singleton2(),
  _ts_metadata2("design:type", Function),
  _ts_metadata2("design:paramtypes", [])
], ScriptedEventService);

// source/services/subtitleEventService/index.ts
import { container as container2, singleton as singleton3 } from "tsyringe";
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
function _ts_metadata3(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata3, "_ts_metadata");
var _a6;
var SubtitleEventService = (_a6 = class extends EventService {
  constructor() {
    super(container2.resolve(EventQueue));
  }
  setEvents(events) {
    super.setEvents(events);
  }
  startEventCallback({ payload }) {
    broadcastSubtitlePost(payload);
  }
  stopEventCallback() {
    broadcastSubtitleClear();
  }
}, __name(_a6, "SubtitleEventService"), _a6);
SubtitleEventService = _ts_decorate3([
  singleton3(),
  _ts_metadata3("design:type", Function),
  _ts_metadata3("design:paramtypes", [])
], SubtitleEventService);

// source/services/index.ts
var pluginRegistryService = new PluginRegistryService();
var reporterService = container3.resolve(ReporterService);
var scriptedEventService = container3.resolve(ScriptedEventService);
var subtitleEventService = container3.resolve(SubtitleEventService);

// source/components/Subtitles/index.ts
var _a7;
var SubtitlesError = (_a7 = class extends Error {
}, __name(_a7, "SubtitlesError"), _a7);
var _Subtitles = class _Subtitles {
  constructor(filePath) {
    __publicField(this, "cues", null);
    __publicField(this, "filePath");
    __publicField(this, "fileContents", null);
    __publicField(this, "format");
    this.filePath = filePath;
    this.format = extractFormatFromFileName(filePath).format;
    this.parseTextFile(filePath).catch((error) => {
      throw new SubtitlesError(`Unable to parse subtitles file, ${error.message}`);
    });
  }
  static mapCueToScriptedEvent(cue) {
    return cue.map((cue2) => ({
      in: cue2.startTime,
      out: cue2.endTime,
      payload: cue2.text
    }));
  }
  parseTextFile(filePath) {
    return __async(this, null, function* () {
      this.fileContents = yield getTextFile(filePath);
      this.cues = yield parser(this.format, this.fileContents);
      subtitleEventService.setEvents(_Subtitles.mapCueToScriptedEvent(this.cues));
    });
  }
};
__name(_Subtitles, "Subtitles");
var Subtitles = _Subtitles;

// source/components/Video/index.ts
var _a8;
var VideoError = (_a8 = class extends Error {
}, __name(_a8, "VideoError"), _a8);
var _Video = class _Video {
  constructor({ controls = false, loop = false, muted = false, sources, subtitles }) {
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
    this.el = el2("video", {
      autoplay: false,
      controls,
      loop,
      muted
    });
    this.el.className = "loomse__video";
    this.sources = this.setSources(sources);
    this.mountSources();
    if (subtitles) {
      new Subtitles(subtitles);
    }
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
  }
  onunmount() {
    this.stopListeningToVideoEvents();
    this.stopListeningToRadio();
    this.unmountSources();
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
    this.manageSources((source) => mount(this.el, source.el));
  }
  unmountSources() {
    this.manageSources((source) => unmount(this.el, source.el));
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
};
__name(_Video, "Video");
var Video = _Video;

// source/components/Scene/index.ts
var _Scene = class _Scene {
  constructor(sceneName, { events, longName, video }) {
    __publicField(this, "el");
    __publicField(this, "sceneName");
    __publicField(this, "video");
    __publicField(this, "longName");
    broadcastDirectorSceneChange(sceneName);
    this.el = el3("div.loomse__scene", this.video = new Video(video));
    this.sceneName = sceneName;
    this.longName = longName;
    scriptedEventService.setEvents(events);
    this.video.play();
  }
  onunmount() {
    scriptedEventService.stopListeningToRadio();
    unmount2(this.el, this.video.el);
  }
};
__name(_Scene, "Scene");
var Scene = _Scene;

// source/components/Plugin/index.ts
import { mount as redomMount, unmount as unmount3 } from "redom";
var _a9;
var PluginError = (_a9 = class extends Error {
}, __name(_a9, "PluginError"), _a9);
var _Plugin = class _Plugin {
  constructor({ name, hooks, mount: mount3 }) {
    __publicField(this, "name");
    __publicField(this, "mount");
    __publicField(this, "hooks");
    this.name = name;
    this.hooks = {
      run: hooks == null ? void 0 : hooks.run,
      cleanup: hooks == null ? void 0 : hooks.cleanup
    };
    if (mount3) {
      if (!mount3.el || !mount3.parentEl) {
        throw new PluginError("Unable to register plugin, no suitable mount point");
      }
      this.mount = mount3;
      if (mount3.onLoad) {
        redomMount(this.mount.parentEl, this.mount.el);
      }
    }
  }
  static registerPlugin(pluginProps) {
    const plugin = new _Plugin(pluginProps);
    pluginRegistryService.registerPlugin(plugin);
    console.log(`Loomse: Plugin "${pluginProps.name}" registered`);
    return;
  }
  unmount() {
    var _a12;
    if ((_a12 = this.hooks) == null ? void 0 : _a12.cleanup) {
      this.hooks.cleanup();
    }
    if (this.mount) {
      unmount3(this.mount.parentEl, this.mount.el);
    }
  }
};
__name(_Plugin, "Plugin");
var Plugin = _Plugin;

// source/version.ts
var VERSION = "1.0.0";

// source/Loomse.ts
import { inject, injectable as injectable2, singleton as singleton4 } from "tsyringe";
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
function _ts_metadata4(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
}
__name(_ts_metadata4, "_ts_metadata");
function _ts_param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param, "_ts_param");
var _a10;
var LoomseError = (_a10 = class extends Error {
}, __name(_a10, "LoomseError"), _a10);
var _a11;
var Loomse = (_a11 = class {
  constructor(root, json) {
    __publicField(this, "el");
    __publicField(this, "version", VERSION);
    __publicField(this, "scene", null);
    __publicField(this, "story", null);
    this.el = el4("div.loomse__root");
    mount2(root, this.el);
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
  loadScene(sceneName) {
    if (!this.story)
      return;
    if (!sceneName || !this.story.scenes[sceneName]) {
      throw new LoomseError(`Scene "${sceneName}" does not exist in script`);
    }
    if (this.scene) {
      unmount4(this.el, this.scene);
    }
    this.scene = new Scene(sceneName, this.story.scenes[sceneName]);
    mount2(this.el, this.scene);
  }
  currentDuration() {
    return reporterService.getCurrentDuration();
  }
  currentTime() {
    return reporterService.getCurrentTime();
  }
  currentScene() {
    return reporterService.getCurrentScene();
  }
  currentEvents() {
    return scriptedEventService.events;
  }
  pause() {
    broadcastDirectorPause();
  }
  play() {
    broadcastDirectorPlay();
  }
  registerPlugin(pluginProps) {
    Plugin.registerPlugin(pluginProps);
  }
  reloadScene() {
    var _a12, _b;
    if ((_a12 = this.scene) == null ? void 0 : _a12.sceneName) {
      this.loadScene((_b = this.scene) == null ? void 0 : _b.sceneName);
    }
  }
  skipTo(sceneName) {
    this.loadScene(sceneName);
  }
}, __name(_a11, "Loomse"), _a11);
Loomse = _ts_decorate4([
  injectable2(),
  singleton4(),
  _ts_param(0, inject("root")),
  _ts_param(1, inject("json")),
  _ts_metadata4("design:type", Function),
  _ts_metadata4("design:paramtypes", [
    typeof HTMLElement === "undefined" ? Object : HTMLElement,
    Object
  ])
], Loomse);

// source/index.ts
function createStory(root, json) {
  container4.register("root", {
    useValue: root
  });
  container4.register("json", {
    useValue: json
  });
  return container4.resolve(Loomse);
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
//# sourceMappingURL=loomse.cjs.mjs.map