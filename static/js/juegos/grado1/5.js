(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const cs=['A','B','C','D','E'];g.buttons=utils.shuffle([...cs]).map(c=>({char:c,correct:false}));g.expected='A';
    },
    play: (v, e, g, utils, win, score) => {
      if(v.char===g.expected){v.correct=true;score.value++;g.expected=String.fromCharCode(g.expected.charCodeAt(0)+1);if(score.value===5)win();}else utils.shake(e.target);
    }
  };
})();