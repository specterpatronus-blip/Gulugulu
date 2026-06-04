(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const shs=[{icon:'circle',color:'#EF4444'},{icon:'square',color:'#3B82F6'},{icon:'change_history',color:'#10B981'},{icon:'star',color:'#F59E0B'}];const t=shs[utils.rnd(0,3)];g.targetIcon=t.icon;g.options=utils.shuffle([...shs]);
    },
    play: (v, e, g, utils, win, score) => {
      if(v.icon===g.targetIcon)win();else utils.shake(e.target);
    }
  };
})();