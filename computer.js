class SNum
{
	// constructor para SNum
	// num = número, puede ser cadena, número o SNum. se asume 0 si se omite
	constructor(num = 0)
	{
		if(num === 0)
		{
			this.num = '0';
			return;
		}
		if(num instanceof SNum)
			this.num = num.num;
		else
		{
			if(typeof num == 'number')
				num = Math.floor(num) + '';
			let sign = '';
			let str = '';
			let signFound = false;
			let numFound = false;
			let error = false;
			for(let ch of num)
			{
				if(ch == '+')
				{
					if(signFound)
					{
						error = true;
						break;
					}
					else
					{
						signFound = true;
						continue;
					}
				}
				if(ch == '-')
				{
					if(signFound)
					{
						error = true;
						break;
					}
					else
					{
						sign = '-';
						signFound = true;
						continue;
					}
				}
				if(ch == '0' && !numFound)
				{
					signFound = true;
					continue;
				}
				switch(ch)
				{
				case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
					signFound = true;
					numFound = true;
					str += ch;
					break;
				default:
					error = true;
				}
				if(error)
					break;
			}
			if(str == '' || str == '0')
				this.num = '0';
			else
				this.num = sign + str;
		}
	}
	
	// (para uso interno)
	// prepara dos números para procesarlos
	// nums = objeto con los números en las propiedades n1 y n2, que pueden ser cadena, número o SNum
	// deja la siguiente información en nums:
	// n1 = array de números con los dígitos del primer número, en orden inverso
	// n2 = array de números con los dígitos del segundo número, en orden inverso
	// sign1 = booleano que indica si el primer número es positivo
	// sign2 = booleano que indica si el segundo número es positivo
	static prepare(nums)
	{
		if(!(nums.n1 instanceof SNum))
			nums.n1 = (new SNum(nums.n1)).num;
		if(!(nums.n2 instanceof SNum))
			nums.n2 = (new SNum(nums.n2)).num;
		nums.sign1 = true;
		if(nums.n1[0] == '-')
		{
			nums.n1 = nums.n1.substring(1);
			nums.sign1 = false;
		}
		nums.sign2 = true;
		if(nums.n2[0] == '-')
		{
			nums.n2 = nums.n2.substring(1);
			nums.sign2 = false;
		}
		
		nums.n1 = nums.n1.split('').reverse();
		nums.n2 = nums.n2.split('').reverse();
		
		for(let i in nums.n1)
			nums.n1[i] = parseInt(nums.n1[i]);
		for(let i in nums.n2)
			nums.n2[i] = parseInt(nums.n2[i]);
	}
	
	// (para uso interno)
	// compara los valores absolutos de dos números
	// nums = objeto con los números en las propiedades n1 y n2. debe estar en el formato que devuelve SNum.prepare
	// devuelve:
	// 1 si n1 > n2
	// 0 si n1 == n2
	// -1 si n1 < n2
	// se ignoran las propiedades sign1 y sign2 del objeto nums, por lo que los números se tratan como sus valores absolutos
	static nums_compare(nums)
	{
		if(nums.n1.length > nums.n2.length)
			return 1;
		if(nums.n1.length < nums.n2.length)
			return -1;
		for(let i = nums.n1.length - 1; i >= 0; i--)
		{
			if(nums.n1[i] > nums.n2[i])
				return 1;
			if(nums.n1[i] < nums.n2[i])
				return -1;
		}
		return 0;
	}
	
	// (para uso interno)
	// elimina los ceros a la izquierda de un número y añade el signo '-' si hace falta
	// arr = array de dígitos en orden inverso
	// sign = si el número es positivo
	// se modifica arr, dejando ahí el resultado
	static remove_zeros(arr, sign)
	{
		let len = arr.length;
		while(len > 1)
		{
			if(arr[len - 1] != 0)
				break;
			len--;
		}
		arr.splice(len, arr.length - len);
		
		if(!sign && !(arr.length == 1 && arr[0] == 0))
			arr.push('-');
	}
	
	// suma dos números
	// n1 = primer número, puede ser cadena, número o SNum
	// n2 = segundo número, puede ser cadena, número o SNum
	// noProcess = (para uso interno) impide que se procesen n1 y n2, en cuyo caso deberán ser positivos y estar en el formato que devuelve SNum.prepare
	// devuelve un objeto SNum con el resultado de la operación (si noProcess es true, devuelve el array de dígitos en orden inverso)
	static add(n1, n2, noProcess = false)
	{
		let nums = {'n1': n1, 'n2': n2};
		if(noProcess)
			nums.sign1 = nums.sign2 = true;
		else
			SNum.prepare(nums);
		let res = [];
		let times = Math.max(nums.n1.length, nums.n2.length);
		let sgn;
		if(nums.sign1 != nums.sign2)
		{
			sgn = SNum.nums_compare(nums);
			if(sgn == -1)
			{
				let tmp = nums.n1;
				nums.n1 = nums.n2;
				nums.n2 = tmp;
			}
		}
		let val = 0;
		for(let i = 0; i < times; i++)
		{
			let n1 = nums.n1[i];
			if(n1 == undefined)
				n1 = 0;
			let n2 = nums.n2[i];
			if(n2 == undefined)
				n2 = 0;
			if(nums.sign1 == nums.sign2)
			{
				val += n1 + n2;
				if(val > 9)
				{
					res.push(val - 10);
					val = 1;
				}
				else
				{
					res.push(val);
					val = 0;
				}
			}
			else
			{
				val = n1 - n2 - val;
				if(val < 0)
				{
					res.push(val + 10);
					val = 1;
				}
				else
				{
					res.push(val);
					val = 0;
				}
			}
			
		}
		if(val)
			res.push(val);
		
		let sign = true;
		if(nums.sign1 == nums.sign2)
		{
			if(!nums.sign1)
				sign = false;
		}
		else
		{
			if((sgn != -1) ^ (nums.sign1))
				sign = false;
		}
		SNum.remove_zeros(res, sign);
		
		if(noProcess)
			return res;
		
		let newNum = new SNum();
		newNum.num = res.reverse().join('');
		
		return newNum;
	}
	
	// multiplica dos números
	// n1 = primer número, puede ser cadena, número o SNum
	// n2 = segundo número, puede ser cadena, número o SNum
	// devuelve un objeto SNum con el resultado de la operación
	mul(n1, n2)
	{
		let nums = {'n1': n1, 'n2': n2};
		SNum.prepare(nums);
		let sign = (nums.sign1 ^ nums.sign2) ? '' : '-';
		n1 = nums.n1;
		n2 = nums.n2;
		nums = null;
		for(let i in n1)
		{
			for(let j in n2)
			{
			}
		}
	}
}

