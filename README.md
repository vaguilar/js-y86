js-y86
======

js-y86 is an assembler and simulator written in Javascript. To use on a webpage, include y86.js first then the rest of the .js files. ASSEMBLE takes a string of y86 assembly code and produces another string formatted as a .yo file. This string can be passed to toByteArray() to create a byte array which can be passed to EXECUTE to have it run. 

This can also be run on nodejs, but needs modification in the y86.js file.
