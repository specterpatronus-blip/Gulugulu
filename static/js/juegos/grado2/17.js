(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.words=[{e:'🏠',w:'CA _ A',o:['SA','TA','PA'],a:'SA'},{e:'🍅',w:'TO _ TE',o:['MA','ME','MI'],a:'MA'},{e:'👕',w:'CA _ SA',o:['MI','MU','ME'],a:'MI'},{e:'🍌',w:'PLÁ _ NO',o:['TA','TE','TI'],a:'TA'}];const w=g.words[utils.rnd(0,g.words.length-1)];g.emoji=w.e;g.word=w.w;g.opts=utils.shuffle(w.o);g.ans=w.a;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();