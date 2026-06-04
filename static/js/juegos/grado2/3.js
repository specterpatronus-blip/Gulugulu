(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=utils.rnd(15,49),b=utils.rnd(15,49);g.a=a;g.b=b;const ans=a+b;g.opts=utils.shuffle([ans,ans+1,ans+10,Math.max(1,ans-1)]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.a+g.b)win();else utils.shake(e.target);
    }
  };
})();