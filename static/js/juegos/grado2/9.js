(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{p:['ca','_','po'],a:'m',o:['m','n','p']},{p:['ta','_','bor'],a:'m',o:['m','n','b']},{p:['so','_','bra'],a:'m',o:['m','n','b']},{p:['ba','_','co'],a:'n',o:['n','m','b']},{p:['que','_','o'],a:'s',o:['s','c','z']}];const w=ws[utils.rnd(0,ws.length-1)];g.parts=w.p;g.ans=w.a;g.opts=utils.shuffle(w.o);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();