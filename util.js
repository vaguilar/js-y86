/* Constants */
var instr2len = [1, 1, 2, 6, 6, 6, 2, 5, 5, 1, 2, 2, 1, 4],
	num2reg = ['%eax', '%ecx', '%edx', '%ebx','%esp', '%ebp', '%esi', '%edi'],
	reg2num = {'%eax': 0, '%ecx': 1, '%edx': 2, '%ebx': 3,'%esp': 4, '%ebp': 5, '%esi': 6, '%edi': 7},
	instr2len = { 'halt': 1, 'nop': 1, 'rrmovl': 2, 'irmovl': 6, 'rmmovl': 6, 'mrmovl': 6, 
		'addl': 2, 'subl': 2, 'andl': 2, 'xorl': 2, 'jmp': 5, 'jg': 5, 'jge': 5, 'je': 5, 
		'jne': 5, 'jl': 5, 'jle': 5, 'call': 5, 'ret': 1, 'pushl': 2, 'popl': 2, '.byte': 1, '.long': 4
	},
	instr2num = { 'halt': 0, 'nop': 1, 'rrmovl': 2, 'irmovl': 3, 'rmmovl': 4, 'mrmovl': 5, 
		'addl': 6, 'subl': 6, 'andl': 6, 'xorl': 6, 'jmp': 7, 'jg': 7, 'jge': 7, 'je': 7, 
		'jne': 7, 'jl': 7, 'jle': 7, 'call': 8, 'ret': 9, 'pushl': 10, 'popl': 11, '.byte': 12, '.long': 13
	},
	instr2fn = { 'addl': 0, 'subl': 1, 'andl': 2, 'xorl': 3, 'jmp': 0, 'jg': 1,
		'jge': 2, 'je': 3, 'jne': 4, 'jl': 5, 'jle': 6,
	};

function nodejs() {
	return typeof module !== 'undefined' && module.exports;	
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
	var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    
    var O = Object(this);
    
    var len = O.length >>> 0;
    
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }
    
    if (thisArg) {
      T = thisArg;
    }
    
    A = new Array(len);
    k = 0;
    while(k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[ k ];
        mappedValue = callback.call(T, kValue, k, O);
        A[ k ] = mappedValue;
      }
      k++;
    }
    return A;
  };      
}

function isRegister(str) {
	if (str[0] === "%") {
		if (str in reg2num) {
			return reg2num[str];
		} else {
			throw Exception("No such register " + str);
		}
	}
	return false;
}

function isValue(str) {
	var hex;
		console.log(str);
	if (str[0] === "$" && /\d+/.test(str.substring(1))) {
		hex = int2hex(str.substring(1), 8);
		return switchEndian(hex);

	} else if (str[0] === "0" && str[1] === "x" && /[\dabcdef]+/i.test(str.substring(2))) {
		hex = parseInt(str.substring(2), 16); 
		hex = int2hex(hex, 8);
		return switchEndian(hex);

	} else if (str === "0") {
		hex = int2hex("0", 8);
		return switchEndian(hex);
	}

	return false;
}

function isOffset(str) {
	try {
		var split  = str.split("("),
			offset = isValue(split[0]),
			reg	   = isRegister(split[1].substr(0, split[1].length - 1));
			return [offset, reg];
	} catch (e) {
		return false;
	}
}

function isDest(str) {
	return false;
}

function switchEndian(hexstr) {
	var i, result = '';
	if(hexstr.length % 2 === 1){
		hexstr = '0' + hexstr;
	}
	for (i = hexstr.length; i > 0; i -= 2){
		result += hexstr.substr(i - 2, 2);
	}
	return result;
}

function int2hex(num, width) {
	if (typeof num === "string") {
		num = parseInt(num);
	}

	if (arguments.length === 2) {
		var i, hex = num.toString(16);
		for (i = hex.length; i < width; i++) {
			hex = "0" + hex;
		}
		return hex;
	} else if (arguments.length === 1) {
		return num.toString(16);
	} else {
		return 0;
	}
}
