(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const f=[{s:'1/2',v:0.5,o:['2/4','3/6','4/8']},{s:'1/3',v:0.33,o:['2/6','3/9','4/12']},{s:'2/3',v:0.66,o:['4/6','6/9','8/12']},{s:'1/4',v:0.25,o:['2/8','4/16','3/12']}];const s=f[utils.rnd(0,f.length-1)];g.frac=s.s;const a=s.o[utils.rnd(0,2)];g.answer=a;g.opts=utils.shuffle([a,'1/5','2/3','3/4','5/2'].filter(x=>x!==a && x!==s.s).slice(0,3).concat(a));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.answer)win();else lose();
    }
  };
})();