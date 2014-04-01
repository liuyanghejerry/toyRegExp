var logger = require('tracer').console();

var pattern = process.argv[2];
var text = process.argv[3];
// logger.log(pattern, text);

var machine = buildNFA(pattern);
logger.log(machine, runNFA(text, machine));

function NFAFragment() {
  return {
    label: null,
    next: {}
  };
}

function buildNFA(pattern) {
  var context = {
    machine: null,
    last_state: null,
    pattern: pattern
  };

  for (var i = 0; i < context.pattern.length; i++) {
    if( is_basic_meta(context.pattern[i]) ) {
      proc_basic_meta(context, context.pattern[i]);
      continue;
    }
    proc_normal_char(context, context.pattern[i]);
  }

  return context.machine;


  function is_basic_meta (target) {
    var basic_meta = '?+*|().\\';
    return is_in_string(target, basic_meta);
  }

  function proc_basic_meta (context, char) {
    // body...
  }

  function proc_normal_char (context, char) {
    var state = NFAFragment();
    state.label = char;
    if (!context.machine) {
      context.last_state = context.machine = state;
      return;
    }

    context.last_state = context.last_state.next[ char ] = state;
  }

  function is_in_string(target, string) {
    for (var i = 0; i < string.length; i++) {
      if(string[i] === target) {
        return true;
      }
    }
    return false;
  }
}

function runNFA(text, machine) {
  // debugger;
  var text_cur = 0;
  var current_state = null;
  while (text_cur <= text.length - 1) {
    if(!current_state) {
      if(machine.label === text[text_cur]) {
        current_state = machine;
      }
      text_cur++;
      continue;
    }
    // FIN
    if (isEmpty(current_state.next)) {
      return true;
    }
    var match_result = match_labels(current_state, text[text_cur]);
    if (!!match_result) {
      current_state = current_state.next[match_result];
      text_cur++;
      continue;
    } else {
      current_state = null;
      // text_cur--;
      continue;
    }
  }

  if (!!current_state && isEmpty(current_state.next)) {
    return true;
  } else {
    return false;
  }

  function match_labels(state, char) {
    for (var key in state.next) {
      if(char === key) {
        return key;
      }
    }
    return false;
  }
}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

// function buildNFA(pattern) {
//   var machine = null;
//   var context = {
//     cursor: 0,
//     queue: []
//   };
//   while(context.cursor < pattern.length) {
//     // handle basic meta
//     if (is_basic_meta(pattern[context.cursor])) {
//       process_basic_meta(pattern[context.cursor], context);
//     }

//     process_normal(pattern[context.cursor], context);
//   }

//   return context;

//   function process_normal(target, context) {
//     var step = function (char) {
//       return target === char;
//     }
//     context.queue.push(step);
//     context.cursor++;
//   }

//   function process_basic_meta() {
//     context.cursor++;
//   }

//   function is_basic_meta (target) {
//     var basic_meta = '*|().\\';
//     return is_in_string(target, basic_meta);
//   }

//   // // meta only appear in []
//   // function is_square_meta (target) {
//   //   var meta = '-';
//   //   return is_in_string(target, meta);
//   // }

//   // // meta only appear in {}
//   // function is_brace_meta (target) {
//   //   var meta = ',';
//   //   return is_in_string(target, meta);
//   // }

//   function is_in_string(target, string) {
//     for (var i = 0; i < string.length; i++) {
//       if(string[i] === target) {
//         return true;
//       }
//     }
//     return false;
//   }
  
// }

// function runNFA(machine, text) {
//   var j = 0;
//   var i = 0;
//   while (j <= machine.queue.length - 1 && i <= text.length -1) {
//     logger.log(j, i);
//     if(!machine.queue[j](text[i])) {
//       if (i === 0) {
//         j = 0;
//         continue;
//       }
//       return false;
//     }
//     i++;
//     j++;
//   }

//   return true;
// }