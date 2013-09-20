/* Assemble a string of y86 assembly */
function assemble(assembly) {
	var objectCode = [],
		st = {},
		lines = assembly.split("\n");

	symbolTable(lines, st);

	for (i in lines) {
		var line = lines[i].trim(),
			assembled = assembleInstruction(line, st);
		objectCode.push(assembled); 
	}

	return objectCode.join("\n");
}

/* Create symbol table */
function symbolTable(lines, st) {
	var symbol = /^(\w+):\s*/,
		instruction = /^(\w+)\s+/,
		byteCounter = 0;

	for(key in lines) {
		var line = lines[key];

		if (symbol.test(line)) {
			var s = line.match(symbol)[1];
			lines[key] = line.replace(symbol, "");
			st[s] = byteCounter;
		}

		if (instruction.test(line)) {
			var i = line.match(instruction)[1];
			byteCounter += instr2len[i];
		}
	}
	return lines.join("\n");
}

function assembleInstruction(line) {
	var parsed = parseInstruction(line),
		result = "";

	

	return result;
}

function parseInstruction(line) {
	var instr 	= line.replace(/\s+.*/, "") + "";
		args  	= (line.replace(/(^\w+\s+)|(#.*)/g, "") + []).split(","),
		comment = line.replace(/^[^#]*/, "") + "",
		result 	= [instr];

	args = args.map(function(x){ return x.trim() });
	console.log(instr);
	console.log(args);
	console.log(comment);

	if (args.length > 0) {
		result = result.concat(args);
	}
	
	if (comment !== "") {
		result = result.concat([comment]);
	}

	return result;
}

var ASSEM = [];

ASSEM[0] = function () {
	return '00';
};

ASSEM[1] = function () {
	return '10';
};

ASSEM[2] = function () {
	return '20' + this.rA + this.rB;
};

ASSEM[3] = function () {
	return '30f' + this.rB + this.V;
};

ASSEM[4] = function () {
	return '40' + this.rA + this.rB + this.D;
};

ASSEM[5] = function () {
	return '50' + this.rA + this.rB + this.D;
};

ASSEM[6] = function () {
	return '6' + this.fn + this.rA + this.rB;
};

ASSEM[7] = function () {
	return '7' + this.fn + this.Dest;
};

ASSEM[8] = function () {
	return '80' + this.Dest;
};

ASSEM[9] = function () {
	return '90';
};

ASSEM[10] = function () {
	return 'a0' + this.rA + 'f';
};

ASSEM[11] = function () {
	return 'b0' + this.rA + 'f';
};