const OP_ADD = 1;
const OP_MUL = 2;
const OP_IN = 3;
const OP_OUT = 4;
const OP_JNZ = 5;
const OP_JZ = 6;
const OP_SETL = 7;
const OP_SETE = 8;
const OP_ADDREL = 9;
const OP_END = 99;

const MEM_POS = 0;
const MEM_VAL = 1;
const MEM_REL = 2;

const END_HALT = 0;
const END_STEPS = 1;
const END_NOINPUT = 2;
const END_FULLOUTPUT = 3;
const END_UD_OP = 4;
const END_UD_MEM = 5;

class Computer
{
	// constructor de la máquina de ejecución de programas
	// state = estado inicial, es un objeto con las siguientes propiedades opcionales:
	//         pointer = valor del puntero a la siguiente instrucción a ejecutar
	//         program = memoria con instrucciones y datos del programa (array de números)
	//         relBase = registro base para acceso relativo a memoria
	//         errCode = código de error actual
	//         input = array para obtener datos de entrada
	//         inputSize = número máximo de datos de entrada que leer durante la ejecución antes de parar
	//         inputRead = número del dato actual a leer
	//         output = array donde poner los datos de salida
	//         haltOnOutput = número máximo de datos a producir como salida durante la ejecución antes de parar, o false para infinito
	// clone = si se quiere clonar el array program para no modificar el que se le pase en el objeto state
	// cloneInput = si se quiere clonar el array input para no modificar el que se le pase en el objeto state
	// cloneOutput = si se quiere clonar el array output para no modificar el que se le pase en el objeto state
	constructor(state = null, clone = true, cloneInput = false, cloneOutput = false)
	{
		this.pointer = 0;
		this.program = [99];
		this.relBase = 0;
		this.errCode = END_HALT;
		this.input = [];
		this.inputSize = 0;
		this.inputRead = 0;
		this.output = [];
		this.haltOnOutput = false;
		if(typeof state == 'object')
		{
			if(state.hasOwnProperty('pointer'))
				this.pointer = state.pointer;
			if(state.hasOwnProperty('program'))
			{
				if(clone)
				{
					this.program = [];
					for(let i of state.program)
						this.program.push(i);
				}
				else
					this.program = state.program;
			}
			if(state.hasOwnProperty('relBase'))
				this.relBase = state.relBase;
			if(state.hasOwnProperty('errCode'))
				this.errCode = state.errCode;
			if(state.hasOwnProperty('input'))
			{
				if(cloneInput)
				{
					this.input = [];
					for(let i of state.input)
						this.input.push(i);
				}
				else
					this.input = state.input;
			}
			if(state.hasOwnProperty('inputSize'))
				this.inputSize = state.inputSize;
			if(state.hasOwnProperty('inputRead'))
				this.inputRead = state.inputRead;
			if(state.hasOwnProperty('output'))
				if(cloneOutput)
				{
					this.output = [];
					for(let i of state.output)
						this.output.push(i);
				}
				else
					this.output = state.output;
			if(state.hasOwnProperty('haltOnOutput'))
				this.haltOnOutput = state.haltOnOutput;
		}
	}
	
