(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=utils.rnd(30,80),b=utils.rnd(10,29);g.a=a;g.b=b;const ans=a-b;g.ans=ans;g.opts=utils.shuffle([ans,ans+5,Math.max(1,ans-5),ans+10]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();