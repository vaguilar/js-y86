var ASSEM = {},
	EXEC = {};

//Instructions
ASSEM['nop'] = function(){ return '10'; };
EXEC['10'] = function(){ return 0; };

ASSEM['halt'] = function(){ return '00'; };
EXEC['00'] = function(){ STAT = 'HLT'; return 0; };

ASSEM['rrmovl'] = function(args){ return '20' + register(args[0]) + register(args[1]); };
EXEC['20'] = function(instruction){
	var rA = register(instruction.substr(2, 1)),
		rB = register(instruction.substr(3, 1));

	REG[rB] = REG[rA];

	return 0;
};

ASSEM['irmovl'] = function(args){ return '30f' + register(args[1]) + num2HexLE(evaluate(args[0]), 8); };
EXEC['30'] = function(instruction){
	var rB = register(instruction.substr(3, 1)),
		V = hexLE2num(instruction.substr(4));

	REG[rB] = V;

	return 0;
};

ASSEM['mrmovl'] = function(args){ 
	var result = offset(args[0]);
	return '50' + register(args[1]) + register(result['register']) + num2HexLE(result.offset, 8);
};

EXEC['50'] = function(instruction){
	var V = (0xFFFFFFFF & instruction),
		rB = (0xF00000000 & instruction) >> 8;

	REG[rB] = V;

	return 0;
};

ASSEM['addl'] = function(args){ return '60' + register(args[0]) + register(args[1]); };
EXEC['60'] = function(instruction){

	var rA = register(instruction.substr(2, 1)),
		rB = register(instruction.substr(3, 1));

	REG[rB] = REG[rA] + REG[rB];

};

ASSEM['subl'] = function(args){ return '61' + register(args[0]) + register(args[1]); };
EXEC['61'] = function(instruction){

	var rA = register(instruction.substr(2, 1)),
		rB = register(instruction.substr(3, 1));

	REG[rB] = REG[rA] - REG[rB];

};

ASSEM['andl'] = function(args){ return '62' + register(args[0]) + register(args[1]); };
EXEC['62'] = function(instruction){

	var rA = register(instruction.substr(2, 1)),
		rB = register(instruction.substr(3, 1));

	REG[rB] = REG[rA] & REG[rB];

};

ASSEM['xorl'] = function(args){ return '63' + register(args[0]) + register(args[1]); };
EXEC['63'] = function(instruction){

	var rA = register(instruction.substr(2, 1)),
		rB = register(instruction.substr(3, 1));

	REG[rB] = REG[rA] ^ REG[rB];

};

ASSEM['jmp'] = function(args){ return '70' + num2HexLE(evaluate(args[0]), 8); };

ASSEM['je'] = function(args){ return '73' + num2HexLE(evaluate(args[0]), 8); };
EXEC['73'] = function(args){ 

	if(CC['p'] == 1){
		var D = hexLE2num(instruction.substr(3, 8));
		PC = D;
	}

};

ASSEM['jne'] = function(args){ return '74' + num2HexLE(evaluate(args[0]), 8); };
EXEC['74'] = function(args){ 

	if(CC['e'] == 0){
		var D = hexLE2num(instruction.substr(3, 8));
		PC = D;
	}

};

ASSEM['call'] = function(args){ 
	var temp  = '80';
		temp += num2HexLE(evaluate(args[0]), 8);
	
	return temp; 
};

EXEC['80'] = function(instruction){
	PC = hexLE2num(instruction.substr(2));
	print('PC IS NOW ' + PC);
	
	return 0;
};

ASSEM['ret'] = function(args){ return '90'; };
EXEC['90'] = function(instruction){ 

	var V = hexLE2num(MEM[REG['%esp']]);

	PC = V;
	REG['%esp'] += 1;

	return 0; 
};

ASSEM['pushl'] = function(args){ 
	var temp  = 'a0'
		temp += reg2num[args[0]];
		temp += 'f';
	
	return temp; 
};

EXEC['a0'] = function(instruction){
	var rA = register(instruction.substr(2, 1)),
		V  = toHex(rA, 4);

	REG['%esp'] -= 4;

	MEM[REG['%esp'] + 0] = V[0];
	MEM[REG['%esp'] + 1] = V[1];
	MEM[REG['%esp'] + 2] = V[2];
	MEM[REG['%esp'] + 3] = V[3];
};

ASSEM['popl'] = function(args){ 
	var temp  = 'b0'
		temp += reg2num[args[0]];
		temp += 'f';
	
	return temp; 
};

EXEC['b0'] = function(instruction){
	var rA = register(instruction.substr(2, 1)),
		V = hexLE2num(MEM[REG['%esp']]);

	REG[rA] = V;
	REG['%esp'] += 4;
};

//Directives
ASSEM['.pos'] = function(args){ MC = number(args[0]); return ''; };
EXEC['.pos'] = function(args){ PC = args[0]; };

ASSEM['.align'] = function(args){ 
	var factor = number(args[0]);
	var result = '';

	if(MC % factor != 0){
		var newMC = (Math.floor(MC / factor) + 1) * factor;

		for(var i = 0; i < (newMC - MC); i++){
			result += '00';
		}

		MC = newMC;

		print('PADDING BY ' + (newMC - MC) + '... SO ADDING ' + result);
	}

	return result;
};

EXEC['.align'] = function(args){ 

};

ASSEM['.long'] = function(args){ return num2HexLE(number(args[0]), 8); };
EXEC['.long'] = function(args){ MC = args[0]; };