	// establece los datos de entrada
	// input = array a utilizar para obtener los datos de entrada
	// inputSize = número máximo de datos a leer. si es null, se asumirá la longitud del array input
	// si durante la ejecución se intentasen leer más datos que inputSize, se devolvería END_NOINPUT
	setInput(input, inputSize = null)
	{
		this.input = input;
		this.inputSize = inputSize == null ? this.input.length : inputSize;
		this.inputRead = 0;
	}
	
	// establece los datos de salida
	// output = array donde poner los datos de salida
	// haltOnOutput = false para no parar cuando se produce salida, un número para parar cuando se ha producido salida las veces indicadas
	// si durante la ejecución se intentasen producir más datos que haltOnOutput, se devolvería END_FULLOUTPUT
	setOutput(output, haltOnOutput = false)
	{
		this.output = output;
		this.haltOnOutput = haltOnOutput;
	}
	
	// ejecuta el programa cargado
	// maxSteps = false para no limitar el número de instrucciones a ejecutar, un número para parar cuando se haya ejecutado el número de instrucciones indicado
	// devuelve (el valor devuelto también se pone en la propiedad errCode):
    // END_HALT = se ha llegado al final del programa
    // END_STEPS = se han ejecutado tantas instrucciones como se indicaba en maxSteps
    // END_NOINPUT = se intentó obtener datos de entrada pero ya se consumieron todos los que había en el array input
    // END_FULLOUTPUT = se intentó producir datos de salida pero el array output ya contiene tantos como se indicaba en haltOnOutput
    // END_UD_OP = se encontró una instrucción no válida
    // END_UD_MEM = se encontró un modo de acceso a memoria no válido
	run(maxSteps = false)
	{
		let stop = false;
		if(typeof maxSteps == 'string')
			maxSteps = parseInt(maxSteps);
		while(!stop)
		{
			if(maxSteps !== false)
			{
				if(maxSteps == 0)
				{
					this.errCode = END_STEPS;
					return this.errCode;
				}
				maxSteps--;
			}
			let opcode = this.program[this.pointer];
			if(opcode == undefined)
				opcode = 0;
			let numParams = 0;
			let lastParamIsWrite = false;
			switch(opcode % 100)
			{
			case OP_ADD:
			case OP_MUL:
			case OP_SETL:
			case OP_SETE:
				numParams = 3;
				lastParamIsWrite = true;
				break;
			case OP_IN:
				if(this.inputRead == this.inputSize)
				{
					this.errCode = END_NOINPUT;
					return this.errCode;
				}
				numParams = 1;
				lastParamIsWrite = true;
				break;
			case OP_OUT:
				if(this.haltOnOutput === 0)
				{
					this.errCode = END_FULLOUTPUT;
					return this.errCode;
				}
				numParams = 1;
				break;
			case OP_JNZ:
			case OP_JZ:
				numParams = 2;
				break;
			case OP_ADDREL:
				numParams = 1;
				break;
			case OP_END:
				this.errCode = END_HALT;
				return this.errCode;
			default:
				this.errCode = END_UD_OP;
				return this.errCode;
			}
			
			let paramTypes = Math.floor(opcode / 100);
			let values = [];
			for(let i = 0; i < numParams; i++)
			{
				let paramType = paramTypes % 10;
				paramTypes = Math.floor(paramTypes / 10);
				let value = this.program[this.pointer + i + 1];
				if(value == undefined)
					value = 0;
				switch(paramType)
				{
				case MEM_POS:
				case MEM_REL:
					if((!lastParamIsWrite) || (i != numParams - 1))
					{
						if(paramType == MEM_REL)
							value += this.relBase;
						value = this.program[value];
						if(value == undefined)
							value = 0;
					}
					break;
				case MEM_VAL:
					if((lastParamIsWrite) && (i == numParams - 1))
					{
						this.errCode = END_UD_MEM;
						return this.errCode;
					}
					break;
				default:
					this.errCode = END_UD_MEM;
					return this.errCode;
				}
				values.push(value);
			}
			let write = null;
			let jump = null;
			switch(opcode % 100)
			{
			case OP_ADD:
				write = values[0] + values[1];
				break;
			case OP_MUL:
				write = values[0] * values[1];
				break;
			case OP_IN:
				write = this.input[this.inputRead];
				this.inputRead++;
				break;
			case OP_OUT:
				if(this.haltOnOutput !== false)
					this.haltOnOutput--;
				this.output.push(values[0]);
				break;
			case OP_JNZ:
				if(values[0] != 0)
					jump = values[1];
				break;
			case OP_JZ:
				if(values[0] == 0)
					jump = values[1];
				break;
			case OP_SETL:
				write = values[0] < values[1] ? 1 : 0;
				break;
			case OP_SETE:
				write = values[0] == values[1] ? 1 : 0;
				break;
			case OP_ADDREL:
				this.relBase += values[0];
				break;
			}
			
			if(write != null)
				this.program[values[numParams - 1]] = write;
			if(jump != null)
				this.pointer = jump;
			else
				this.pointer += numParams + 1;
		}
		return this.errCode;
	}
}