(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.a=utils.rnd(10,40);g.b=utils.rnd(5,20);if(Math.random()>.5){g.ans=g.a+g.b;g.sign='+';}else{g.ans=g.a-g.b;g.sign='-';}
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.sign)win();else utils.shake(e.target);
    }
  };
})();