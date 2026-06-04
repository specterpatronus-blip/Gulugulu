(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=60,b=60;g.a=a;g.b=b;g.ans=180-(a+b);g.opts=utils.shuffle([g.ans,90,45,100]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();