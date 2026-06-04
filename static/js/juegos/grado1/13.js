(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const shs=['leaf','flower','star','heart','apple'];const c=shs[utils.rnd(0,4)];let d=shs[utils.rnd(0,4)];while(d===c)d=shs[utils.rnd(0,4)];g.ans=d;let arr=[{icon:c,color:'#3B82F6'},{icon:c,color:'#3B82F6'},{icon:c,color:'#3B82F6'},{icon:d,color:'#EF4444'}];g.options=utils.shuffle(arr);
    },
    play: (v, e, g, utils, win, score) => {
      if(v.icon===g.ans)win();else utils.shake(e.target);
    }
  };
})();