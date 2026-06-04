(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      // Define planets with distinct emojis
      g.planets=['🌑Mercurio','🌕Venus','🌍Tierra','🔴Marte','🟠Júpiter','🪐Saturno','💎Urano','🔵Neptuno'];
      g.shuffled=utils.shuffle([...g.planets]);
      g.placed=[];
    },
    play: (v, e, g, utils, win, score, lose) => {
      // Robust comparison using the planet name part to avoid emoji-related mismatch
      const expStr = g.planets[g.placed.length];
      const getName = (s) => s.replace(/[^\wÁÉÍÓÚáéíóú]/g, '');
      
      if(getName(v) === getName(expStr)){
        g.placed.push(v);
        if(g.placed.length === g.planets.length) win();
      } else {
        g.placed = [];
        lose();
      }
    }
  };
})();