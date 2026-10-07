import './style.css';

export class Calculadora {
  private currentInput: string = '0';
  private lastInput: string = '0';
  private operation: string = '';
  private shouldResetInput: boolean = false;
  
  private container: HTMLElement;
  private displayInput!: HTMLInputElement;

  constructor(containerSelector: string) {
    const el = document.querySelector<HTMLElement>(containerSelector);
    if (!el) {
      throw new Error(`No se encontró el contenedor: ${containerSelector}`);
    }
    this.container = el;
    
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="calculadora">
        <div class="display">
          <input type="text" class="display-input" value="0" disabled />
        </div>
        <div class="teclado">
          <button class="delete span-two">DEL</button>
          <button class="reset">C</button>
          <button class="operation" data-action="sign">+/-</button>
          <button class="operation" data-action="square">x²</button>
          <button class="operation" data-action="sqrt">√x</button>
          <button class="operation" data-action="inverse">1/x</button>
          <button class="operation" data-action="+">+</button>
          <button class="number" data-value="7">7</button>
          <button class="number" data-value="8">8</button>
          <button class="number" data-value="9">9</button>
          <button class="operation" data-action="-">-</button>
          <button class="number" data-value="4">4</button>
          <button class="number" data-value="5">5</button>
          <button class="number" data-value="6">6</button>
          <button class="operation" data-action="*">*</button>
          <button class="number" data-value="1">1</button>
          <button class="number" data-value="2">2</button>
          <button class="number" data-value="3">3</button>
          <button class="operation" data-action="/">/</button>        
          <button class="equals span-two">=</button>
          <button class="number" data-value="0">0</button>
          <button class="decimal">.</button>
        </div>
      </div>
    `;
    
    this.displayInput = this.container.querySelector('.display-input') as HTMLInputElement;
  }

  private updateDisplay(): void {
    if (this.displayInput) {
      this.displayInput.value = this.currentInput;
    }
  }

  private calculate(): number {
    const num1 = parseFloat(this.lastInput);
    const num2 = parseFloat(this.currentInput);
    
    switch(this.operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num2 !== 0 ? num1 / num2 : 0;
      default: return num2;
    }
  }

  private executeUnaryOperation(action: string): void {
    const num = parseFloat(this.currentInput);
    let result: number | string = 0;
    
    switch(action) {
      case 'sign':
        if(this.currentInput !== '0'){
          this.currentInput = this.currentInput.startsWith('-') ? this.currentInput.substring(1) : '-' + this.currentInput;
          this.updateDisplay();
        }
        return;
      case 'square':
        result = num * num;
        break;
      case 'sqrt':
        result = num >= 0 ? Math.sqrt(num) : 'Error';
        break;
      case 'inverse':
        result = num !== 0 ? 1 / num : 'Error';
        break;
      default:
        return;
    }
    
    this.currentInput = result.toString();
    this.updateDisplay();
    this.shouldResetInput = true;
  }

  private setupEventListeners(): void {
    const numbers = this.container.querySelectorAll('.number');
    numbers.forEach((element) => {
      element.addEventListener('click', (event) => {     
        const value = (event.target as HTMLElement).dataset.value;   
        
        if (this.shouldResetInput) {
          this.currentInput = value || '0';
          this.shouldResetInput = false;
        } else {
          if (this.currentInput === '0' && value === '0') return;                
          if (this.currentInput === '0') this.currentInput = '';
          this.currentInput += value;
        }
        this.updateDisplay();
      });    
    });

    const resetButton = this.container.querySelector('.reset');
    resetButton?.addEventListener('click', () => {
      this.currentInput = '0';
      this.lastInput = '0';
      this.operation = '';
      this.shouldResetInput = false;
      this.updateDisplay();
    });

    const deleteButton = this.container.querySelector('.delete');
    deleteButton?.addEventListener('click', () => {
      if (this.currentInput.length === 1 || (this.currentInput.length === 2 && this.currentInput.startsWith('-'))) {
        this.currentInput = '0';
      } else {
        this.currentInput = this.currentInput.slice(0, -1);
      }
      this.updateDisplay();
    });

    const decimalButton = this.container.querySelector('.decimal');
    decimalButton?.addEventListener('click', () => {
      if (this.shouldResetInput) {
        this.currentInput = '0.';
        this.shouldResetInput = false;
      } else {
        if (!this.currentInput.includes('.')) {
          this.currentInput += '.';
        }
      }
      this.updateDisplay();
    });

    const operationButtons = this.container.querySelectorAll('.operation');
    operationButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const action = (event.target as HTMLElement).dataset.action;
        
        if (action === 'sign' || action === 'square' || action === 'sqrt' || action === 'inverse') {
          this.executeUnaryOperation(action);
          return;
        }
        
        if (this.operation && !this.shouldResetInput) {
          const result = this.calculate();
          this.currentInput = result.toString();
          this.updateDisplay();
        }
        
        this.lastInput = this.currentInput;
        this.operation = action || '';
        this.shouldResetInput = true;
      });
    });

    const equalsButton = this.container.querySelector('.equals');
    equalsButton?.addEventListener('click', () => {
      if (this.operation) {
        const result = this.calculate();
        this.currentInput = result.toString();
        this.updateDisplay();
        this.lastInput = '0';
        this.operation = '';
        this.shouldResetInput = true;
      }
    });
  }
}