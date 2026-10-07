import { Calculadora } from './calculator';
import { Clock } from './clock';
import { Chronometer } from "./chronometer";

document.addEventListener('DOMContentLoaded', () => {
  new Clock('#clock');
  new Chronometer('#chronometer');
});
