(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=utils.rnd(20,50),b=utils.rnd(10,40);g.a=a;g.b=b;const ans=a+b;g.ans=ans;g.opts=utils.shuffle([ans,ans+10,ans-10,ans+1]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();