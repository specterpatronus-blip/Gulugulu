(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const shs=['circle','square','change_history','star'];const s1=shs[utils.rnd(0,3)];let s2=shs[utils.rnd(0,3)];while(s2===s1)s2=shs[utils.rnd(0,3)];g.seq=[s1,s2,s1];g.ans=s2;g.color=['#EF4444','#3B82F6','#10B981','#8B5CF6'][utils.rnd(0,3)];let o=[s2,s1];const r=shs.filter(x=>x!==s1&&x!==s2);o.push(r[0]);g.options=utils.shuffle(o);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();