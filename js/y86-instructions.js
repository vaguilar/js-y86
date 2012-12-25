var ASSEM = {},
	EXEC = {};

//Instructions
ASSEM['nop'] = function(){ return '10'; };
EXEC['10'] = function(){ return 0; };

ASSEM['halt'] = function(){ return '00'; };
EXEC['00'] = function(){ return 0; };

ASSEM['rrmovl'] = function(args){ return '20' + register(args[0]) + register(args[1]); };
EXEC['20'] = function(instruction){
	var rA = (0x00F0 & instruction) >> 4,
		rB = 0x000F & instruction;

	REG[rB] = REG[rA];

	return 0;
};

ASSEM['irmovl'] = function(args){ return '30f' + register(args[1]) + num2HexLE(evaluate(args[0]), 8); };
EXEC['30'] = function(instruction){
	var V = (0xFFFFFFFF & instruction),
		rB = (0xF00000000 & instruction) >> 8;

	REG[rB] = V;

	return 0;
};

ASSEM['mrmovl'] = function(args){ 
	var result = offset(args[0]);
	error(result);
	return '50' + register(args[1]) + register(result['register']) + num2HexLE(result.offset, 8);
};

EXEC['50'] = function(instruction){
	var V = (0xFFFFFFFF & instruction),
		rB = (0xF00000000 & instruction) >> 8;

	REG[rB] = V;

	return 0;
};

ASSEM['addl'] = function(args){ return '60' + register(args[0]) + register(args[1]); };

ASSEM['subl'] = function(args){ return '61' + register(args[0]) + register(args[1]); };

ASSEM['andl'] = function(args){ return '62' + register(args[0]) + register(args[1]); };

ASSEM['xorl'] = function(args){ return '63' + register(args[0]) + register(args[1]); };

ASSEM['jmp'] = function(args){ return '70' + num2HexLE(evaluate(args[0]), 8); };

ASSEM['je'] = function(args){ return '73' + num2HexLE(evaluate(args[0]), 8); };

ASSEM['jne'] = function(args){ return '74' + num2HexLE(evaluate(args[0]), 8); };

ASSEM['call'] = function(args){ 
	var temp  = '80';
		temp += num2HexLE(evaluate(args[0]), 8);
	
	return temp; 
};

EXEC['80'] = function(instruction){
	
};

ASSEM['ret'] = function(args){ return '90'; };
EXEC['90'] = function(instruction){ return 0; };

ASSEM['pushl'] = function(args){ 
	var temp  = 'a0'
		temp += reg2num[args[0]];
		temp += 'f';
	
	return temp; 
};

EXEC['a0'] = function(instruction){
	
};

ASSEM['popl'] = function(args){ 
	var temp  = 'b0'
		temp += reg2num[args[0]];
		temp += 'f';
	
	return temp; 
};

EXEC['b0'] = function(instruction){
	
};

//Directives
ASSEM['.pos'] = function(args){ MC = number(args[0]); return ''; };
EXEC['.pos'] = function(args){ PC = args[0]; };

ASSEM['.align'] = function(args){ 
	var factor = number(args[0]);

	if(MC % factor !== 0)
		MC = (Math.floor(MC / factor) + 1) * factor;

	error('ALIGNING BY ' + factor + ', NEW MC = ' + MC);

	return '';
}
EXEC['.align'] = function(args){ 

};

ASSEM['.long'] = function(args){ return num2HexLE(number(args[0]), 8); };
EXEC['.long'] = function(args){ MC = args[0]; };