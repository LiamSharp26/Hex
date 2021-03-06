function doResizeCanvas(min) {
   var scale, scale_x, scale_y;
   scale_x = innerWidth / game_width();
   scale_y = innerHeight / game_height();
   scale = Math.min(Math.min(scale_x, scale_y), 1);
   scale = Math.round(scale*10)/10;
   window.game_scale = scale;
   document.getElementById('canvas').width = scale*game_width();
   document.getElementById('canvas').height = scale*game_height();
   return window.requestAnimationFrame(doResizeCanvas);
}

function engine_draw() {
    if (document.getElementById('canvas').getContext) {
        var ctx = document.getElementById('canvas').getContext('2d');
    } else {
        alert("BROWSER UNSUPPORTED");
    }
    ctx.fillStyle = game_background();
    ctx.fillRect(0, 0, document.getElementById('canvas').width, document.getElementById('canvas').height);
    ctx.save()
    ctx.scale(game_scale, game_scale);
    game_draw(ctx, window.game);
    ctx.restore()
    updatePressed();
    updateMouse();
    window.requestAnimationFrame(engine_draw);
}

function engine_init() {
    document.getElementById('canvas').width = game_width();
    document.getElementById('canvas').height = game_height();
    document.getElementById('body').style = "background-color:" + game_wbackground() + ";"
    game_init(window.game);
    engine_draw();
}

/*BONUS FUNCTION*/
function log(x) {
    console.log(x);
}

function show(x) {
    console.log(x);
}

/*INITIALIZE GAME*/
window.game = {};
window.game.keys = new Array();

/* KEY CONSTS */
window.InputCodes = {
   "space": 32,
   "left": 37,
   "up": 38,
   "right": 39,
   "down": 40,
   "shift": 16,
   "tab": 9,
   "enter": 13,
   "backspace": 8,
   "tab": 9,
   "tilde": 192,
   "alt": 18,
   "control": 17,
   "delete": 46,
   "home": 36,
   "end": 35,
   "comma": 188,
   "period": 190,
   "escape": 27
}

/*KEYBOARD CHECKING*/
for (var i = 0; i < 300; i++) {
    window.game.keys[i] = false;
}
document.onkeydown = function(e) {
    e = e || window.event;
    var code = e.keyCode;
    if (window.game.keys[code] == 0) {
        window.game.keys[code] = 2;
    }
};

document.onkeyup = function(e) {
    e = e || window.event;
    var code = e.keyCode;
    window.game.keys[code] = 0;
};

function doGetKeys() {
  return true
}

function key(x) {
  if (InputCodes[x] != undefined) {
    x = InputCodes[x]
  } else {
    x = x.charCodeAt(0) - 32
  }
  return getKey(x, true)
}

function keyPressed(x, raw) {
  if (InputCodes[x] != undefined) {
    x = InputCodes[x]
  } else {
    x = x.charCodeAt(0) - 32
  }
  return getKeyPressed(x, true)
}

function getKey(x, raw) {
    if (!doGetKeys())
      return false
    if (!(window.document.getElementById('left') == document.activeElement || window.document.getElementById('right') == document.activeElement)) {
        var c = !raw ? x.charCodeAt(0) : x
        return window.game.keys[c] > 0;
    }
}

function getKeyPressed(x, raw) {
  if (!doGetKeys())
    return false
  if (!(window.document.getElementById('left') == document.activeElement || window.document.getElementById('right') == document.activeElement)) {
      var c = !raw ? x.charCodeAt(0) : x
      return window.game.keys[c] == 2 ? true : false;
    }
}

function updatePressed(x) {
    for (var i = 0; i < 300; i++) {
        window.game.keys[i] = window.game.keys[i] == 2 ? 1 : window.game.keys[i];
    }
}

/* MOUSE CHECKING */
mouse = {
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    middle: 0
};

document.onmousemove = function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

document.onmousedown = function(e) {
    if (e.button == 0 && mouse.left == 0) {
        mouse.left = 2;
    }
    if (e.button == 1 && mouse.middle == 0) {
        mouse.middle = 2;
    }
    if (e.button == 2 && mouse.right == 0) {
        mouse.right = 2;
    }
}

document.onmouseup = function(e) {
    if (e.button == 0) {
        mouse.left = 0;
    }
    if (e.button == 1) {
        mouse.middle = 0;
    }
    if (e.button == 2) {
        mouse.right = 0;
    }
}

function updateMouse() {
    mouse.left = mouse.left == 2 ? 1 : mouse.left;
    mouse.middle = mouse.middle == 2 ? 1 : mouse.middle;
    mouse.right = mouse.right == 2 ? 1 : mouse.right;
}

//DISABLE TABBING OUT IN TEXTAREA
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for (var i = 0; i < count; i++) {
        textareas[i].onkeydown = function(e) {
            if (e.keyCode == 9 || e.which == 9) {
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s + 1;
            }
        }
    }

//CSS CLASSESS
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

//NOTIFICATIONS
function noteRed(x) {
   alertify.success(x || "");
}

function noteBlue(x) {
   alertify.error(x || "");
}

function note(x, col, override) {
    x = JSON.stringify(x)
    if (override == undefined)
    override = true
    let notifier = document.getElementsByClassName("alertify-notifier")[0];
    if (notifier != undefined && override) {
    for (i=0;i<notifier.children.length;i++) {
      if (notifier.children[i].innerHTML == x) {
        return null;
     }
    }
  }
   if (col == "red" || col == 0) {
      noteRed(x);
      return;
   }
   if (col == "blue" || col == 1) {
      noteBlue(x);
      return;
   }
   alertify.warning(x || "");
}
