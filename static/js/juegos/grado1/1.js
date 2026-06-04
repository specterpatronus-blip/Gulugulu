(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ics=['pets','eco','favorite','star','lightbulb','rocket_launch'];const cls=['#EF4444','#10B981','#F472B6','#F59E0B','#FBBF24','#3B82F6'];let d=[];ics.forEach((ic,i)=>{d.push({id:i*2,icon:ic,color:cls[i],isFlipped:false,isMatched:false});d.push({id:i*2+1,icon:ic,color:cls[i],isFlipped:false,isMatched:false});});g.cards=utils.shuffle(d);g.flipped=[];g.locked=false;g.matches=0;
    },
    play: (v, e, g, utils, win, score) => {
      if(g.locked||g.cards[v].isFlipped||g.cards[v].isMatched)return;g.cards[v].isFlipped=true;g.flipped.push(v);if(g.flipped.length===2){g.locked=true;const c1=g.cards[g.flipped[0]],c2=g.cards[g.flipped[1]];if(c1.icon===c2.icon){setTimeout(()=>{c1.isMatched=c2.isMatched=true;g.flipped=[];g.locked=false;g.matches++;if(g.matches===6)win();},400);}else{setTimeout(()=>{c1.isFlipped=c2.isFlipped=false;g.flipped=[];g.locked=false;},1000);}}
    }
  };
})();