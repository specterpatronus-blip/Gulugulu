(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ps=[{U:'A',l:'a'},{U:'B',l:'b'},{U:'C',l:'c'},{U:'D',l:'d'},{U:'E',l:'e'}];const t=ps[utils.rnd(0,4)];g.target=t.U;g.ans=t.l;let o=[t.l];const r=ps.filter(p=>p.U!==t.U).map(p=>p.l);o.push(r[0],r[1]);g.options=utils.shuffle(o);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();