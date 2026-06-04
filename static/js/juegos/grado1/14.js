(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ns=[1,2,3,4,5];g.buttons=utils.shuffle([...ns]).map(n=>({num:n,correct:false}));g.expected=1;
    },
    play: (v, e, g, utils, win, score) => {
      if(v.num===g.expected){v.correct=true;score.value++;g.expected++;if(score.value===5)win();}else utils.shake(e.target);
    }
  };
})();