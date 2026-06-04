(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ds = [
        { icon: 'arrow_right', dir: 'right', label: 'DERECHA' },
        { icon: 'arrow_left',  dir: 'left',  label: 'IZQUIERDA' }
      ];
      const t = ds[utils.rnd(0, 1)];
      g.targetIcon = t.icon;
      g.dir        = t.dir;
      g.options    = utils.shuffle([
        { dir: 'left',  label: '⬅ IZQ.' },
        { dir: 'right', label: 'DER. ➡' }
      ]);
    },
    play: (v, e, g, utils, win, score) => {
      if (v === g.dir) win(); else utils.shake(e.target);
    }
  };
})();