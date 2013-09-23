var assert = require("assert"),
	tests = [];

var symbolTableTests = [
	["Symbol Table Test", "nop", symbolTable, ["a: nop"], {}]
];
tests = tests.concat(symbolTableTests);

var parseInstructionTests = [
	["Parse Instruction Test", ["rrmovl", "%eax", "%ebx"], parseInstruction, "rrmovl %eax, %ebx"],
	["Parse Instruction Test", ["irmovl", "$10", "%edx"], parseInstruction, "irmovl	$10,%edx"],
	["Parse Instruction Test", ["mrmovl", "%edi", "%ecx"], parseInstruction, "mrmovl 	%edi,	%ecx"],
	["Parse Instruction Test", ["rrmovl", "%eax", "%ebx", "# comment"], parseInstruction, "rrmovl %eax, %ebx # comment"],
];
tests = tests.concat(parseInstructionTests);

var assembleTests = [
["Assemble irmovl", 	"30f001000000", assemble, "irmovl $1,%eax"],
["Assemble xorl", 	"6344", assemble, "xorl %esp,%esp"],
["Assemble pushl", 	"a00f", assemble, "pushl %eax"],
["Assemble addl", 	"6000", assemble, "addl  %eax,%eax"],
["Assemble irmovl", 	"30f002000000", assemble, "irmovl $2, %eax"],
["Assemble irmovl", 	"30f003000000", assemble, "irmovl $3, %eax"],
["Assemble irmovl", 	"30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble rrmovl", 	"30f003000000", assemble, "irmovl  $3,%eax"],
["Assemble nop", 	"10", assemble, "nop"],
["Assemble halt", 	"00", assemble, "halt"],
["Assemble instruction", "30f001000000", assemble, "irmovl $1,%eax"],
["Assemble instruction", "6344", assemble, "xorl %esp,%esp        # Set stack pointer to 0 and CC to 100"],
["Assemble instruction", "a00f", assemble, "pushl %eax            # Attempt to write to 0xfffffffc"],
["Assemble instruction", "6000", assemble, "addl  %eax,%eax       # (Should not be executed) Would set CC to 000"],
["Assemble instruction", "30f002000000", assemble, "irmovl $2, %eax       # Not executed"],
["Assemble instruction", "30f003000000", assemble, "irmovl $3, %eax       # Not executed"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble instruction", "30f003000000", assemble, "irmovl  $3,%eax"],
["Assemble instruction", "10", assemble, "nop"],
["Assemble instruction", "6020", assemble, "addl %edx,%eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble instruction", "30f003000000", assemble, "irmovl  $3,%eax"],
["Assemble instruction", "10", assemble, "nop"],
["Assemble instruction", "10", assemble, "nop"],
["Assemble instruction", "6020", assemble, "addl %edx,%eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble instruction", "30f003000000", assemble, "irmovl  $3,%eax"],
["Assemble instruction", "10", assemble, "nop"],
["Assemble instruction", "6020", assemble, "addl %edx,%eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble instruction", "30f003000000", assemble, "irmovl  $3,%eax"],
["Assemble instruction", "6020", assemble, "addl %edx,%eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f280000000", assemble, "irmovl $128,%edx"],
["Assemble instruction", "30f103000000", assemble, "irmovl  $3,%ecx"],
["Assemble instruction", "40120a000000", assemble, "rmmovl %ecx, $10(%edx)"],
["Assemble instruction", "401200000000", assemble, "rmmovl %ecx, 0(%edx)"],
["Assemble instruction", "30f30a000000", assemble, "irmovl  $10,%ebx"],
["Assemble instruction", "500200000000", assemble, "mrmovl 0(%edx), %eax  # Load %eax"],
["Assemble instruction", "6030", assemble, "addl %ebx,%eax        # Use %eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx"],
["Assemble instruction", "30f203000000", assemble, "irmovl  $3,%edx"],
["Assemble instruction", "2020", assemble, "rrmovl %edx,%eax"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f20a000000", assemble, "irmovl $10,%edx    # return point"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "90", assemble, "ret                # return immediately"],
["Assemble instruction", "2023", assemble, "rrmovl %edx,%ebx   # not executed"],
["Assemble instruction", "6300", assemble, "xorl %eax,%eax "],
["Assemble instruction", "30f001000000", assemble, "irmovl $1, %eax    # Fall through"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "30f202000000", assemble, "irmovl $2, %edx    # Target"],
["Assemble instruction", "30f303000000", assemble, "irmovl $3, %ebx    # Target+1"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "6300", assemble, "xorl %eax,%eax "],
["Assemble instruction", "30f001000000", assemble, "irmovl $1, %eax  # Fall through"],
["Assemble instruction", "00", assemble, "halt"],
["Assemble instruction", "ff", assemble, ".byte 0xFF       # Invalid instruction code"],
];
tests = tests.concat(assembleTests);

function runTests() {
for(t in tests) {
	var test = tests[t],
		name = test[0],
		args = test.slice(3);
		expected = test[1].toString(),
		actual = test[2].apply(null, test.slice(3)).toString();

	try {
		assert.equal(expected, actual, name);
	} 
	catch(e) {
		console.log(name + " FAILED");
		console.log("args = " + args);
		console.log("Expected: " + expected);
		console.log("Actual:   " + actual);
		return;
	}
}
console.log("All tests passed!");
}
runTests();
