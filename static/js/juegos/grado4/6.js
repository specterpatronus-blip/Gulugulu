(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{r:'IX',v:9},{r:'XIV',v:14},{r:'XXVI',v:26},{r:'XL',v:40},{r:'LII',v:52}];const s=d[utils.rnd(0,4)];g.rom=s.r;g.ans=s.v;g.opts=utils.shuffle([s.v,s.v+1,s.v-1,s.v+10]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();