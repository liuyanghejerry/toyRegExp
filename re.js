var pattern = process.argv[2];
var text = process.argv[3];
var options = {
  'partial': true
};

if (process.argv.length === 4) {
  console.log(testRegExp(pattern, text, options));
}

function testRegExp(reg, text, options) {
  return runNFA(text, buildNFA(reg, options), options);
}


function NFAFragment() {
  return {
    'label': null,
    'next': {},
    'fin': false,
    'transparent': false
  };
}

function buildNFA(pattern, options) {
  var global_context = {
    'machines': [],
    'pattern': pattern,
  };

  start_thread(global_context, 0);
  return global_context.machines;


  function is_basic_meta (target) {
    var basic_meta = '?+*|.\\';
    return is_in_string(target, basic_meta);
  }

  function proc_basic_meta (context, char) {    
    switch(char) {
      case '.':
      (function(){
        var state = NFAFragment();
        state.label = '.';
        if (!context.machine) {
          context.machine = context.last_state = state;
          context
          return;
        }
        context.last_state = state;
      })();
      break;
      case '\\':
      (function(){
        context.pattern_index++;
        var next_char = context.pattern[context.pattern_index];
        proc_normal_char(context, next_char);
      })();
      break;
      case '*':
      {
        context.last_state.transparent = true;
        context.last_state.next[ context.last_state.label ] = context.last_state;
      }
      break;
      case '+':
      (function(){
        // e+ -> ee*
        var state = NFAFragment();
        state.label = context.last_state.label;
        var next_state = NFAFragment();
        next_state.label = state.label;
        next_state.transparent = true;
        next_state.next[next_state.label] = next_state;
        state.next[state.label] = next_state;
        context.last_state = next_state;
      })();
      break;
      case '?':
      {
        context.last_state.transparent = true;
      }
      break;
      case '|':
      (function(){
        context.stop = true;
        start_thread(global_context, context.pattern_index+1);
      })();
      break;
    }
  }

  function proc_normal_char (context, char) {
    var state = NFAFragment();
    state.label = char;
    if (!context.machine) {
      context.machine = context.last_state = state;
      return;
    }

    context.last_state = context.last_state.next[ char ] = state;
  }

  function start_thread (global_context, start_pos) {
    var context = {
      'stop': null,
      'machine': null,
      'last_state': null,
      'pattern': global_context.pattern,
      'pattern_index': start_pos
    };
    for (context.pattern_index = start_pos; !context.stop && context.pattern_index < context.pattern.length; context.pattern_index++) {
      if( is_basic_meta(context.pattern[context.pattern_index]) ) {
        proc_basic_meta(context, context.pattern[context.pattern_index]);
        continue;
      }
      proc_normal_char(context, context.pattern[context.pattern_index]);
    }
    context.last_state.fin = true;
    global_context.machines.push(context.machine);
  }
}

function runNFA(text, machine_list, options) {
  for(var i=0; i<machine_list.length; ++i) {
    if (try_machine(text, machine_list[i], options)) {
      return true;
    }
  }
  return false;

  function try_machine(text, machine, options) {
    var text_cur = 0;
    var current_state = null;
    var match_result = null;
    var match_result2 = null;
    if (is_empty_machine(machine)) {
      return true;
    }

    while (text_cur <= text.length - 1) {
      if(!current_state) {
        match_result = match_label(machine, text[text_cur]);
        match_result2 = machine.transparent ? match_subs(machine, text[text_cur]) : false;
        if (!!match_result ) {
          current_state = match_result;
        } else if(!!match_result2) {
          current_state = match_result2;
        }
        text_cur++;
        continue;
      }
      // FIN
      if (is_finnal(current_state)) {
        return true;
      }
      match_result = match_subs(current_state, text[text_cur]);
      if (!!match_result) {
        current_state = match_result;
        text_cur++;
        continue;
      } else {
        if (options && options.partial) {
          current_state = null;
          continue;
        }
      }
    }

    if (!!current_state && is_finnal(current_state)) {
      return true;
    } else {
      return false;
    }

    function match_subs(state, char) {
      for (var key in state.next) {
        if(char === key) {
          return state.next[key];
        }
        if (state.next[key] === state) {
          continue;
        }
        if(state.transparent) {
          var result = match_subs(state.next[key], char);
          if (!!result) {
            return result;
          }
        }
      }
      return false;
    }

    function match_label(state, char) {
      return (state.label === char || state.label === '.') && state;
    }

    function is_finnal(state) {
      if (state.fin || is_empty(state.next)) {
        return true;
      }

      if (!!state.transparent) {
        for(var key in state.next) {
          if (state.next[key] !== state && is_finnal(state.next[key])) {
            return true;
          }
        }
      }

      for(var key in state.next) {
        var st = state.next[key];
        if (st !== state && st.transparent && is_finnal(st)) {
          return true;
        }
      }
      return false;
    }

    function is_empty_machine(machine) {
      if (machine.transparent) {
        for(var key in machine.next) {
          if (is_finnal(machine.next[key])) {
            return true;
          }
        }
      }
      return false;
    }
  }
}

function is_empty(obj) {

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

function is_in_string(target, string) {
  for (var i = 0; i < string.length; i++) {
    if(string[i] === target) {
      return true;
    }
  }
  return false;
}

// stub
function printNFA(machine, level) {
  level = level || 0;
  var line = '';
  for (var i = 0; i < level; i++) {
    line += '\t';
  }
  line += machine.label;
  console.log(line);
  for(var key in machine.next) {
    if (!machine.next.hasOwnProperty(key)) {
      continue;
    }
    printNFA(machine.next[key], level+1);
  }
}

module.exports = {
  'test': testRegExp,
  'buildNFA': buildNFA,
  'runNFA': runNFA
};
