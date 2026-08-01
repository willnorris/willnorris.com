import { n as normalizeHexColor, a as toErrorPayload, P as PrefixedLogger, p as parseNpt } from './logging-Bg1womcE.js';

class Clock {
  constructor(speed = 1.0) {
    this.speed = speed;
    this.startTime = performance.now();
  }
  getTime() {
    return this.speed * (performance.now() - this.startTime);
  }
  setTime(time) {
    this.startTime = performance.now() - time / this.speed;
  }
}
class NullClock {
  constructor() {}
  getTime(_speed) {}
  setTime(_time) {}
}

// Efficient array transformations without intermediate array objects.
// Inspired by Elixir's streams and Rust's iterator adapters.

class Stream {
  constructor(input, xfs) {
    this.input = typeof input.next === "function" ? input : input[Symbol.iterator]();
    this.xfs = xfs ?? [];
  }
  map(f) {
    return this.transform(Map$1(f));
  }
  flatMap(f) {
    return this.transform(FlatMap(f));
  }
  filter(f) {
    return this.transform(Filter(f));
  }
  take(n) {
    return this.transform(Take(n));
  }
  drop(n) {
    return this.transform(Drop(n));
  }
  transform(f) {
    return new Stream(this.input, this.xfs.concat([f]));
  }
  multiplex(other, comparator) {
    return new Stream(new Multiplexer(this[Symbol.iterator](), other[Symbol.iterator](), comparator));
  }
  toArray() {
    return Array.from(this);
  }
  [Symbol.iterator]() {
    let v = 0;
    let values = [];
    let flushed = false;
    const xf = compose(this.xfs, val => values.push(val));
    return {
      next: () => {
        if (v === values.length) {
          values = [];
          v = 0;
        }
        while (values.length === 0) {
          const next = this.input.next();
          if (next.done) {
            break;
          } else {
            xf.step(next.value);
          }
        }
        if (values.length === 0 && !flushed) {
          xf.flush();
          flushed = true;
        }
        if (values.length > 0) {
          return {
            done: false,
            value: values[v++]
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  }
}
function Map$1(f) {
  return emit => {
    return input => {
      emit(f(input));
    };
  };
}
function FlatMap(f) {
  return emit => {
    return input => {
      f(input).forEach(emit);
    };
  };
}
function Filter(f) {
  return emit => {
    return input => {
      if (f(input)) {
        emit(input);
      }
    };
  };
}
function Take(n) {
  let c = 0;
  return emit => {
    return input => {
      if (c < n) {
        emit(input);
      }
      c += 1;
    };
  };
}
function Drop(n) {
  let c = 0;
  return emit => {
    return input => {
      c += 1;
      if (c > n) {
        emit(input);
      }
    };
  };
}
function compose(xfs, push) {
  return xfs.reverse().reduce((next, curr) => {
    const xf = toXf(curr(next.step));
    return {
      step: xf.step,
      flush: () => {
        xf.flush();
        next.flush();
      }
    };
  }, toXf(push));
}
function toXf(xf) {
  if (typeof xf === "function") {
    return {
      step: xf,
      flush: () => {}
    };
  } else {
    return xf;
  }
}
class Multiplexer {
  constructor(left, right, comparator) {
    this.left = left;
    this.right = right;
    this.comparator = comparator;
  }
  [Symbol.iterator]() {
    let leftItem;
    let rightItem;
    return {
      next: () => {
        if (leftItem === undefined && this.left !== undefined) {
          const result = this.left.next();
          if (result.done) {
            this.left = undefined;
          } else {
            leftItem = result.value;
          }
        }
        if (rightItem === undefined && this.right !== undefined) {
          const result = this.right.next();
          if (result.done) {
            this.right = undefined;
          } else {
            rightItem = result.value;
          }
        }
        if (leftItem === undefined && rightItem === undefined) {
          return {
            done: true
          };
        } else if (leftItem === undefined) {
          const value = rightItem;
          rightItem = undefined;
          return {
            done: false,
            value: value
          };
        } else if (rightItem === undefined) {
          const value = leftItem;
          leftItem = undefined;
          return {
            done: false,
            value: value
          };
        } else if (this.comparator(leftItem, rightItem)) {
          const value = leftItem;
          leftItem = undefined;
          return {
            done: false,
            value: value
          };
        } else {
          const value = rightItem;
          rightItem = undefined;
          return {
            done: false,
            value: value
          };
        }
      }
    };
  }
}

async function loadFullRecording(src, options) {
  return wrapFullRecording(prepareRecording(await loadRecording(src), options));
}
async function loadRecording(src) {
  const {
    parser,
    encoding = "utf-8"
  } = src;
  const data = await doFetch(src);
  return await parser(data, {
    encoding
  });
}
function wrapFullRecording(recording) {
  const segment = {
    start: 0
  };
  const markers = recording.events.filter(event => event[1] === "m").map(event => [event[0], event[2].label]);
  return {
    cols: recording.cols,
    rows: recording.rows,
    theme: recording.theme,
    duration: recording.duration,
    effectiveStartAt: recording.effectiveStartAt,
    markers,
    segments: [segment],
    async loadSegment(index) {
      if (index !== 0) {
        throw new Error("unknown recording segment");
      }
      return {
        snapshot: {
          cols: recording.cols,
          rows: recording.rows,
          init: ""
        },
        events: recording.events
      };
    }
  };
}
async function doFetch({
  url,
  data,
  fetchOpts = {}
}) {
  if (typeof url === "string") {
    return await doFetchOne(url, fetchOpts);
  } else if (Array.isArray(url)) {
    return await Promise.all(url.map(url => doFetchOne(url, fetchOpts)));
  } else if (data !== undefined) {
    if (typeof data === "function") {
      data = data();
    }
    if (!(data instanceof Promise)) {
      data = Promise.resolve(data);
    }
    const value = await data;
    if (typeof value === "string" || value instanceof ArrayBuffer) {
      return new Response(value);
    } else {
      return value;
    }
  } else {
    throw new Error("failed fetching recording file: url/data missing in src");
  }
}
async function doFetchOne(url, fetchOpts) {
  const response = await fetch(url, fetchOpts);
  if (!response.ok) {
    throw new Error(`failed fetching recording from ${url}: ${response.status} ${response.statusText}`);
  }
  return response;
}
function prepareRecording(recording, {
  startAt = 0,
  idleTimeLimit,
  inputOffset,
  markers
}) {
  let {
    events
  } = recording;
  if (!(events instanceof Stream)) {
    events = new Stream(events);
  }
  startAt = startAt * 1000;
  idleTimeLimit = idleTimeLimit ?? recording.idleTimeLimit;
  idleTimeLimit = idleTimeLimit !== undefined ? idleTimeLimit * 1000 : Infinity;
  inputOffset = inputOffset !== undefined ? inputOffset * 1000 : undefined;
  const limiterOutput = {
    offset: 0
  };
  events = events.map(timeLimiter(idleTimeLimit, startAt, limiterOutput));
  if (markers !== undefined) {
    markers = new Stream(markers).map(normalizeMarker);
    events = events.filter(e => e[1] !== "m").multiplex(markers, (a, b) => a[0] < b[0]);
  }
  events = events.map(markerWrapper());
  events = events.toArray();
  if (inputOffset !== undefined) {
    events = events.map(e => e[1] === "i" ? [e[0] + inputOffset, e[1], e[2]] : e);
    events.sort((a, b) => a[0] - b[0]);
  }
  if (events.length === 0) {
    throw new Error("recording is missing events");
  }
  const duration = events[events.length - 1][0];
  const effectiveStartAt = startAt - limiterOutput.offset;
  return {
    ...recording,
    events,
    duration,
    effectiveStartAt
  };
}
function normalizeMarker(marker) {
  return typeof marker === "number" ? [marker * 1000, "m", ""] : [marker[0] * 1000, "m", marker[1]];
}
function timeLimiter(idleTimeLimit, startAt, output) {
  let previousTime = 0;
  let shift = 0;
  return function (event) {
    const delay = event[0] - previousTime;
    const delta = delay - idleTimeLimit;
    previousTime = event[0];
    if (delta > 0) {
      shift += delta;
      if (event[0] < startAt) {
        output.offset += delta;
      }
    }
    return [event[0] - shift, event[1], event[2]];
  };
}
function markerWrapper() {
  let index = 0;
  return function (event) {
    if (event[1] === "m") {
      return [event[0], event[1], {
        index: index++,
        time: event[0],
        label: event[2]
      }];
    } else {
      return event;
    }
  };
}

function normalizeTheme(theme) {
  const foreground = normalizeHexColor(theme.foreground);
  const background = normalizeHexColor(theme.background);
  const paletteInput = theme.palette;
  if (paletteInput === undefined) return;
  if (!foreground || !background || paletteInput.length < 8) return;
  const palette = [];
  const limit = Math.min(paletteInput.length, 16);
  for (let i = 0; i < limit; i += 1) {
    const color = normalizeHexColor(paletteInput[i]);
    if (!color) return;
    palette.push(color);
  }
  for (let i = palette.length; i < 16; i += 1) {
    palette.push(palette[i - 8]);
  }
  return {
    foreground,
    background,
    palette
  };
}

function loadSegmentedRecording(src, opts = {}) {
  validateOptions(src, opts);
  return doLoadSegmentedRecording(src, opts);
}
async function doLoadSegmentedRecording(src, {
  startAt = 0
}) {
  const response = await fetchResponse(src.url, src.fetchOpts ?? {});
  let index;
  try {
    index = await response.json();
  } catch (error) {
    throw new Error(`failed parsing segmented recording index from ${src.url}: ${error.message}`);
  }
  validateIndex(index);
  const duration = index.duration * 1000;
  const markers = (index.markers ?? []).map(([time, label]) => [time * 1000, label]);
  const segments = index.segments.map(segment => ({
    start: segment.start * 1000,
    url: resolveUrl(segment.url, response.url || src.url)
  }));
  const recording = {
    cols: index.term.cols,
    rows: index.term.rows,
    theme: parseTheme$2(index.term.theme),
    duration,
    effectiveStartAt: Math.min(Math.max(startAt * 1000, 0), duration),
    markers,
    segments,
    async loadSegment(segmentIndex) {
      if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= segments.length) {
        throw new Error("unknown recording segment");
      }
      const segment = segments[segmentIndex];
      const segmentResponse = await fetchResponse(segment.url, src.fetchOpts ?? {});
      let payload;
      try {
        payload = await segmentResponse.json();
      } catch (error) {
        throw new Error(`failed parsing recording segment from ${segment.url}: ${error.message}`);
      }
      return normalizeSegment(recording, segmentIndex, payload);
    }
  };
  return recording;
}
function validateOptions(src, {
  idleTimeLimit,
  markers
}) {
  if (typeof src.url !== "string") {
    throw new Error("segmented recording source requires a URL");
  }
  const unsupported = [];
  if (idleTimeLimit !== undefined) unsupported.push("idleTimeLimit");
  if (markers !== undefined) unsupported.push("markers");
  for (const option of ["inputOffset", "parser", "encoding"]) {
    if (Object.hasOwn(src, option)) unsupported.push(option);
  }
  if (unsupported.length > 0) {
    throw new Error(`segmented recordings do not support option: ${unsupported.join(", ")}`);
  }
}
function validateIndex(index) {
  if (index?.version !== 1) {
    throw new Error(`unsupported segmented recording version: ${JSON.stringify(index?.version)}`);
  }
  validateFiniteTime(index.duration, "recording duration");
  validateTerminalSize(index.term, "recording terminal");
  if (!Array.isArray(index.segments) || index.segments.length === 0) {
    throw new Error("segmented recording index is missing segments");
  }
  let previousStart = -1;
  index.segments.forEach((segment, i) => {
    validateFiniteTime(segment?.start, `segment ${i} start`);
    if (typeof segment?.url !== "string" || segment.url.length === 0) {
      throw new Error(`segment ${i} is missing its URL`);
    }
    if (i === 0 && segment.start !== 0) {
      throw new Error("first segment must start at 0");
    }
    if (i > 0 && (segment.start <= previousStart || segment.start >= index.duration)) {
      throw new Error(`segment ${i} start must be strictly increasing and before duration`);
    }
    previousStart = segment.start;
  });
  if (index.markers !== undefined && !Array.isArray(index.markers)) {
    throw new Error("segmented recording markers must be an array");
  }
  let previousMarkerTime = -1;
  for (const [i, marker] of (index.markers ?? []).entries()) {
    if (!Array.isArray(marker) || marker.length !== 2 || typeof marker[1] !== "string") {
      throw new Error(`invalid marker ${i} in segmented recording index`);
    }
    validateFiniteTime(marker[0], `marker ${i} time`);
    if (marker[0] < previousMarkerTime || marker[0] > index.duration) {
      throw new Error(`marker ${i} time is out of order or range`);
    }
    previousMarkerTime = marker[0];
  }
}
function normalizeSegment(recording, index, payload) {
  const snapshot = payload?.snapshot;
  validateTerminalSize(snapshot, `segment ${index} snapshot`);
  if (typeof snapshot.init !== "string") {
    throw new Error(`segment ${index} snapshot init must be a string`);
  }
  if (!Array.isArray(payload.events) || payload.events.length === 0) {
    throw new Error(`segment ${index} is missing events`);
  }
  const start = recording.segments[index].start;
  const end = recording.segments[index + 1]?.start ?? recording.duration;
  let previousTime = -1;
  let markerIndex = recording.markers.findIndex(([time]) => time >= start);
  if (markerIndex === -1) markerIndex = recording.markers.length;
  const events = payload.events.map((event, eventIndex) => {
    if (!Array.isArray(event) || event.length !== 3 || typeof event[1] !== "string") {
      throw new Error(`invalid event ${eventIndex} in segment ${index}`);
    }
    const time = event[0] * 1000;
    validateFiniteTime(time, `event ${eventIndex} time in segment ${index}`, true);
    if (time < previousTime || time < start || (index + 1 < recording.segments.length ? time >= end : time > end)) {
      throw new Error(`event ${eventIndex} time is out of range in segment ${index}`);
    }
    previousTime = time;
    if (event[1] === "m") {
      if (typeof event[2] !== "string") {
        throw new Error(`marker event ${eventIndex} in segment ${index} must have a string label`);
      }
      return [time, "m", {
        index: markerIndex++,
        time,
        label: event[2]
      }];
    }
    return [time, event[1], event[2]];
  });
  if (index > 0 && events[0][0] !== start) {
    throw new Error(`segment ${index} first event must match its start`);
  }
  if (index === recording.segments.length - 1 && events[events.length - 1][0] !== recording.duration) {
    throw new Error("final segment event must match recording duration");
  }
  return {
    snapshot: {
      cols: snapshot.cols,
      rows: snapshot.rows,
      init: snapshot.init
    },
    events
  };
}
async function fetchResponse(url, fetchOpts) {
  const response = await fetch(url, fetchOpts);
  if (!response.ok) {
    throw new Error(`failed fetching recording from ${url}: ${response.status} ${response.statusText}`);
  }
  return response;
}
function validateFiniteTime(value, label, milliseconds = false) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative ${milliseconds ? "millisecond" : "second"} value`);
  }
}
function validateTerminalSize(term, label) {
  if (!Number.isInteger(term?.cols) || term.cols <= 0 || !Number.isInteger(term?.rows) || term.rows <= 0) {
    throw new Error(`${label} must have positive integer cols and rows`);
  }
}
function parseTheme$2(theme) {
  return normalizeTheme({
    foreground: theme?.fg,
    background: theme?.bg,
    palette: typeof theme?.palette === "string" ? theme.palette.split(":") : undefined
  });
}
function resolveUrl(url, indexUrl) {
  return new URL(url, new URL(indexUrl, globalThis.location?.href ?? "http://localhost/")).href;
}

function recording(src, {
  dispatch,
  logger
}, {
  speed,
  idleTimeLimit,
  startAt,
  preload,
  loop,
  poster,
  markers: markers_,
  pauseOnMarkers,
  cols: optionCols,
  rows: optionRows,
  audioUrl
}) {
  const STATE = {
    COLD: "cold",
    // Recording has not been loaded yet.
    LOADING: "loading",
    // Recording/audio load is in progress.
    READY_INITIAL: "ready.initial",
    // Loaded, not yet played or navigated.
    READY_PAUSED: "ready.paused",
    // Loaded and positioned while playback clock is stopped.
    READY_STARTING: "ready.starting",
    // Playback start/resume requested; waiting for clock readiness.
    READY_PLAYING: "ready.playing",
    // Playback clock is running and events are scheduled.
    READY_BUFFERING_WHILE_PAUSED: "ready.buffering.whilePaused",
    // Buffering while remaining paused.
    READY_BUFFERING_TO_RESUME: "ready.buffering.toResume",
    // Buffering before resuming playback.
    READY_ENDED: "ready.ended",
    // Playback or navigation reached recording duration.
    FAILED: "failed",
    // Fatal driver error; public commands reject.
    STOPPED: "stopped" // Terminal state after stop().
  };
  const EVENT = {
    INIT_REQUESTED: "initRequested",
    // Public init/preload command.
    PLAY_REQUESTED: "playRequested",
    // Public play command.
    DEFERRED_PLAY_READY: "deferredPlayReady",
    // Cold play() can continue after load.
    PAUSE_REQUESTED: "pauseRequested",
    // Public pause command.
    SEEK_REQUESTED: "seekRequested",
    // Public seek command.
    STEP_REQUESTED: "stepRequested",
    // Public frame-step command.
    STOP_REQUESTED: "stopRequested",
    // Public teardown command.
    LOAD_SUCCEEDED: "loadSucceeded",
    // Recording load completed.
    LOAD_FAILED: "loadFailed",
    // Recording load failed fatally.
    PLAYBACK_START_CONFIRMED: "playbackStartConfirmed",
    // Playback clock can start.
    PLAYBACK_START_REJECTED: "playbackStartRejected",
    // Audio/media play() rejected.
    PLAYBACK_ENDED: "playbackEnded",
    // Scheduled playback reached natural end.
    AUDIO_WAITING: "audioWaiting",
    // Audio element entered buffering.
    AUDIO_PLAYING: "audioPlaying",
    // Audio element resumed from buffering.
    SEGMENT_WAITING: "segmentWaiting",
    // Required segment is loading at a boundary.
    SEGMENT_READY: "segmentReady",
    // Required segment loaded and playback may continue.
    MARKER_REACHED: "markerReached" // Playback crossed a marker event.
  };
  const PLAYBACK_START_REASON = {
    PLAY: "play",
    SEEK: "seek"
  };
  const outputBatchWindow = (src.minFrameTime ?? 1 / 60) * 1000;
  let now = () => performance.now() * speed;
  let state = STATE.COLD;
  let queuedDriverEvents = [];
  let processingDriverEvents = false;
  const ctx = {
    recording: undefined,
    segmentIndex: undefined,
    segment: undefined,
    segmentCache: new Map(),
    positionGeneration: 0,
    markers: undefined,
    duration: undefined,
    effectiveStartAt: undefined,
    recordingEventTimeoutId: undefined,
    nextEventIndex: 0,
    lastEventTime: 0,
    startTime: undefined,
    pauseElapsedTime: undefined,
    playCount: 0,
    waitingTimeout: undefined,
    loadingTimeout: undefined,
    audioCtx: undefined,
    audioElement: undefined,
    audioSeekable: false,
    loaded: undefined,
    posterVisible: false,
    posterRenderableAfterLoad: poster !== undefined,
    failureError: null,
    segmentWaiting: false
  };
  function isBufferingState(value = state) {
    return value === STATE.READY_BUFFERING_WHILE_PAUSED || value === STATE.READY_BUFFERING_TO_RESUME;
  }
  function canLoopPlayback() {
    return loop === true || typeof loop === "number" && ctx.playCount < loop;
  }
  function loadPromise(initialTime) {
    if (ctx.loaded === undefined) {
      ctx.loaded = load(initialTime);
      void ctx.loaded.catch(() => {});
    }
    return ctx.loaded;
  }

  // Public command events (INIT_REQUESTED, PLAY_REQUESTED, PAUSE_REQUESTED,
  // SEEK_REQUESTED, STEP_REQUESTED, STOP_REQUESTED) are serialized by Core
  // and are considered re-entrancy safe.
  //
  // Primary non-stale state transitions:
  // COLD -> [INIT_REQUESTED] -> LOADING
  // COLD -> [PLAY_REQUESTED | SEEK_REQUESTED | STEP_REQUESTED] -> LOADING
  // LOADING -> [LOAD_SUCCEEDED] -> READY_INITIAL
  // LOADING -> [LOAD_FAILED] -> FAILED
  // READY_INITIAL -> [PLAY_REQUESTED | DEFERRED_PLAY_READY] -> READY_STARTING
  // READY_INITIAL -> [SEEK_REQUESTED | STEP_REQUESTED] -> READY_PAUSED
  // READY_PAUSED -> [PLAY_REQUESTED] -> READY_STARTING
  // READY_PAUSED -> [SEEK_REQUESTED | STEP_REQUESTED] -> READY_PAUSED
  // READY_ENDED -> [PLAY_REQUESTED] -> READY_STARTING
  // READY_ENDED -> [SEEK_REQUESTED | STEP_REQUESTED] -> READY_PAUSED
  // READY_STARTING -> [PLAYBACK_START_CONFIRMED] -> READY_PLAYING
  // READY_STARTING -> [PLAYBACK_START_REJECTED] -> READY_PAUSED
  // READY_PLAYING -> [PAUSE_REQUESTED] -> READY_PAUSED
  // READY_PLAYING -> [SEEK_REQUESTED] -> READY_STARTING
  // READY_PLAYING -> [AUDIO_WAITING] -> READY_BUFFERING_TO_RESUME
  // READY_PLAYING -> [MARKER_REACHED] -> READY_PAUSED (pauseOnMarkers)
  // READY_BUFFERING_TO_RESUME -> [PAUSE_REQUESTED] -> READY_BUFFERING_WHILE_PAUSED
  // READY_BUFFERING_TO_RESUME -> [AUDIO_PLAYING] -> READY_PLAYING
  // READY_BUFFERING_WHILE_PAUSED -> [PLAY_REQUESTED] -> READY_BUFFERING_TO_RESUME
  // READY_BUFFERING_WHILE_PAUSED -> [AUDIO_PLAYING] -> READY_PAUSED
  // READY_BUFFERING_TO_RESUME -> [PLAYBACK_START_REJECTED] -> READY_BUFFERING_WHILE_PAUSED
  // READY_PLAYING -> [PLAYBACK_ENDED] -> READY_ENDED | READY_PLAYING (loop)
  // COLD | READY_INITIAL | READY_PAUSED | READY_PLAYING
  //   | READY_BUFFERING_WHILE_PAUSED | READY_BUFFERING_TO_RESUME | READY_ENDED
  //   -> [STOP_REQUESTED] -> STOPPED
  function transition(currentState, event, payload = {}) {
    switch (event) {
      case EVENT.INIT_REQUESTED:
        if (currentState === STATE.COLD) {
          if (preload || poster?.type == "npt") {
            return {
              nextState: STATE.LOADING,
              action: () => loadPromise()
            };
          }
          if (poster?.type == "text") {
            return {
              nextState: currentState,
              action: () => renderTextPoster()
            };
          }
        }
        return {
          nextState: currentState
        };
      case EVENT.LOAD_SUCCEEDED:
        if (currentState !== STATE.LOADING) {
          return {
            nextState: currentState
          };
        }
        return {
          nextState: STATE.READY_INITIAL,
          action: () => {
            dispatch("metadata", {
              duration: ctx.duration / 1000,
              markers: ctx.markers.map(([t, label]) => [t / 1000, label]),
              hasAudio: payload.hasAudio
            });
            resetTerminalFromSnapshot(ctx.segment);
            renderPoster();
          }
        };
      case EVENT.LOAD_FAILED:
        if (currentState !== STATE.LOADING) {
          return {
            nextState: currentState
          };
        }
        return {
          nextState: STATE.FAILED,
          action: () => {
            ctx.failureError = payload.error;
            dispatch("error", toErrorPayload(payload.error));
          }
        };
      case EVENT.PLAY_REQUESTED:
        if (currentState === STATE.COLD) {
          return {
            nextState: STATE.LOADING,
            action: () => {
              clearPoster();
              dispatch("play");
              return loadPromise().then(() => sendDriverEvent(EVENT.DEFERRED_PLAY_READY));
            }
          };
        }
        if (currentState === STATE.READY_INITIAL || currentState === STATE.READY_PAUSED || currentState === STATE.READY_ENDED) {
          return {
            nextState: STATE.READY_STARTING,
            action: () => {
              dispatch("play");
              clearPoster();
              return startPlayback(PLAYBACK_START_REASON.PLAY);
            }
          };
        }
        if (currentState === STATE.READY_BUFFERING_WHILE_PAUSED) {
          return {
            nextState: STATE.READY_BUFFERING_TO_RESUME,
            action: () => {
              dispatch("play");
              if (ctx.segmentWaiting) return true;
              if (ctx.audioElement) {
                return ctx.audioElement.play().catch(error => {
                  sendDriverEvent(EVENT.PLAYBACK_START_REJECTED);
                  throw error;
                });
              }
              return true;
            }
          };
        }
        if (currentState === STATE.READY_BUFFERING_TO_RESUME || currentState === STATE.READY_PLAYING) {
          return {
            nextState: currentState,
            action: () => {
              dispatch("play");
              return true;
            }
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.DEFERRED_PLAY_READY:
        if (currentState === STATE.READY_INITIAL) {
          return {
            nextState: STATE.READY_STARTING,
            action: () => {
              clearPoster();
              return startPlayback(PLAYBACK_START_REASON.PLAY);
            }
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.PLAYBACK_START_CONFIRMED:
        if (currentState !== STATE.READY_STARTING) {
          return {
            nextState: currentState
          };
        }
        return {
          nextState: STATE.READY_PLAYING,
          action: () => {
            confirmPlaybackClockStart();
            if (payload.reason === PLAYBACK_START_REASON.SEEK) {
              dispatch("seeked");
            } else {
              dispatch("playing");
            }
            return true;
          }
        };
      case EVENT.PLAYBACK_START_REJECTED:
        if (currentState === STATE.READY_STARTING) {
          return {
            nextState: STATE.READY_PAUSED
          };
        }
        if (currentState === STATE.READY_BUFFERING_TO_RESUME) {
          return {
            nextState: STATE.READY_BUFFERING_WHILE_PAUSED
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.PLAYBACK_ENDED:
        if (currentState !== STATE.READY_PLAYING) {
          return {
            nextState: currentState
          };
        }
        if (canLoopPlayback()) {
          return {
            nextState: STATE.READY_PLAYING,
            action: restartLoop
          };
        }
        return {
          nextState: STATE.READY_ENDED,
          action: finishPlayback
        };
      case EVENT.AUDIO_WAITING:
        if (currentState === STATE.READY_PLAYING) {
          return {
            nextState: STATE.READY_BUFFERING_TO_RESUME,
            action: () => {
              logger.debug("pausing session playback");
              pausePlaybackClock();
              restartWaitingTimeout();
            }
          };
        }
        if (currentState === STATE.READY_BUFFERING_WHILE_PAUSED || currentState === STATE.READY_BUFFERING_TO_RESUME) {
          return {
            nextState: currentState,
            action: restartWaitingTimeout
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.AUDIO_PLAYING:
        if (ctx.segmentWaiting) {
          return {
            nextState: currentState
          };
        }
        if (currentState === STATE.READY_BUFFERING_TO_RESUME) {
          return {
            nextState: STATE.READY_PLAYING,
            action: () => {
              logger.debug("resuming session playback");
              clearWaitingTimeout();
              confirmPlaybackClockStart();
              dispatch("playing");
            }
          };
        }
        if (currentState === STATE.READY_BUFFERING_WHILE_PAUSED) {
          return {
            nextState: STATE.READY_PAUSED,
            action: () => {
              clearWaitingTimeout();
              // The media element may report recovery after the user has already paused.
              // Clear waiting bookkeeping, but do not announce resumed playback.
            }
          };
        }

        // Media events are delivered asynchronously and may arrive after the
        // driver has already moved on to another state, so treat them as stale.
        return {
          nextState: currentState
        };
      case EVENT.SEGMENT_WAITING:
        if (currentState === STATE.READY_PLAYING) {
          return {
            nextState: STATE.READY_BUFFERING_TO_RESUME,
            action: () => {
              ctx.segmentWaiting = true;
              pausePlaybackAt(payload.time);
              restartWaitingTimeout();
              if (ctx.audioElement) {
                ctx.audioElement.pause();
              }
            }
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.SEGMENT_READY:
        ctx.segmentWaiting = false;
        if (currentState === STATE.READY_BUFFERING_TO_RESUME) {
          return {
            nextState: currentState,
            action: resumeAfterSegmentWait
          };
        }
        if (currentState === STATE.READY_BUFFERING_WHILE_PAUSED) {
          return {
            nextState: STATE.READY_PAUSED,
            action: clearWaitingTimeout
          };
        }
        return {
          nextState: currentState
        };
      case EVENT.PAUSE_REQUESTED:
        if (currentState === STATE.READY_PLAYING) {
          return {
            nextState: STATE.READY_PAUSED,
            action: performPause
          };
        }
        if (currentState === STATE.READY_BUFFERING_TO_RESUME) {
          return {
            nextState: STATE.READY_BUFFERING_WHILE_PAUSED,
            action: () => {
              if (ctx.audioElement) {
                ctx.audioElement.pause();
              }
              return true;
            }
          };
        }
        return {
          nextState: currentState,
          action: () => true
        };
      case EVENT.SEEK_REQUESTED:
        {
          if (currentState === STATE.COLD) {
            return {
              nextState: STATE.LOADING,
              action: () => loadPromise(typeof payload.where === "number" ? payload.where * 1000 : undefined).then(() => seek(payload.where))
            };
          }
          if (isBufferingState(currentState) && !ctx.segmentWaiting) {
            return {
              nextState: currentState,
              action: () => false
            };
          }
          if (currentState !== STATE.READY_INITIAL && currentState !== STATE.READY_PAUSED && currentState !== STATE.READY_ENDED && currentState !== STATE.READY_PLAYING && currentState !== STATE.READY_BUFFERING_WHILE_PAUSED && currentState !== STATE.READY_BUFFERING_TO_RESUME) {
            return {
              nextState: currentState
            };
          }
          const seekOperation = payload.seekOperation;
          if (seekOperation.noOp) {
            return {
              nextState: currentState,
              action: () => false
            };
          }
          return {
            nextState: seekOperation.reachedEnd ? STATE.READY_ENDED : currentState === STATE.READY_PLAYING || currentState === STATE.READY_BUFFERING_TO_RESUME ? STATE.READY_STARTING : STATE.READY_PAUSED,
            action: () => {
              clearPoster();
              return performSeek(seekOperation, currentState);
            }
          };
        }
      case EVENT.STEP_REQUESTED:
        {
          if (currentState === STATE.COLD) {
            return {
              nextState: STATE.LOADING,
              action: () => loadPromise().then(() => sendCommand(EVENT.STEP_REQUESTED, payload))
            };
          }
          if (currentState === STATE.READY_PLAYING || isBufferingState(currentState)) {
            // Stepping is only defined for paused/idle states. During active
            // playback or buffering, step() is a no-op.
            return {
              nextState: currentState
            };
          }
          if (currentState !== STATE.READY_INITIAL && currentState !== STATE.READY_PAUSED && currentState !== STATE.READY_ENDED) {
            return {
              nextState: currentState
            };
          }
          return {
            nextState: currentState,
            action: () => performStep(payload.n)
          };
        }
      case EVENT.MARKER_REACHED:
        if (currentState !== STATE.READY_PLAYING) {
          return {
            nextState: currentState
          };
        }
        if (pauseOnMarkers) {
          return {
            nextState: STATE.READY_PAUSED,
            action: () => {
              dispatchMarker(payload.data);
              return performPause(payload.time);
            }
          };
        }
        return {
          nextState: currentState,
          action: () => dispatchMarker(payload.data)
        };
      case EVENT.STOP_REQUESTED:
        return {
          nextState: STATE.STOPPED,
          action: teardown
        };
      default:
        return {
          nextState: currentState
        };
    }
  }
  function enqueueDriverEvent(event, payload = {}) {
    queuedDriverEvents.push({
      event,
      payload
    });
  }
  function processDriverEvent(event, payload = {}) {
    const previousState = state;
    const {
      nextState,
      action
    } = transition(previousState, event, payload);
    if (nextState !== state) {
      state = nextState;
    }
    return action?.();
  }
  function failDriver(error) {
    if (ctx.failureError || state === STATE.STOPPED) return;
    queuedDriverEvents.length = 0;
    ctx.segmentWaiting = false;
    cancelPendingTimers();
    if (ctx.audioElement) {
      ctx.audioElement.pause();
    }
    ctx.failureError = error;
    state = STATE.FAILED;
    dispatch("error", toErrorPayload(error));
  }
  function assertCommandAllowed() {
    if (ctx.failureError) {
      throw ctx.failureError;
    }
    if (state === STATE.STOPPED) {
      throw new Error("driver has been stopped");
    }
  }
  function sendCommand(event, payload = {}) {
    assertCommandAllowed();
    return sendDriverEvent(event, payload);
  }
  function sendDriverEvent(event, payload = {}) {
    if (ctx.failureError || state === STATE.STOPPED) {
      // Terminal states reject public commands via sendCommand(); late async
      // facts from timers/media callbacks are ignored here.
      return;
    }
    if (processingDriverEvents) {
      // Core serializes public commands, so re-entry here means the driver was
      // called directly in an unsupported way.
      throw new Error("re-entrant sendDriverEvent() is not allowed during queue processing");
    }
    processingDriverEvents = true;
    try {
      const result = processDriverEvent(event, payload);
      while (queuedDriverEvents.length > 0) {
        const queuedEvent = queuedDriverEvents.shift();
        processDriverEvent(queuedEvent.event, queuedEvent.payload);
      }
      return result;
    } catch (error) {
      failDriver(error);
      throw error;
    } finally {
      processingDriverEvents = false;
      queuedDriverEvents.length = 0;
    }
  }

  // Emit a follow-up event when the call site's framing is runtime-dependent:
  // defer to the active queue while one is processing (a direct sendDriverEvent() would
  // re-enter and throw), otherwise process immediately. Where the framing is
  // statically known, call sendDriverEvent()/enqueueDriverEvent() directly instead.
  function raiseDriverEvent(event, payload = {}) {
    if (processingDriverEvents) {
      enqueueDriverEvent(event, payload);
      return true;
    }
    return sendDriverEvent(event, payload);
  }
  function init() {
    return sendCommand(EVENT.INIT_REQUESTED);
  }
  async function load(requestedInitialTime) {
    const generation = ctx.positionGeneration;
    ctx.loadingTimeout = setTimeout(() => {
      dispatch("loading");
    }, 3000);
    try {
      const loadedRecording = loadRecordingSource(src, {
        idleTimeLimit,
        startAt,
        markers: markers_,
        inputOffset: src.inputOffset
      });
      const audioLoaded = loadAudio(audioUrl).catch(error => {
        logger.warn(`audio load failed: ${error.message}`);
        return false;
      });
      const recording = await loadedRecording;
      if (generation !== ctx.positionGeneration) return false;
      ctx.recording = recording;
      ctx.duration = recording.duration;
      ctx.effectiveStartAt = recording.effectiveStartAt;
      ctx.markers = recording.markers;
      const initialTime = requestedInitialTime ?? (poster?.type === "npt" ? poster.value * 1000 : ctx.effectiveStartAt);
      const segmentIndex = findSegmentIndex(recording, initialTime ?? 0);
      const segment = await getSegment(segmentIndex, true);
      if (generation !== ctx.positionGeneration) return false;
      activateSegment(segmentIndex, segment);
      const hasAudio = await audioLoaded;
      if (generation !== ctx.positionGeneration) return false;
      sendDriverEvent(EVENT.LOAD_SUCCEEDED, {
        hasAudio
      });
    } catch (e) {
      // Segmented option validation may fail synchronously in-frame, while
      // fetch and parser failures arrive asynchronously out-of-frame.
      raiseDriverEvent(EVENT.LOAD_FAILED, {
        error: e
      });
      throw e;
    } finally {
      clearLoadingTimeout();
    }
  }
  async function loadAudio(audioUrl) {
    if (!audioUrl) return false;
    ctx.audioElement = await createAudioElement(audioUrl);
    ctx.audioSeekable = !Number.isNaN(ctx.audioElement.duration) && ctx.audioElement.duration !== Infinity && ctx.audioElement.seekable.length > 0 && ctx.audioElement.seekable.end(ctx.audioElement.seekable.length - 1) === ctx.audioElement.duration;
    if (ctx.audioSeekable) {
      ctx.audioElement.addEventListener("playing", onAudioPlaying);
      ctx.audioElement.addEventListener("waiting", onAudioWaiting);
    } else {
      logger.warn(`audio is not seekable - you must enable range request support on the server providing ${ctx.audioElement.src} for audio seeking to work`);
    }
    return true;
  }
  function renderPoster() {
    if (!ctx.posterRenderableAfterLoad) return;
    if (poster.type == "npt") {
      syncActiveSegmentToTime(poster.value * 1000, false, false);
    } else if (poster.type == "text") {
      feed(poster.value);
    }
    ctx.posterVisible = true;
  }
  function clearPoster() {
    if (ctx.posterVisible) {
      feed("\x1bc");
    }
    ctx.posterVisible = false;
    ctx.posterRenderableAfterLoad = false;
  }
  function activateSegment(index, segment) {
    ctx.segmentIndex = index;
    ctx.segment = segment;
    ctx.nextEventIndex = 0;
    ctx.lastEventTime = ctx.recording.segments[index].start;
  }
  function getSegment(index, required = false) {
    let entry = ctx.segmentCache.get(index);
    if (entry === undefined) {
      entry = {};
      entry.promise = ctx.recording.loadSegment(index).then(data => {
        if (ctx.segmentCache.get(index) === entry) {
          entry.data = data;
        }
        return data;
      }, error => {
        if (ctx.segmentCache.get(index) === entry) {
          ctx.segmentCache.delete(index);
        }
        if (!required) {
          logger.warn(`segment prefetch failed: ${error.message}`);
        }
        throw error;
      });
      ctx.segmentCache.set(index, entry);
      if (!required) {
        void entry.promise.catch(() => {});
      }
    }
    return entry.promise;
  }
  async function getRequiredSegment(index, generation, onWaiting) {
    if (ctx.segmentCache.get(index)?.data === undefined) {
      onWaiting?.();
    }
    try {
      return await getSegment(index, true);
    } catch (error) {
      if (generation === ctx.positionGeneration && state !== STATE.STOPPED) {
        failDriver(error);
      }
      throw error;
    }
  }
  function retainSegments(indexes) {
    const retained = new Set(indexes.filter(index => index >= 0));
    for (const index of ctx.segmentCache.keys()) {
      if (!retained.has(index)) {
        ctx.segmentCache.delete(index);
      }
    }
  }
  function prefetchNextSegment() {
    const lastIndex = ctx.recording.segments.length - 1;
    const nextIndex = ctx.segmentIndex < lastIndex ? ctx.segmentIndex + 1 : canLoopPlayback() ? 0 : undefined;
    retainSegments([ctx.segmentIndex - 1, ctx.segmentIndex, nextIndex]);
    if (nextIndex !== undefined) getSegment(nextIndex);
  }
  async function advanceSegment() {
    const nextIndex = ctx.segmentIndex + 1;
    const boundary = ctx.recording.segments[nextIndex].start;
    const generation = ++ctx.positionGeneration;
    try {
      const segment = await getRequiredSegment(nextIndex, generation, () => {
        sendDriverEvent(EVENT.SEGMENT_WAITING, {
          time: boundary
        });
      });
      if (generation !== ctx.positionGeneration || state === STATE.STOPPED) return;
      activateSegment(nextIndex, segment);
      prefetchNextSegment();
      if (state === STATE.READY_BUFFERING_TO_RESUME || state === STATE.READY_BUFFERING_WHILE_PAUSED) {
        await sendDriverEvent(EVENT.SEGMENT_READY);
      } else if (state === STATE.READY_PLAYING) {
        scheduleNextRecordingEvent();
      }
    } catch {
      // Required segment failures have already failed the driver.
    }
  }
  function pausePlaybackAt(time) {
    cancelScheduledRecordingEvent();
    ctx.pauseElapsedTime = time;
  }
  function resumeAfterSegmentWait() {
    clearWaitingTimeout();
    if (ctx.audioElement) {
      return ctx.audioElement.play().then(() => sendDriverEvent(EVENT.AUDIO_PLAYING), error => {
        sendDriverEvent(EVENT.PLAYBACK_START_REJECTED);
        logger.warn(`audio resume failed: ${error.message}`);
        return false;
      });
    }
    enqueueDriverEvent(EVENT.AUDIO_PLAYING);
  }
  function scheduleNextRecordingEvent() {
    const nextEvent = ctx.segment.events[ctx.nextEventIndex];
    if (nextEvent) {
      ctx.recordingEventTimeoutId = scheduleAt(runDueRecordingEvents, nextEvent[0]);
    } else {
      if (ctx.segmentIndex < ctx.recording.segments.length - 1) {
        const boundary = ctx.recording.segments[ctx.segmentIndex + 1].start;
        ctx.recordingEventTimeoutId = scheduleAt(advanceSegment, boundary);
      } else {
        raiseDriverEvent(EVENT.PLAYBACK_ENDED);
      }
    }
  }
  function scheduleAt(f, targetTime) {
    let timeout = (targetTime - (now() - ctx.startTime)) / speed;
    if (timeout < 0) {
      timeout = 0;
    }
    return setTimeout(f, timeout);
  }
  function runDueRecordingEvents() {
    while (ctx.segment.events[ctx.nextEventIndex] !== undefined) {
      if (applyNextRecordingEvents()) {
        return;
      }
      const nextEvent = ctx.segment.events[ctx.nextEventIndex];
      if (nextEvent === undefined) {
        break;
      }
      const elapsedWallTime = now() - ctx.startTime;
      if (elapsedWallTime <= nextEvent[0]) {
        break;
      }
    }
    scheduleNextRecordingEvent();
  }
  function applyNextRecordingEvents() {
    const event = ctx.segment.events[ctx.nextEventIndex];
    if (event[1] === "o") {
      applyOutputGroup();
      return false;
    }
    ctx.lastEventTime = event[0];
    ctx.nextEventIndex++;
    return applyRecordingEvent(event);
  }
  function applyOutputGroup() {
    const firstEvent = ctx.segment.events[ctx.nextEventIndex];
    const batchDeadline = firstEvent[0] + outputBatchWindow;
    const output = [];
    let event = firstEvent;
    while (event !== undefined && event[1] === "o" && event[0] < batchDeadline) {
      output.push(event[2]);
      ctx.lastEventTime = event[0];
      ctx.nextEventIndex++;
      event = ctx.segment.events[ctx.nextEventIndex];
    }
    feed(output);
  }
  function cancelScheduledRecordingEvent() {
    clearTimeout(ctx.recordingEventTimeoutId);
    ctx.recordingEventTimeoutId = null;
  }
  async function teardownAudio() {
    clearTimeout(ctx.waitingTimeout);
    if (ctx.audioElement) {
      ctx.audioElement.removeEventListener("playing", onAudioPlaying);
      ctx.audioElement.removeEventListener("waiting", onAudioWaiting);
      ctx.audioElement.pause();
      ctx.audioElement.src = "";
      ctx.audioElement.load();
      ctx.audioElement = undefined;
    }
    if (ctx.audioCtx) {
      await ctx.audioCtx.close();
      ctx.audioCtx = undefined;
    }
  }
  function applyRecordingEvent(event) {
    const [time, type, data] = event;
    if (type === "o") {
      feed(data);
    } else if (type === "i") {
      dispatch("input", {
        data
      });
    } else if (type === "r") {
      const [cols, rows] = data.split("x").map(n => Number.parseInt(n, 10));
      dispatch("resize", effectiveSize(cols, rows));
    } else if (type === "m") {
      return sendDriverEvent(EVENT.MARKER_REACHED, {
        data,
        time
      }) === true;
    }
    return false;
  }
  function play() {
    return sendCommand(EVENT.PLAY_REQUESTED);
  }
  function pause() {
    return sendCommand(EVENT.PAUSE_REQUESTED);
  }
  function pausePlaybackClock() {
    cancelScheduledRecordingEvent();
    ctx.pauseElapsedTime = now() - ctx.startTime;
  }
  function preparePlaybackClock() {
    if (ctx.audioElement && !ctx.audioCtx) setupAudioCtx();
  }
  function confirmPlaybackClockStart() {
    ctx.startTime = now() - ctx.pauseElapsedTime;
    ctx.pauseElapsedTime = null;
    scheduleNextRecordingEvent();
  }
  function seek(where) {
    assertCommandAllowed();
    validateSeekInput(where);
    if (state === STATE.COLD) {
      return sendDriverEvent(EVENT.SEEK_REQUESTED, {
        where
      });
    }
    return sendDriverEvent(EVENT.SEEK_REQUESTED, {
      seekOperation: resolveSeek(state, where)
    });
  }
  function findMarkerTimeBefore(time) {
    if (ctx.markers.length == 0) return;
    let i = 0;
    let marker = ctx.markers[i];
    let lastMarkerTimeBefore;
    while (marker && marker[0] < time) {
      lastMarkerTimeBefore = marker[0];
      marker = ctx.markers[++i];
    }
    return lastMarkerTimeBefore;
  }
  function findMarkerTimeAfter(time) {
    if (ctx.markers.length == 0) return;
    let i = ctx.markers.length - 1;
    let marker = ctx.markers[i];
    let firstMarkerTimeAfter;
    while (marker && marker[0] > time) {
      firstMarkerTimeAfter = marker[0];
      marker = ctx.markers[--i];
    }
    return firstMarkerTimeAfter;
  }
  function step(n) {
    return sendCommand(EVENT.STEP_REQUESTED, {
      n
    });
  }
  function getDuration() {
    return ctx.duration === undefined ? undefined : ctx.duration / 1000;
  }
  function getCurrentTimeMs() {
    if (state === STATE.READY_PLAYING) {
      return now() - ctx.startTime;
    } else {
      return ctx.pauseElapsedTime ?? 0;
    }
  }
  function getCurrentTime() {
    return getCurrentTimeMs() / 1000;
  }
  function setupAudioCtx() {
    ctx.audioCtx = new AudioContext({
      latencyHint: "interactive"
    });
    const src = ctx.audioCtx.createMediaElementSource(ctx.audioElement);
    src.connect(ctx.audioCtx.destination);
    now = audioNow;
  }
  function audioNow() {
    if (!ctx.audioCtx) throw new Error("audio context not started - can't tell time!");
    const {
      contextTime,
      performanceTime
    } = ctx.audioCtx.getOutputTimestamp();

    // The check below is needed for Chrome,
    // which returns 0 for first several dozen millis,
    // completely ruining the timing (the clock jumps backwards once),
    // therefore we initially ignore performanceTime in our calculation.

    return performanceTime === 0 ? contextTime * 1000 : contextTime * 1000 + (performance.now() - performanceTime);
  }
  function onAudioWaiting() {
    logger.debug("audio buffering");
    sendDriverEvent(EVENT.AUDIO_WAITING);
  }
  function onAudioPlaying() {
    logger.debug("audio resumed");
    sendDriverEvent(EVENT.AUDIO_PLAYING);
  }
  function mute() {
    if (ctx.audioElement) {
      ctx.audioElement.muted = true;
      dispatch("muted", true);
      return true;
    }
  }
  function unmute() {
    if (ctx.audioElement) {
      ctx.audioElement.muted = false;
      dispatch("muted", false);
      return true;
    }
  }
  function stop() {
    return sendCommand(EVENT.STOP_REQUESTED);
  }
  function feed(data) {
    dispatch("output", data);
  }
  function dispatchMarker(data) {
    dispatch("marker", {
      ...data,
      time: data.time / 1000
    });
  }
  function renderTextPoster() {
    renderPoster();
    ctx.posterRenderableAfterLoad = false;
  }
  function validateSeekInput(where) {
    if (typeof where === "number") {
      if (Number.isFinite(where)) return;
    } else if (typeof where === "string") {
      if (isRelativeSeek(where) || parseSeekPercentage(where) !== undefined) return;
    } else if (typeof where === "object" && where !== null) {
      if (where.marker === "prev" || where.marker === "next" || Number.isInteger(where.marker) && where.marker >= 0) {
        return;
      }
    }
    throw new Error(`invalid seek target: ${JSON.stringify(where)}`);
  }
  function isRelativeSeek(where) {
    return where === "<<" || where === ">>" || where === "<<<" || where === ">>>";
  }
  function parseSeekPercentage(where) {
    if (!where.endsWith("%")) return;
    const percentage = Number(where.slice(0, -1));
    if (Number.isFinite(percentage)) {
      return percentage;
    }
  }
  function resolveSeek(currentState, where) {
    const currentTime = getCurrentTimeMs();
    const isPlaying = currentState === STATE.READY_PLAYING;
    let target = where;
    if (typeof target === "number") {
      target = target * 1000;
    } else if (typeof target === "string") {
      if (target === "<<") {
        target = currentTime - 5000;
      } else if (target === ">>") {
        target = currentTime + 5000;
      } else if (target === "<<<") {
        target = currentTime - 0.1 * ctx.duration;
      } else if (target === ">>>") {
        target = currentTime + 0.1 * ctx.duration;
      } else if (target[target.length - 1] === "%") {
        target = parseSeekPercentage(target) / 100 * ctx.duration;
      }
    } else if (typeof target === "object") {
      if (target.marker === "prev") {
        target = findMarkerTimeBefore(currentTime) ?? 0;
        if (isPlaying && currentTime - target < 1000) {
          target = findMarkerTimeBefore(target) ?? 0;
        }
      } else if (target.marker === "next") {
        target = findMarkerTimeAfter(currentTime) ?? ctx.duration;
      } else if (typeof target.marker === "number") {
        const marker = ctx.markers[target.marker];
        if (marker === undefined) {
          throw new Error(`invalid marker index: ${target.marker}`);
        }
        target = marker[0];
      }
    }
    const targetTime = Math.min(Math.max(target, 0), ctx.duration);
    return {
      targetTime,
      reachedEnd: targetTime >= ctx.duration,
      noOp: targetTime === ctx.pauseElapsedTime
    };
  }
  function effectiveSize(cols, rows) {
    return {
      cols: optionCols ?? cols,
      rows: optionRows ?? rows
    };
  }
  function resetTerminalFromSnapshot(segment, emitClear = false) {
    if (emitClear) {
      // Preserve the existing observable RIS output even though reset replaces the VT state.
      feed("\x1bc");
    }
    dispatch("reset", {
      size: effectiveSize(segment.snapshot.cols, segment.snapshot.rows),
      init: segment.snapshot.init,
      theme: ctx.recording.theme ?? null
    });
  }
  function syncActiveSegmentToTime(targetTime, clearStartAt = true, inclusive = true) {
    let event = ctx.segment.events[ctx.nextEventIndex];
    let output = [];
    while (event && (inclusive ? event[0] <= targetTime : event[0] < targetTime)) {
      if (event[1] === "o") {
        output.push(event[2]);
      } else if (event[1] === "r") {
        if (output.length > 0) {
          feed(output);
          output = [];
        }
        applyRecordingEvent(event);
      }
      ctx.lastEventTime = event[0];
      event = ctx.segment.events[++ctx.nextEventIndex];
    }
    if (output.length > 0) {
      feed(output);
    }
    ctx.pauseElapsedTime = targetTime;
    if (clearStartAt) {
      ctx.effectiveStartAt = null;
    }
    if (ctx.audioElement && ctx.audioSeekable) {
      ctx.audioElement.currentTime = targetTime / 1000 / speed;
    }
  }
  async function positionAt(targetTime, generation, forceReset = false) {
    const targetIndex = findSegmentIndex(ctx.recording, targetTime);
    if (generation !== ctx.positionGeneration) return false;
    if (!forceReset && targetIndex === ctx.segmentIndex && targetTime >= ctx.lastEventTime) {
      syncActiveSegmentToTime(targetTime);
      return true;
    }
    retainSegments([targetIndex - 1, targetIndex, targetIndex + 1]);
    const segment = await getRequiredSegment(targetIndex, generation);
    if (generation !== ctx.positionGeneration) return false;
    activateSegment(targetIndex, segment);
    resetTerminalFromSnapshot(segment, true);
    syncActiveSegmentToTime(targetTime);
    return true;
  }
  async function startPlayback(reason) {
    const generation = ctx.positionGeneration;
    if (ctx.segmentIndex === ctx.recording.segments.length - 1 && ctx.segment.events[ctx.nextEventIndex] === undefined) {
      if (!(await positionAt(0, generation, true))) return false;
    } else if (ctx.effectiveStartAt !== null) {
      if (!(await positionAt(ctx.effectiveStartAt, generation))) return false;
    }
    if (generation !== ctx.positionGeneration) return false;
    prefetchNextSegment();
    preparePlaybackClock();
    if (ctx.audioElement) {
      try {
        await ctx.audioElement.play();
        return sendDriverEvent(EVENT.PLAYBACK_START_CONFIRMED, {
          reason
        });
      } catch (error) {
        sendDriverEvent(EVENT.PLAYBACK_START_REJECTED);
        throw error;
      }
    }
    return raiseDriverEvent(EVENT.PLAYBACK_START_CONFIRMED, {
      reason
    });
  }
  function performPause(time) {
    if (ctx.audioElement) {
      ctx.audioElement.pause();
    }
    pausePlaybackClock();
    if (time !== undefined) {
      ctx.pauseElapsedTime = time;
    }
    dispatch("pause");
    return true;
  }
  async function performSeek(seekOperation, stateBeforeSeek) {
    const resumeAfterSeek = stateBeforeSeek === STATE.READY_PLAYING || stateBeforeSeek === STATE.READY_BUFFERING_TO_RESUME;
    const generation = ++ctx.positionGeneration;
    if (stateBeforeSeek === STATE.READY_PLAYING) {
      pausePlaybackClock();
    }
    ctx.segmentWaiting = false;
    clearWaitingTimeout();
    if (ctx.audioElement) {
      ctx.audioElement.pause();
    }
    if (!(await positionAt(seekOperation.targetTime, generation))) return false;
    if (generation !== ctx.positionGeneration) return false;
    if (seekOperation.reachedEnd) {
      dispatch("seeked");
      dispatch("ended");
      return true;
    }
    if (resumeAfterSeek) {
      return await startPlayback(PLAYBACK_START_REASON.SEEK);
    }
    dispatch("seeked");
    return true;
  }
  async function performStep(n = 1) {
    const generation = ++ctx.positionGeneration;
    const target = await findStepTarget(n, generation);
    if (target === undefined || generation !== ctx.positionGeneration) return;
    clearPoster();
    if (!(await positionAt(target.time, generation, n < 0))) return;
    if (ctx.audioElement && ctx.audioSeekable) {
      ctx.audioElement.currentTime = target.time / 1000 / speed;
    }
    if (target.reachedEnd) {
      state = STATE.READY_ENDED;
      dispatch("ended");
    } else {
      state = STATE.READY_PAUSED;
    }
  }
  async function findStepTarget(n, generation) {
    let remaining = Math.abs(n);
    let segmentIndex = ctx.segmentIndex;
    let eventIndex = n > 0 ? ctx.nextEventIndex : ctx.nextEventIndex - 2;
    let target;
    while (segmentIndex >= 0 && segmentIndex < ctx.recording.segments.length) {
      if (generation !== ctx.positionGeneration) return;
      retainSegments([segmentIndex - 1, segmentIndex, segmentIndex + 1]);
      const segment = await getRequiredSegment(segmentIndex, generation);
      if (generation !== ctx.positionGeneration) return;
      if (n > 0) {
        for (let i = Math.max(eventIndex, 0); i < segment.events.length; i++) {
          if (segment.events[i][1] === "o" && --remaining === 0) {
            target = {
              time: segment.events[i][0]
            };
            break;
          }
        }
        if (target) break;
        segmentIndex++;
        eventIndex = 0;
      } else {
        for (let i = Math.min(eventIndex, segment.events.length - 1); i >= 0; i--) {
          if (segment.events[i][1] === "o" && --remaining === 0) {
            target = {
              time: segment.events[i][0]
            };
            break;
          }
        }
        if (target) break;
        segmentIndex--;
        eventIndex = Number.MAX_SAFE_INTEGER;
      }
    }
    if (target) {
      target.reachedEnd = target.time >= ctx.duration;
    }
    return target;
  }
  function restartWaitingTimeout() {
    clearTimeout(ctx.waitingTimeout);
    ctx.waitingTimeout = setTimeout(() => {
      dispatch("loading");
    }, 1000);
  }
  function clearWaitingTimeout() {
    clearTimeout(ctx.waitingTimeout);
    ctx.waitingTimeout = null;
  }
  function clearLoadingTimeout() {
    clearTimeout(ctx.loadingTimeout);
    ctx.loadingTimeout = null;
  }
  function cancelPendingTimers() {
    clearLoadingTimeout();
    clearWaitingTimeout();
    cancelScheduledRecordingEvent();
  }
  async function restartLoop() {
    cancelScheduledRecordingEvent();
    ctx.playCount++;
    const generation = ++ctx.positionGeneration;
    try {
      const segment = await getRequiredSegment(0, generation, () => {
        enqueueDriverEvent(EVENT.SEGMENT_WAITING, {
          time: ctx.duration
        });
      });
      if (generation !== ctx.positionGeneration) return;
      activateSegment(0, segment);
      resetTerminalFromSnapshot(segment, true);
      ctx.pauseElapsedTime = 0;
      ctx.startTime = now();
      prefetchNextSegment();
      if (ctx.audioElement && ctx.audioSeekable) {
        ctx.audioElement.currentTime = 0;
      }
      if (state === STATE.READY_BUFFERING_TO_RESUME || state === STATE.READY_BUFFERING_WHILE_PAUSED) {
        await sendDriverEvent(EVENT.SEGMENT_READY);
      } else {
        ctx.pauseElapsedTime = null;
        scheduleNextRecordingEvent();
      }
    } catch {
      // Required segment failures have already failed the driver.
    }
  }
  function finishPlayback() {
    cancelScheduledRecordingEvent();
    ctx.playCount++;
    ctx.pauseElapsedTime = ctx.duration;
    if (ctx.audioElement) {
      ctx.audioElement.pause();
    }
    retainSegments([ctx.segmentIndex - 1, ctx.segmentIndex]);
    dispatch("ended");
  }
  function teardown() {
    ctx.positionGeneration++;
    ctx.segmentCache.clear();
    cancelPendingTimers();
    return teardownAudio();
  }
  return {
    init,
    stop,
    getDuration,
    getCurrentTime,
    play,
    pause,
    seek,
    step,
    mute,
    unmute
  };
}
function loadRecordingSource(src, options) {
  if (src.format === "segmented") {
    return loadSegmentedRecording(src, options);
  }
  return loadFullRecording(src, options);
}
function findSegmentIndex(recording, time) {
  let low = 0;
  let high = recording.segments.length;
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (recording.segments[middle].start <= time) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return low;
}
async function createAudioElement(src) {
  const audio = new Audio();
  audio.preload = "metadata";
  audio.loop = false;
  audio.crossOrigin = "anonymous";
  let resolve;
  let reject;
  const canPlay = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  function cleanup() {
    audio.removeEventListener("canplay", onCanPlay);
    audio.removeEventListener("error", onError);
    audio.removeEventListener("abort", onAbort);
  }
  function onCanPlay() {
    cleanup();
    resolve();
  }
  function onError() {
    cleanup();
    reject(new Error(`failed loading audio from ${src}`));
  }
  function onAbort() {
    cleanup();
    reject(new Error(`audio loading aborted for ${src}`));
  }
  audio.addEventListener("canplay", onCanPlay);
  audio.addEventListener("error", onError);
  audio.addEventListener("abort", onAbort);
  audio.src = src;
  audio.load();
  await canPlay;
  return audio;
}

function clock({
  hourColor = 3,
  minuteColor = 4,
  separatorColor = 9
}, {
  dispatch
}, {
  cols = 5,
  rows = 1
}) {
  const middleRow = Math.floor(rows / 2);
  const leftPad = Math.floor(cols / 2) - 2;
  const setupCursor = `\x1b[?25l\x1b[1m\x1b[${middleRow}B`;
  let intervalId;
  const getCurrentTime = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const seqs = [];
    seqs.push("\r");
    for (let i = 0; i < leftPad; i++) {
      seqs.push(" ");
    }
    seqs.push(`\x1b[3${hourColor}m`);
    if (h < 10) {
      seqs.push("0");
    }
    seqs.push(`${h}`);
    seqs.push(`\x1b[3${separatorColor};5m:\x1b[25m`);
    seqs.push(`\x1b[3${minuteColor}m`);
    if (m < 10) {
      seqs.push("0");
    }
    seqs.push(`${m}`);
    return seqs;
  };
  const updateTime = () => {
    getCurrentTime().forEach(seq => {
      dispatch("output", seq);
    });
  };
  return {
    init: () => {
      dispatch("reset", {
        size: {
          cols,
          rows
        }
      });
      dispatch("output", setupCursor);
      updateTime();
    },
    play: () => {
      if (intervalId !== undefined) return true;
      dispatch("play");
      dispatch("playing");
      dispatch("output", setupCursor);
      updateTime();
      intervalId = setInterval(updateTime, 1000);
      return true;
    },
    stop: () => {
      clearInterval(intervalId);
    },
    getCurrentTime: () => {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  };
}

function random(_src, {
  dispatch
}, {
  speed
}) {
  const base = " ".charCodeAt(0);
  const range = "~".charCodeAt(0) - base;
  let timeoutId;
  const schedule = () => {
    const t = Math.pow(5, Math.random() * 4);
    timeoutId = setTimeout(print, t / speed);
  };
  const print = () => {
    schedule();
    const char = String.fromCharCode(base + Math.floor(Math.random() * range));
    dispatch("output", char);
  };
  return {
    play() {
      if (timeoutId !== undefined) return true;
      dispatch("play");
      dispatch("playing");
      schedule();
    },
    stop() {
      clearInterval(timeoutId);
    }
  };
}

const DEFAULT_COLS = 80;
const DEFAULT_ROWS = 24;
async function parse$2(data) {
  if (data instanceof Response) {
    const text = await data.text();
    const result = parseJsonl(text);
    if (result !== undefined) {
      const {
        header,
        events
      } = result;
      if (header.version === 2) {
        return parseAsciicastV2(header, events);
      } else if (header.version === 3) {
        return parseAsciicastV3(header, events);
      } else {
        throw new Error(`asciicast v${header.version} format not supported`);
      }
    } else {
      const header = JSON.parse(text);
      if (header.version === 1) {
        return parseAsciicastV1(header);
      }
    }
  } else if (typeof data === "object" && data.version === 1) {
    return parseAsciicastV1(data);
  } else if (Array.isArray(data)) {
    const header = data[0];
    if (header.version === 2) {
      const events = data.slice(1, data.length);
      return parseAsciicastV2(header, events);
    } else if (header.version === 3) {
      const events = data.slice(1, data.length);
      return parseAsciicastV3(header, events);
    } else {
      throw new Error(`asciicast v${header.version} format not supported`);
    }
  }
  throw new Error("invalid data");
}
function parseJsonl(jsonl) {
  const lines = jsonl.split("\n");
  let header;
  try {
    header = JSON.parse(lines[0]);
  } catch (_error) {
    return;
  }
  const events = new Stream(lines).drop(1).filter(l => l[0] === "[").map(JSON.parse);
  return {
    header,
    events
  };
}
function parseAsciicastV1(data) {
  let time = 0;
  const events = new Stream(data.stdout).map(e => {
    time += e[0] * 1000;
    return [time, "o", e[1]];
  });
  return {
    cols: data.width === 0 ? DEFAULT_COLS : data.width,
    rows: data.height === 0 ? DEFAULT_ROWS : data.height,
    events
  };
}
function parseAsciicastV2(header, events) {
  if (!(events instanceof Stream)) {
    events = new Stream(events);
  }
  events = events.map(e => [e[0] * 1000, e[1], e[2]]);
  return {
    cols: header.width === 0 ? DEFAULT_COLS : header.width,
    rows: header.height === 0 ? DEFAULT_ROWS : header.height,
    theme: parseTheme$1(header.theme),
    events,
    idleTimeLimit: header.idle_time_limit
  };
}
function parseAsciicastV3(header, events) {
  if (!(events instanceof Stream)) {
    events = new Stream(events);
  }
  let time = 0;
  events = events.map(e => {
    time += e[0] * 1000;
    return [time, e[1], e[2]];
  });
  return {
    cols: header.term.cols === 0 ? DEFAULT_COLS : header.term.cols,
    rows: header.term.rows === 0 ? DEFAULT_ROWS : header.term.rows,
    theme: parseTheme$1(header.term?.theme),
    events,
    idleTimeLimit: header.idle_time_limit
  };
}
function parseTheme$1(theme) {
  const palette = typeof theme?.palette === "string" ? theme.palette.split(":") : undefined;
  return normalizeTheme({
    foreground: theme?.fg,
    background: theme?.bg,
    palette
  });
}

function benchmark({
  url,
  iterations = 10
}, {
  dispatch
}) {
  let data;
  let byteCount = 0;
  return {
    async init() {
      const recording = await parse$2(await fetch(url));
      const {
        cols,
        rows,
        events
      } = recording;
      data = Array.from(events).filter(([_time, type, _text]) => type === "o").map(([time, _type, text]) => [time, text]);
      for (const [_, text] of data) {
        byteCount += new Blob([text]).size;
      }
      dispatch("reset", {
        size: {
          cols,
          rows
        }
      });
    },
    play() {
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        for (const [_, text] of data) {
          dispatch("output", text);
        }
        dispatch("output", "\x1bc"); // reset terminal
      }
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const throughput = byteCount * iterations / duration;
      const throughputMbs = byteCount / (1024 * 1024) * iterations / duration;
      console.info("benchmark: result", {
        byteCount,
        iterations,
        duration,
        throughput,
        throughputMbs
      });
      setTimeout(() => {
        dispatch("ended");
      }, 0);
      return true;
    }
  };
}

function getBuffer(bufferTime, dispatch, setTime, baseStreamTime, minFrameTime, logger) {
  const execute = executeEvent(dispatch);
  if (bufferTime === 0) {
    logger.debug("using no buffer");
    return nullBuffer(execute);
  } else {
    bufferTime = bufferTime ?? {};
    let getBufferTime;
    if (typeof bufferTime === "number") {
      logger.debug(`using fixed time buffer (${bufferTime} ms)`);
      getBufferTime = _latency => bufferTime;
    } else if (typeof bufferTime === "function") {
      logger.debug("using custom dynamic buffer");
      getBufferTime = bufferTime({
        logger
      });
    } else {
      logger.debug("using adaptive buffer", bufferTime);
      getBufferTime = adaptiveBufferTimeProvider({
        logger
      }, bufferTime);
    }
    return buffer(getBufferTime, execute, setTime, logger, baseStreamTime ?? 0, minFrameTime);
  }
}
function nullBuffer(execute) {
  return {
    pushEvent(event) {
      execute(event[1], event[2]);
    },
    pushText(text) {
      execute("o", text);
    },
    stop() {}
  };
}
function executeEvent(dispatch) {
  return function (code, data) {
    if (code === "o") {
      dispatch("output", data);
    } else if (code === "i") {
      dispatch("input", {
        data
      });
    } else if (code === "r") {
      dispatch("resize", data);
    } else if (code === "m") {
      dispatch("marker", data);
    }
  };
}
function buffer(getBufferTime, execute, setTime, logger, baseStreamTime, minFrameTime = 1.0 / 60) {
  const outputBatchWindow = minFrameTime * 1000;
  let epoch = performance.now() - baseStreamTime;
  let bufferTime = getBufferTime(0);
  let queue = [];
  let onPush;
  let prevElapsedStreamTime = -outputBatchWindow;
  let stop = false;
  function elapsedWallTime() {
    return performance.now() - epoch;
  }
  function push(item) {
    queue.push(item);
    if (onPush !== undefined) {
      onPush(popAll());
      onPush = undefined;
    }
  }
  function popAll() {
    if (queue.length > 0) {
      const items = queue;
      queue = [];
      return items;
    } else {
      return new Promise(resolve => {
        onPush = resolve;
      });
    }
  }
  async function run() {
    while (!stop) {
      const events = await popAll();
      if (stop) return;
      let nextEventIndex = 0;
      while (nextEventIndex < events.length) {
        nextEventIndex = await executeNextEventChunk(events, nextEventIndex);
      }
    }
  }
  queueMicrotask(run);
  async function executeNextEventChunk(events, nextEventIndex) {
    const event = events[nextEventIndex];
    const elapsedStreamTime = event[3];
    if (elapsedStreamTime - prevElapsedStreamTime >= outputBatchWindow) {
      const delay = elapsedStreamTime - elapsedWallTime();
      if (delay > 0) {
        await sleep(delay);
        if (stop) {
          return events.length;
        }
      }
      setTime(event[0]);
      prevElapsedStreamTime = elapsedStreamTime;
    }
    if (event[1] === "o") {
      return executeOutputGroup(events, nextEventIndex);
    }
    execute(event[1], event[2]);
    return nextEventIndex + 1;
  }
  function executeOutputGroup(events, nextEventIndex) {
    const firstEvent = events[nextEventIndex];
    const batchDeadline = firstEvent[0] + outputBatchWindow;
    const output = [];
    let event = firstEvent;
    while (event !== undefined && event[1] === "o" && event[0] < batchDeadline) {
      output.push(event[2]);
      event = events[++nextEventIndex];
    }
    execute("o", output);
    return nextEventIndex;
  }
  return {
    pushEvent(event) {
      let latency = elapsedWallTime() - event[0];
      if (latency < 0) {
        logger.debug(`correcting epoch by ${latency} ms`);
        epoch += latency;
        latency = 0;
      }
      bufferTime = getBufferTime(latency);
      push([event[0], event[1], event[2], event[0] + bufferTime]);
    },
    pushText(text) {
      const time = elapsedWallTime();
      push([time, "o", text, time + bufferTime]);
    },
    stop() {
      stop = true;
      if (onPush !== undefined) {
        onPush([]);
        onPush = undefined;
      }
    }
  };
}
function sleep(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}
function adaptiveBufferTimeProvider({
  logger
} = {}, {
  minBufferTime = 50,
  bufferLevelStep = 100,
  maxBufferLevel = 50,
  transitionDuration = 500,
  peakHalfLifeUp = 100,
  peakHalfLifeDown = 10000,
  floorHalfLifeUp = 5000,
  floorHalfLifeDown = 100,
  idealHalfLifeUp = 1000,
  idealHalfLifeDown = 5000,
  safetyMultiplier = 1.2,
  minImprovementDuration = 3000
} = {}) {
  function levelToMs(level) {
    return level === 0 ? minBufferTime : bufferLevelStep * level;
  }
  let bufferLevel = 1;
  let bufferTime = levelToMs(bufferLevel);
  let lastUpdateTime = performance.now();
  let smoothedPeakLatency = null;
  let smoothedFloorLatency = null;
  let smoothedIdealBufferTime = null;
  let stableSince = null;
  let targetBufferTime = null;
  let transitionRate = null;
  return function (latency) {
    const now = performance.now();
    const dt = Math.max(0, now - lastUpdateTime);
    lastUpdateTime = now;

    // adjust EMA-smoothed peak latency from current latency

    if (smoothedPeakLatency === null) {
      smoothedPeakLatency = latency;
    } else if (latency > smoothedPeakLatency) {
      const alphaUp = 1 - Math.pow(2, -dt / peakHalfLifeUp);
      smoothedPeakLatency += alphaUp * (latency - smoothedPeakLatency);
    } else {
      const alphaDown = 1 - Math.pow(2, -dt / peakHalfLifeDown);
      smoothedPeakLatency += alphaDown * (latency - smoothedPeakLatency);
    }
    smoothedPeakLatency = Math.max(smoothedPeakLatency, 0);

    // adjust EMA-smoothed floor latency from current latency

    if (smoothedFloorLatency === null) {
      smoothedFloorLatency = latency;
    } else if (latency > smoothedFloorLatency) {
      const alphaUp = 1 - Math.pow(2, -dt / floorHalfLifeUp);
      smoothedFloorLatency += alphaUp * (latency - smoothedFloorLatency);
    } else {
      const alphaDown = 1 - Math.pow(2, -dt / floorHalfLifeDown);
      smoothedFloorLatency += alphaDown * (latency - smoothedFloorLatency);
    }
    smoothedFloorLatency = Math.max(smoothedFloorLatency, 0);

    // adjust EMA-smoothed ideal buffer time

    const jitter = smoothedPeakLatency - smoothedFloorLatency;
    const idealBufferTime = safetyMultiplier * (smoothedPeakLatency + jitter);
    if (smoothedIdealBufferTime === null) {
      smoothedIdealBufferTime = idealBufferTime;
    } else if (idealBufferTime > smoothedIdealBufferTime) {
      const alphaUp = 1 - Math.pow(2, -dt / idealHalfLifeUp);
      smoothedIdealBufferTime += +alphaUp * (idealBufferTime - smoothedIdealBufferTime);
    } else {
      const alphaDown = 1 - Math.pow(2, -dt / idealHalfLifeDown);
      smoothedIdealBufferTime += +alphaDown * (idealBufferTime - smoothedIdealBufferTime);
    }

    // quantize smoothed ideal buffer time to discrete buffer level

    let newBufferLevel;
    if (smoothedIdealBufferTime <= minBufferTime) {
      newBufferLevel = 0;
    } else {
      newBufferLevel = clamp(Math.ceil(smoothedIdealBufferTime / bufferLevelStep), 1, maxBufferLevel);
    }
    if (latency > bufferTime) {
      logger.debug('buffer underrun', {
        latency,
        bufferTime
      });
    }

    // adjust buffer level and target buffer time for new buffer level

    if (newBufferLevel > bufferLevel) {
      if (latency > bufferTime) {
        // <- underrun - raise quickly
        bufferLevel = Math.min(newBufferLevel, bufferLevel + 3);
      } else {
        bufferLevel += 1;
      }
      targetBufferTime = levelToMs(bufferLevel);
      transitionRate = (targetBufferTime - bufferTime) / transitionDuration;
      stableSince = null;
      logger.debug('raising buffer', {
        latency,
        bufferTime,
        targetBufferTime
      });
    } else if (newBufferLevel < bufferLevel) {
      if (stableSince == null) stableSince = now;
      if (now - stableSince >= minImprovementDuration) {
        bufferLevel -= 1;
        targetBufferTime = levelToMs(bufferLevel);
        transitionRate = (targetBufferTime - bufferTime) / transitionDuration;
        stableSince = now;
        logger.debug('lowering buffer', {
          latency,
          bufferTime,
          targetBufferTime
        });
      }
    } else {
      stableSince = null;
    }

    // linear transition to target buffer time

    if (targetBufferTime !== null) {
      bufferTime += transitionRate * dt;
      if (transitionRate >= 0 && bufferTime > targetBufferTime || transitionRate < 0 && bufferTime < targetBufferTime) {
        bufferTime = targetBufferTime;
        targetBufferTime = null;
      }
    }
    return bufferTime;
  };
}
function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x));
}

const ONE_MS_IN_USEC = 1000;
const ONE_SEC_IN_USEC = 1000000;
function alisHandler(logger) {
  const outputDecoder = new TextDecoder();
  const inputDecoder = new TextDecoder();
  let handler = parseMagicString;
  let lastEventTime;
  let markerIndex = 0;
  function parseMagicString(buffer) {
    const text = new TextDecoder().decode(buffer);
    if (text === "ALiS\x01") {
      handler = parseFirstFrame;
    } else {
      throw new Error("not an ALiS v1 live stream");
    }
  }
  function parseFirstFrame(buffer) {
    const view = new BinaryReader(new DataView(buffer));
    const type = view.getUint8();
    if (type !== 0x01) throw new Error(`expected reset (0x01) frame, got ${type}`);
    return parseResetFrame(view, buffer);
  }
  function parseResetFrame(view, buffer) {
    view.decodeVarUint();
    let time = view.decodeVarUint();
    lastEventTime = time;
    time = time / ONE_MS_IN_USEC;
    markerIndex = 0;
    const cols = view.decodeVarUint();
    const rows = view.decodeVarUint();
    const themeFormat = view.getUint8();
    let theme;
    if (themeFormat === 8) {
      const len = (2 + 8) * 3;
      theme = parseTheme(new Uint8Array(buffer, view.offset, len));
      view.forward(len);
    } else if (themeFormat === 16) {
      const len = (2 + 16) * 3;
      theme = parseTheme(new Uint8Array(buffer, view.offset, len));
      view.forward(len);
    } else if (themeFormat !== 0) {
      throw new Error(`alis: invalid theme format (${themeFormat})`);
    }
    const initLen = view.decodeVarUint();
    let init;
    if (initLen > 0) {
      init = outputDecoder.decode(new Uint8Array(buffer, view.offset, initLen));
    }
    handler = parseFrame;
    return {
      time,
      term: {
        size: {
          cols,
          rows
        },
        theme,
        init
      }
    };
  }
  function parseFrame(buffer) {
    const view = new BinaryReader(new DataView(buffer));
    const type = view.getUint8();
    if (type === 0x01) {
      return parseResetFrame(view, buffer);
    } else if (type === 0x6f) {
      // "o"
      return parseOutputFrame(view, buffer);
    } else if (type === 0x69) {
      // "i"
      return parseInputFrame(view, buffer);
    } else if (type === 0x72) {
      // "r"
      return parseResizeFrame(view);
    } else if (type === 0x6d) {
      // "m"
      return parseMarkerFrame(view, buffer);
    } else if (type === 0x78) {
      // "x"
      return parseExitFrame(view);
    } else if (type === 0x04) {
      // EOT
      handler = parseFirstFrame;
      return false;
    } else {
      logger.debug(`alis: unknown frame type: ${type}`);
    }
  }
  function parseOutputFrame(view, buffer) {
    view.decodeVarUint();
    const relTime = view.decodeVarUint();
    lastEventTime += relTime;
    const len = view.decodeVarUint();
    const text = outputDecoder.decode(new Uint8Array(buffer, view.offset, len));
    return [lastEventTime / ONE_MS_IN_USEC, "o", text];
  }
  function parseInputFrame(view, buffer) {
    view.decodeVarUint();
    const relTime = view.decodeVarUint();
    lastEventTime += relTime;
    const len = view.decodeVarUint();
    const text = inputDecoder.decode(new Uint8Array(buffer, view.offset, len));
    return [lastEventTime / ONE_MS_IN_USEC, "i", text];
  }
  function parseResizeFrame(view) {
    view.decodeVarUint();
    const relTime = view.decodeVarUint();
    lastEventTime += relTime;
    const cols = view.decodeVarUint();
    const rows = view.decodeVarUint();
    return [lastEventTime / ONE_MS_IN_USEC, "r", {
      cols,
      rows
    }];
  }
  function parseMarkerFrame(view, buffer) {
    view.decodeVarUint();
    const relTime = view.decodeVarUint();
    lastEventTime += relTime;
    const len = view.decodeVarUint();
    const decoder = new TextDecoder();
    const index = markerIndex++;
    const time = lastEventTime / ONE_MS_IN_USEC;
    const markerTime = lastEventTime / ONE_SEC_IN_USEC;
    const label = decoder.decode(new Uint8Array(buffer, view.offset, len));
    return [time, "m", {
      index,
      time: markerTime,
      label
    }];
  }
  function parseExitFrame(view) {
    view.decodeVarUint();
    const relTime = view.decodeVarUint();
    lastEventTime += relTime;
    const status = view.decodeVarUint();
    return [lastEventTime / ONE_MS_IN_USEC, "x", {
      status
    }];
  }
  return function (buffer) {
    return handler(buffer);
  };
}
function parseTheme(arr) {
  const colorCount = arr.length / 3;
  const foreground = hexColor(arr[0], arr[1], arr[2]);
  const background = hexColor(arr[3], arr[4], arr[5]);
  const palette = [];
  for (let i = 2; i < colorCount; i++) {
    palette.push(hexColor(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]));
  }
  return normalizeTheme({
    foreground,
    background,
    palette
  });
}
function hexColor(r, g, b) {
  return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
}
function byteToHex(value) {
  return value.toString(16).padStart(2, "0");
}
class BinaryReader {
  constructor(inner, offset = 0) {
    this.inner = inner;
    this.offset = offset;
  }
  forward(delta) {
    this.offset += delta;
  }
  getUint8() {
    const value = this.inner.getUint8(this.offset);
    this.offset += 1;
    return value;
  }
  decodeVarUint() {
    let number = BigInt(0);
    let shift = BigInt(0);
    let byte = this.getUint8();
    while (byte > 127) {
      byte &= 127;
      number += BigInt(byte) << shift;
      shift += BigInt(7);
      byte = this.getUint8();
    }
    number = number + (BigInt(byte) << shift);
    return Number(number);
  }
}

function ascicastV2Handler() {
  let parse = parseHeader;
  function parseHeader(buffer) {
    const header = JSON.parse(buffer);
    if (header.version !== 2) {
      throw new Error("not an asciicast v2 stream");
    }
    parse = parseEvent;
    return {
      time: 0.0,
      term: {
        size: {
          cols: header.width,
          rows: header.height
        }
      }
    };
  }
  function parseEvent(buffer) {
    const event = JSON.parse(buffer);
    const time = event[0] * 1000;
    if (event[1] === "r") {
      const [cols, rows] = event[2].split("x");
      return [time, "r", {
        cols: parseInt(cols, 10),
        rows: parseInt(rows, 10)
      }];
    } else {
      return [time, event[1], event[2]];
    }
  }
  return function (buffer) {
    return parse(buffer);
  };
}

function ascicastV3Handler() {
  let parse = parseHeader;
  let currentTime = 0;
  function parseHeader(buffer) {
    const header = JSON.parse(buffer);
    if (header.version !== 3) {
      throw new Error("not an asciicast v3 stream");
    }
    parse = parseEvent;
    const term = {
      size: {
        cols: header.term.cols,
        rows: header.term.rows
      }
    };
    if (header.term.theme) {
      const palette = typeof header.term.theme.palette === "string" ? header.term.theme.palette.split(":") : undefined;
      const theme = normalizeTheme({
        foreground: header.term.theme.fg,
        background: header.term.theme.bg,
        palette
      });
      if (theme) {
        term.theme = theme;
      }
    }
    return {
      time: 0.0,
      term
    };
  }
  function parseEvent(buffer) {
    const event = JSON.parse(buffer);
    const [interval, eventType, data] = event;
    currentTime += interval * 1000;
    if (eventType === "r") {
      const [cols, rows] = data.split("x");
      return [currentTime, "r", {
        cols: parseInt(cols, 10),
        rows: parseInt(rows, 10)
      }];
    } else {
      return [currentTime, eventType, data];
    }
  }
  return function (buffer) {
    return parse(buffer);
  };
}

function rawHandler() {
  const outputDecoder = new TextDecoder();
  let parse = parseSize;
  function parseSize(buffer) {
    const text = outputDecoder.decode(buffer, {
      stream: true
    });
    const [cols, rows] = sizeFromResizeSeq(text) ?? sizeFromScriptStartMessage(text) ?? [80, 24];
    parse = parseOutput;
    return {
      time: 0.0,
      term: {
        size: {
          cols,
          rows
        },
        init: text
      }
    };
  }
  function parseOutput(buffer) {
    return outputDecoder.decode(buffer, {
      stream: true
    });
  }
  return function (buffer) {
    return parse(buffer);
  };
}
function sizeFromResizeSeq(text) {
  const match = text.match(/\x1b\[8;(\d+);(\d+)t/);
  if (match !== null) {
    return [parseInt(match[2], 10), parseInt(match[1], 10)];
  }
}
function sizeFromScriptStartMessage(text) {
  const match = text.match(/\[.*COLUMNS="(\d{1,3})" LINES="(\d{1,3})".*\]/);
  if (match !== null) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }
}

const RECONNECT_DELAY_BASE = 500;
const RECONNECT_DELAY_CAP = 10000;
function exponentialDelay(attempt) {
  const base = Math.min(RECONNECT_DELAY_BASE * Math.pow(2, attempt), RECONNECT_DELAY_CAP);
  return Math.random() * base;
}
function websocket({
  url,
  bufferTime,
  reconnectDelay = exponentialDelay,
  minFrameTime
}, {
  dispatch,
  logger
}, {
  audioUrl
}) {
  logger = new PrefixedLogger(logger, "websocket: ");
  let socket;
  let buf;
  let clock = new NullClock();
  let reconnectAttempt = 0;
  let successfulConnectionTimeout;
  let stop = false;
  let wasOnline = false;
  let gotExitEvent = false;
  let gotEotEvent = false;
  let initTimeout;
  let audioElement;
  function connect() {
    socket = new WebSocket(url, ["v1.alis", "v2.asciicast", "v3.asciicast", "raw"]);
    socket.binaryType = "arraybuffer";
    let proto;
    socket.onopen = () => {
      proto = socket.protocol || "raw";
      logger.info("opened");
      logger.info(`activating ${proto} protocol handler`);
      if (proto === "v1.alis") {
        socket.onmessage = onMessage(alisHandler(logger));
      } else if (proto === "v2.asciicast") {
        socket.onmessage = onMessage(ascicastV2Handler());
      } else if (proto === "v3.asciicast") {
        socket.onmessage = onMessage(ascicastV3Handler());
      } else if (proto === "raw") {
        socket.onmessage = onMessage(rawHandler());
      }
      successfulConnectionTimeout = setTimeout(() => {
        reconnectAttempt = 0;
      }, 1000);
    };
    socket.onclose = event => {
      clearTimeout(initTimeout);
      stopBuffer();
      if (stop) return;
      let ended = false;
      let endedMessage = "Stream ended";
      if (proto === "v1.alis") {
        if (gotEotEvent || event.code >= 4000 && event.code <= 4100) {
          ended = true;
          endedMessage = event.reason || endedMessage;
        }
      } else if (gotExitEvent || event.code === 1000 || event.code === 1005) {
        ended = true;
      }
      if (ended) {
        logger.info("closed");
        dispatch("ended", {
          message: endedMessage
        });
      } else if (event.code === 1002) {
        logger.debug(`close reason: ${event.reason}`);
        dispatch("ended", {
          message: "Err: Player not compatible with the server"
        });
      } else {
        clearTimeout(successfulConnectionTimeout);
        const delay = reconnectDelay(reconnectAttempt++);
        logger.info(`unexpected close, reconnecting in ${delay}...`);
        dispatch("loading");
        setTimeout(connect, delay);
      }
    };
    wasOnline = false;
  }
  function onMessage(handler) {
    initTimeout = setTimeout(onStreamEnd, 5000);
    return function (event) {
      try {
        const result = handler(event.data);
        if (buf) {
          if (Array.isArray(result)) {
            buf.pushEvent(result);
            if (result[1] === "x") {
              gotExitEvent = true;
            }
          } else if (typeof result === "string") {
            buf.pushText(result);
          } else if (typeof result === "object" && !Array.isArray(result)) {
            // TODO: check last event ID from the parser, don't reset if we didn't miss anything
            onStreamReset(result);
          } else if (result === false) {
            // EOT
            onStreamEnd();
            gotEotEvent = true;
          } else if (result !== undefined) {
            throw new Error(`unexpected value from protocol handler: ${result}`);
          }
        } else {
          if (typeof result === "object" && !Array.isArray(result)) {
            onStreamReset(result);
            clearTimeout(initTimeout);
          } else if (result === undefined) {
            clearTimeout(initTimeout);
            initTimeout = setTimeout(onStreamEnd, 1000);
          } else {
            clearTimeout(initTimeout);
            throw new Error(`unexpected value from protocol handler: ${result}`);
          }
        }
      } catch (e) {
        socket.close();
        throw e;
      }
    };
  }
  function onStreamReset({
    time,
    term
  }) {
    const {
      size,
      init,
      theme
    } = term;
    const {
      cols,
      rows
    } = size;
    logger.info(`stream reset (${cols}x${rows} @${time})`);
    stopBuffer();
    buf = getBuffer(bufferTime, dispatch, t => clock.setTime(t), time, minFrameTime, logger);
    dispatch("reset", {
      size: {
        cols,
        rows
      },
      init,
      theme: theme ?? null
    });
    clock = new Clock();
    wasOnline = true;
    gotExitEvent = false;
    gotEotEvent = false;
    if (typeof time === "number") {
      clock.setTime(time);
    }
    dispatch("playing");
  }
  function onStreamEnd() {
    stopBuffer();
    if (wasOnline) {
      logger.info("stream ended");
      dispatch("offline", {
        message: "Stream ended"
      });
    } else {
      logger.info("stream offline");
      dispatch("offline", {
        message: "Stream offline"
      });
    }
    clock = new NullClock();
  }
  function stopBuffer() {
    if (buf) buf.stop();
    buf = null;
  }
  function startAudio() {
    if (!audioUrl) return;
    audioElement = new Audio();
    audioElement.preload = "auto";
    audioElement.crossOrigin = "anonymous";
    audioElement.src = audioUrl;
    audioElement.play();
  }
  function stopAudio() {
    if (!audioElement) return;
    audioElement.pause();
  }
  function mute() {
    if (audioElement) {
      audioElement.muted = true;
      return true;
    }
  }
  function unmute() {
    if (audioElement) {
      audioElement.muted = false;
      return true;
    }
  }
  return {
    init: () => {
      dispatch("metadata", {
        hasAudio: !!audioUrl
      });
    },
    play: () => {
      if (socket) return true;
      dispatch("play");
      connect();
      startAudio();
      return true;
    },
    stop: () => {
      stop = true;
      stopBuffer();
      if (socket !== undefined) socket.close();
      stopAudio();
    },
    mute,
    unmute,
    getCurrentTime: () => {
      const t = clock.getTime();
      return typeof t === "number" ? t / 1000 : t;
    }
  };
}

function eventsource({
  url,
  bufferTime,
  minFrameTime
}, {
  dispatch,
  logger
}) {
  logger = new PrefixedLogger(logger, "eventsource: ");
  let es;
  let buf;
  let clock = new NullClock();
  function initBuffer(baseStreamTime) {
    if (buf !== undefined) buf.stop();
    buf = getBuffer(bufferTime, dispatch, t => clock.setTime(t), baseStreamTime, minFrameTime, logger);
  }
  return {
    play: () => {
      if (es) return true;
      dispatch("play");
      es = new EventSource(url);
      es.addEventListener("open", () => {
        logger.info("opened");
        initBuffer();
      });
      es.addEventListener("error", e => {
        logger.info("errored");
        logger.debug({
          e
        });
        dispatch("loading");
      });
      es.addEventListener("message", event => {
        const e = JSON.parse(event.data);
        if (Array.isArray(e)) {
          buf.pushEvent([e[0] * 1000, e[1], e[2]]);
        } else if (e.cols !== undefined || e.width !== undefined) {
          const cols = e.cols ?? e.width;
          const rows = e.rows ?? e.height;
          const time = typeof e.time === "number" ? e.time * 1000 : undefined;
          logger.debug(`vt reset (${cols}x${rows})`);
          initBuffer(time);
          dispatch("reset", {
            size: {
              cols,
              rows
            },
            init: e.init ?? undefined
          });
          clock = new Clock();
          if (time !== undefined) {
            clock.setTime(time);
          }
          dispatch("playing");
        } else if (e.state === "offline") {
          logger.info("stream offline");
          dispatch("offline", {
            message: "Stream offline"
          });
          clock = new NullClock();
        }
      });
      es.addEventListener("done", () => {
        logger.info("closed");
        es.close();
        dispatch("ended", {
          message: "Stream ended"
        });
      });
      return true;
    },
    stop: () => {
      if (buf !== undefined) buf.stop();
      if (es !== undefined) es.close();
    },
    getCurrentTime: () => {
      const t = clock.getTime();
      return typeof t === "number" ? t / 1000 : t;
    }
  };
}

async function parse$1(responses, {
  encoding
}) {
  const textDecoder = new TextDecoder(encoding);
  let cols;
  let rows;
  let timing = (await responses[0].text()).split("\n").filter(line => line.length > 0).map(line => line.split(" "));
  if (timing[0].length < 3) {
    timing = timing.map(entry => ["O", entry[0], entry[1]]);
  }
  const buffer = await responses[1].arrayBuffer();
  const array = new Uint8Array(buffer);
  const dataOffset = array.findIndex(byte => byte == 0x0a) + 1;
  const header = textDecoder.decode(array.subarray(0, dataOffset));
  const sizeMatch = header.match(/COLUMNS="(\d+)" LINES="(\d+)"/);
  if (sizeMatch !== null) {
    cols = parseInt(sizeMatch[1], 10);
    rows = parseInt(sizeMatch[2], 10);
  }
  const stdout = {
    array,
    cursor: dataOffset
  };
  let stdin = stdout;
  if (responses[2] !== undefined) {
    const buffer = await responses[2].arrayBuffer();
    const array = new Uint8Array(buffer);
    stdin = {
      array,
      cursor: dataOffset
    };
  }
  const events = [];
  let time = 0;
  for (const entry of timing) {
    time += parseFloat(entry[1]) * 1000;
    if (entry[0] === "O") {
      const count = parseInt(entry[2], 10);
      const bytes = stdout.array.subarray(stdout.cursor, stdout.cursor + count);
      const text = textDecoder.decode(bytes);
      events.push([time, "o", text]);
      stdout.cursor += count;
    } else if (entry[0] === "I") {
      const count = parseInt(entry[2], 10);
      const bytes = stdin.array.subarray(stdin.cursor, stdin.cursor + count);
      const text = textDecoder.decode(bytes);
      events.push([time, "i", text]);
      stdin.cursor += count;
    } else if (entry[0] === "S" && entry[2] === "SIGWINCH") {
      const cols = parseInt(entry[4].slice(5), 10);
      const rows = parseInt(entry[3].slice(5), 10);
      events.push([time, "r", `${cols}x${rows}`]);
    } else if (entry[0] === "H" && entry[2] === "COLUMNS") {
      cols = parseInt(entry[3], 10);
    } else if (entry[0] === "H" && entry[2] === "LINES") {
      rows = parseInt(entry[3], 10);
    }
  }
  cols = cols ?? 80;
  rows = rows ?? 24;
  return {
    cols,
    rows,
    events
  };
}

async function parse(response, {
  encoding
}) {
  const textDecoder = new TextDecoder(encoding);
  const buffer = await response.arrayBuffer();
  const array = new Uint8Array(buffer);
  const firstFrame = parseFrame(array);
  const baseTime = firstFrame.time;
  const firstFrameText = textDecoder.decode(firstFrame.data);
  const sizeMatch = firstFrameText.match(/\x1b\[8;(\d+);(\d+)t/);
  const events = [];
  let cols = 80;
  let rows = 24;
  if (sizeMatch !== null) {
    cols = parseInt(sizeMatch[2], 10);
    rows = parseInt(sizeMatch[1], 10);
  }
  let cursor = 0;
  let frame = parseFrame(array);
  while (frame !== undefined) {
    const time = (frame.time - baseTime) * 1000;
    const text = textDecoder.decode(frame.data);
    events.push([time, "o", text]);
    cursor += frame.len;
    frame = parseFrame(array.subarray(cursor));
  }
  return {
    cols,
    rows,
    events
  };
}
function parseFrame(array) {
  if (array.length < 13) return;
  const time = parseTimestamp(array.subarray(0, 8));
  const len = parseNumber(array.subarray(8, 12));
  const data = array.subarray(12, 12 + len);
  return {
    time,
    data,
    len: len + 12
  };
}
function parseNumber(array) {
  return array[0] + array[1] * 256 + array[2] * 256 * 256 + array[3] * 256 * 256 * 256;
}
function parseTimestamp(array) {
  const sec = parseNumber(array.subarray(0, 4));
  const usec = parseNumber(array.subarray(4, 8));
  return sec + usec / 1000000;
}

class Core {
  constructor(src, opts) {
    this.logger = opts.logger;
    this.driverFactory = getDriver(src);
    this.driver = null;
    this.cols = opts.cols;
    this.rows = opts.rows;
    this.speed = opts.speed;
    this.loop = opts.loop;
    this.autoPlay = opts.autoPlay;
    this.idleTimeLimit = opts.idleTimeLimit;
    this.preload = opts.preload;
    this.startAt = parseNpt(opts.startAt);
    this.poster = this._parsePoster(opts.poster);
    this.markers = opts.markers;
    this.pauseOnMarkers = opts.pauseOnMarkers;
    this.audioUrl = opts.audioUrl;
    this.initPromise = null;
    this.commandQueue = Promise.resolve();
    this.startupPromise = new Promise(resolve => {
      this.resolveStartup = resolve;
    });
    this.eventHandlers = new Map([["ended", []], ["error", []], ["input", []], ["loading", []], ["marker", []], ["metadata", []], ["muted", []], ["offline", []], ["output", []], ["pause", []], ["play", []], ["playing", []], ["reset", []], ["resize", []], ["ready", []], ["seeked", []]]);
  }
  init() {
    if (this.initPromise === null) {
      this.initPromise = this._init();
    }
    return this.initPromise;
  }
  terminalReady() {
    this.resolveStartup();
  }
  async _init() {
    // Wait until Terminal has installed VT event listeners before drivers start dispatching.
    await this.startupPromise;
    this.driver = this.driverFactory({
      dispatch: this._dispatchEvent.bind(this),
      logger: this.logger
    }, {
      cols: this.cols,
      rows: this.rows,
      speed: this.speed,
      idleTimeLimit: this.idleTimeLimit,
      startAt: this.startAt,
      preload: this.preload,
      loop: this.loop,
      poster: this.autoPlay ? undefined : this.poster,
      markers: this.markers,
      pauseOnMarkers: this.pauseOnMarkers,
      audioUrl: this.audioUrl
    });
    const config = {
      isPausable: !!this.driver.pause,
      isSeekable: !!this.driver.seek
    };
    this._installDriverDefaults();
    if (this.driver.init) {
      await this.driver.init();
    }
    if (this.autoPlay) {
      await this.driver.play();
    }
    this._dispatchEvent("ready", config);
  }
  _installDriverDefaults() {
    if (this.driver.stop === undefined) {
      this.driver.stop = () => {};
    }
    if (this.driver.pause === undefined) {
      this.driver.pause = () => {};
    }
    if (this.driver.seek === undefined) {
      this.driver.seek = _where => false;
    }
    if (this.driver.step === undefined) {
      this.driver.step = _n => {};
    }
    if (this.driver.mute === undefined) {
      this.driver.mute = () => {};
    }
    if (this.driver.unmute === undefined) {
      this.driver.unmute = () => {};
    }
    if (this.driver.getDuration === undefined) {
      this.driver.getDuration = () => {};
    }
    if (this.driver.getCurrentTime === undefined) {
      const play = this.driver.play;
      let clock = new NullClock();
      this.driver.play = () => {
        clock = new Clock(this.speed);
        return play();
      };
      this.driver.getCurrentTime = () => {
        const t = clock.getTime();
        return typeof t === "number" ? t / 1000 : t;
      };
    }
  }
  _enqueue(command) {
    const run = async () => {
      await this.init();
      return command.call(this);
    };
    const result = this.commandQueue.then(run, run);
    this.commandQueue = result.catch(() => {});
    return result;
  }
  play() {
    return this._enqueue(function () {
      return this.driver.play();
    });
  }
  pause() {
    return this._enqueue(function () {
      return this.driver.pause();
    });
  }
  seek(where) {
    return this._enqueue(function () {
      return this.driver.seek(where);
    });
  }
  step(n) {
    return this._enqueue(function () {
      return this.driver.step(n);
    });
  }
  stop() {
    return this._enqueue(function () {
      return this.driver.stop();
    });
  }
  mute() {
    return this._enqueue(function () {
      return this.driver.mute();
    });
  }
  unmute() {
    return this._enqueue(function () {
      return this.driver.unmute();
    });
  }
  getCurrentTime() {
    if (!this.driver) {
      return 0;
    }
    return this.driver.getCurrentTime();
  }
  getRemainingTime() {
    const duration = this.getDuration();
    if (typeof duration === "number") {
      return duration - Math.min(this.getCurrentTime(), duration);
    }
  }
  getProgress() {
    const duration = this.getDuration();
    if (typeof duration === "number") {
      return Math.min(this.getCurrentTime(), duration) / duration;
    }
  }
  getDuration() {
    if (!this.driver) {
      return undefined;
    }
    return this.driver.getDuration();
  }
  addEventListener(eventName, handler) {
    this.eventHandlers.get(eventName).push(handler);
  }
  removeEventListener(eventName, handler) {
    const handlers = this.eventHandlers.get(eventName);
    if (!handlers) return;
    const idx = handlers.indexOf(handler);
    if (idx !== -1) handlers.splice(idx, 1);
  }
  _dispatchEvent(eventName, data = {}) {
    for (const handler of [...this.eventHandlers.get(eventName)]) {
      try {
        handler(data);
      } catch (error) {
        this.logger.error(`event handler for "${eventName}" failed`, error);
        if (typeof globalThis.reportError === "function") {
          globalThis.reportError(error);
        } else {
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
    }
  }
  _parsePoster(poster) {
    if (typeof poster !== "string") return;
    if (poster.substring(0, 16) == "data:text/plain,") {
      return {
        type: "text",
        value: poster.substring(16)
      };
    } else if (poster.substring(0, 4) == "npt:") {
      return {
        type: "npt",
        value: parseNpt(poster.substring(4))
      };
    }
    return;
  }
}
const DRIVERS = new Map([["benchmark", benchmark], ["clock", clock], ["eventsource", eventsource], ["random", random], ["recording", recording], ["websocket", websocket]]);
const PARSERS = new Map([["asciicast", parse$2], ["typescript", parse$1], ["ttyrec", parse]]);
function getDriver(src) {
  if (typeof src === "function") return src;
  if (typeof src === "string") {
    if (src.substring(0, 5) == "ws://" || src.substring(0, 6) == "wss://") {
      src = {
        driver: "websocket",
        url: src
      };
    } else if (src.substring(0, 6) == "clock:") {
      src = {
        driver: "clock"
      };
    } else if (src.substring(0, 7) == "random:") {
      src = {
        driver: "random"
      };
    } else if (src.substring(0, 10) == "benchmark:") {
      src = {
        driver: "benchmark",
        url: src.substring(10)
      };
    } else {
      src = {
        driver: "recording",
        url: src
      };
    }
  }
  if (src.driver === undefined) {
    src.driver = "recording";
  }
  if (src.driver == "recording") {
    if (src.format !== "segmented" && src.parser === undefined) {
      src.parser = "asciicast";
    }
    if (typeof src.parser === "string") {
      if (PARSERS.has(src.parser)) {
        src.parser = PARSERS.get(src.parser);
      } else {
        throw new Error(`unknown parser: ${src.parser}`);
      }
    }
  }
  if (DRIVERS.has(src.driver)) {
    const driver = DRIVERS.get(src.driver);
    return (callbacks, opts) => driver(src, callbacks, opts);
  } else {
    throw new Error(`unsupported driver: ${JSON.stringify(src)}`);
  }
}

export { Core as C };
