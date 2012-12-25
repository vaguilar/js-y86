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
		'z': 0,
		'p': 0
	},					//Condition Codes
	PC = 0,				//Program Counter
	MC = 0,				//Memory Counter
	SYM = {},			//Symbol table
	LEN = {				//Length of instructions
		'nop': 		1,
		'halt': 	1,
		'rrmovl': 	2,
		'irmovl': 	6,
		'rmmovl': 	6,
		'mrmovl': 	6,
		'addl': 	2,
		'subl': 	2,
		'andl': 	2,
		'xorl': 	2,
		'jmp': 		5,
		'jle': 		5,
		'jl': 		5,
		'je': 		5,
		'jne': 		5,
		'jge': 		5,
		'jg': 		5,
		'call': 	5,
		'ret': 		1,
		'pushl':	2,
		'popl':		2,
		'.long':	4
	},
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

function register(r){
	if(r in reg2num){ return reg2num[r]; }
	return error("Incorrect Register");
}

//Input: string num
//Return: num in interpreted base
function number(n){
	//Hex
	if(n.match(/0x[\da-fA-f]+/)){
		return parseInt(n.substring(2), 16);

	//Octal
	}else if(n.match(/0[0-7]+/)){
		return parseInt(n.substring(1), 8);

	//Dec
	}else if(n.match(/\d+/)){
		return parseInt(n);
	}

	error('Invalid number');
	return -1;
}

//Input: number OR hex str
//Returns hex str in little endian
function num2HexLE(number, length){
	var result = '';
	length = typeof length !== 'undefined' ? length : 4;
	str = typeof number !== 'number' ? number : number.toString(16);


	//Odd number of characters
	if(str.length % 2 == 1){
		str = '0' + str;
	}

	for(var i = 0; i <= str.length / 2; i++){
		result = str.substr(i * 2, 2) + result;
	}

	for(var i = result.length; i < length; i++){
		result += '0';
	} 

	return result;
}

/*
//Test
var tests = ['d', 'c0', 'b00', 'a000', 0xd, 0xc0, 0xb00, 0xa000];
for(i in tests){
	error(tests[i] + ' = ' + num2HexLE(tests[i]) );
}
*/

//Input: str offset e.g. 8(%eax)
//Returns: associative array with register, offset fields
function offset(str){

	if(!str.match(/\d*\(%e..\)/)){
		error('Invalid offset format');
	}

	var result = {};
		result['register'] 	= str.match(/\%e../)[0];
		result['offset'] 	= parseInt('0' + str.replace(/\(.*/, ''));

		return result;
}

//Input is a str
//Returns address number
function evaluate(str){

	var result = 0;

	if( str.match(/\$\d+/) ){
		result = parseInt(str.substr(1));
	
	//Number < 0 e.g $-1
	}else if(str.match(/\$-\d+/)){
		var num = parseInt(str.substr(1));
		error(num);
		result = num + 0xFFFFFFFF + 1;
		error(result);

	//Symbol
	}else if(str in SYM){
		result = SYM[str];

	//Register
	}else if(str.match(/\(%e..\)/)){
		var rA = register(str.match(/%e../));
		result = rA + toHex(0, 8);

	//Register plus offset e.g 8(%eax)
	}else if(str.match(/\d+\(\%e..\)/)){
		var offset = parseInt(str.replace(/\(.*/, ''));
		var rA = str.match(/\%e../);
		result = REG[rA] + toHex(offset, 8);

	//Malformed expression
	}else{
		error(str + ' ' + result);
	}
	
	return result;

}

//Convert number to hex format with at least 'length' digits
function toHex(x, length){
	if(typeof x !== "number"){ return x; }
            
	var temp = x.toString(16);
	length = typeof length !== 'undefined' ? length : 4;

	for(var i = temp.length; i < length; i++){
		temp = '0' + temp;
	} 

	return temp;
}


//Takes in y86 code as a string
//Returns assembled code in character array
function assemble(str){
	var result = [];
	var lines = str.split('\n');
		MC = 0;

	//First pass, create symbol table
	for(var lineNum in lines){
		var line = lines[lineNum].replace(/#.*/g, '').trim(),
			instruction = line.replace(/[a-zA-Z0-9]+:\s*/g, '').replace(/ .*/, ''),
			symbol = line.search(/^.*:/),
			args = line.replace(/^.*? /g, '').split(/\s*,\s*/);

			//Is it a symbol?
			if(symbol > -1){
				symbol = line.replace(/:.*$/, '');
				SYM[symbol] = MC; //parseInt(lineNum);
				lines[lineNum] = line.replace(/^.*:/, '');
			}

			if(instruction.substr(0, 1) == '.'){
				ASSEM[instruction](args);
			}

			//Add length of instruction to memory counter
			if(instruction in LEN){
				error( toHex(MC) + ' ' + instruction);
				MC += LEN[instruction];
			}
	}

	//Second pass, call assembling function
	for(var lineNum in lines){
		var line = lines[lineNum].replace(/#.*/g, '').trim(),
			instruction = line.replace(/ .*/g, ''),
			args = line.replace(/^.*? /g, '').split(/\s*,\s*/),
			assembled = "";
		
		if(instruction in ASSEM){
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
