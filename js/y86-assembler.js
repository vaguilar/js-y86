var MEM = {},			//Memory
	REG = {				//Registers
		'%eax': 0,
		'%ecx': 0,
		'%edx': 0,
		'%ebx': 0,
		'%esp': 0,
		'%ebp': 0,
		'%esi': 0,
		'%edi': 0
	},
	CC = {
		'n': 0,
		'p': 0,
		'z': 0,
	},					//Condition Codes
	PC = 0,				//Program Counter
	MC = 0,				//Memory Counter
	ASSEM = {},			//Assembling functions
	EXEC = {},			//Executing functions
	SYM = {};			//Symbol table

	ASSEM['nop'] = function(){ return '00'; };
	EXEC[0] = function(){ return 0; };

	ASSEM['halt'] = function(){ return '10'; };
	EXEC[0x10] = function(){ return 0; };

	ASSEM['rrmovl'] = function(args){ 
		var temp  = '20';
			temp += reg2num[args[1]];
			temp += reg2num[args[0]];

		return temp; 
	};
	EXEC[0x20] = function(instruction){
		var rA = (0x00F0 & instruction) >> 4,
			rB = 0x000F & instruction;

		REG[rB] = REG[rA];

		return 0;
	};

	ASSEM['irmovl'] = function(args){ 
		var temp  = '308'
			temp += reg2num[args[1]]
			temp += dec2hex(evalImmediate(args[0]), 8);
		error(args[1] + temp);
		
		return temp; 
	};
	EXEC[0x30] = function(instruction){
		var V = (0xFFFFFFFF & instruction),
			rB = (0xF00000000 & instruction) >> 8;

		REG[rB] = V;

		return 0;
	};

reg2num = {
		'%eax': 0,
		'%ecx': 1,
		'%edx': 2,
		'%ebx': 3,
		'%esp': 4,
		'%ebp': 5,
		'%esi': 6,
		'%edi': 7
	};

//Input is a str
//Returns address number
function evalImmediate(str){

	var result = 0;

	if( str.match(/\$\d+/) ){
		result = parseInt(str.substr(1));
	
	}else if(str.match(/\$-\d+/)){
		result = parseInt(str.substr(1));
		result += 0xFFFFFFFF + 1
		
	}else if(str in SYM){
		result = SYM[str];
	}

	error(str + ' ' + result);
	return result;

}

//Convert number to hex format with minimum str length n
function dec2hex(x, n){
	if(typeof x !== "number"){ return x; }
            
	n = typeof n !== 'undefined' ? n : 4;

	var temp = x.toString(16);
	for(var i = temp.length; i < n; i++){
		temp = '0' + temp;
	} 

	return temp;
}


//Takes in y86 code as a string
//Returns assembled code in bytes array
function assemble(str){
	var result = [];
	var lines = str.split('\n');

	//First pass, create symbol table
	for(var lineNum in lines){
		var line = lines[lineNum].trim().replace(/#.*/g, ''),
			symbol = line.search(/^.*:/);

			if(symbol > -1){
				symbol = line.replace(/:.*$/, '');
				SYM[symbol] = parseInt(lineNum);
				lines[lineNum] = line.replace(/^.*:/, '');
			}

	}

	//Second pass, call assembling function
	for(var lineNum in lines){
		var line = lines[lineNum].replace(/#.*/g, '').trim(),
			instruction = line.replace(/ .*/g, ''),
			args = line.replace(/^.*? /g, '').split(/\s*,\s*/),
			assembled;
		
		if(line === ""){
			assembled = "";

		}else if(instruction in ASSEM){
			assembled = ASSEM[instruction](args);

		}else{
			assembled = line;

		}

		result.push(assembled);
	}

	return result;
}

//Input: byte array of instructions
//Return: 0 on success or error message
function execute(arr){
	
	return 0;
}

//Display error
function error(x){
	return console.log(x);
}
