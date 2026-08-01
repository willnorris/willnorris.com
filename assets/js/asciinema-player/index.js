import { C as Core } from './core-BpMsaxjJ.js';
import { c as coreOpts, m as mount, u as uiOpts } from './opts-BxeD04BP.js';
import { D as DummyLogger } from './logging-Bg1womcE.js';

function create(src, elem, opts = {}) {
  const logger = opts.logger ?? new DummyLogger();
  const core = new Core(src, coreOpts(opts, {
    logger
  }));
  const onTerminalReady = () => core.terminalReady();
  const {
    el,
    dispose
  } = mount(core, elem, uiOpts(opts, {
    logger,
    onTerminalReady
  }));
  const ready = core.init();
  void ready.catch(() => {});
  const player = {
    el,
    dispose,
    getCurrentTime: () => core.getCurrentTime(),
    getDuration: () => core.getDuration(),
    play: () => core.play(),
    pause: () => core.pause(),
    seek: pos => core.seek(pos)
  };
  player.addEventListener = (name, callback) => {
    return core.addEventListener(name, callback.bind(player));
  };
  return player;
}

export { create };
