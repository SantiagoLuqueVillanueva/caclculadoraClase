import { fromEvent, interval, Subscription } from "rxjs";

export class Chronometer {
  private container: HTMLElement;
  private display!: HTMLElement;

  private btnStart!: HTMLButtonElement;
  private btnPause!: HTMLButtonElement;
  private btnReset!: HTMLButtonElement;

  private timeInSeconds: number = 0;
  private timerSubscription: Subscription | undefined;

  constructor(containerSelector: string) {
    const element = document.querySelector<HTMLElement>(containerSelector);
    if (!element) {
      throw new Error(`No se encontró el contenedor: ${containerSelector}`);
    }
    this.container = element;

    this.render();
    this.setupObservables();
  }

  private render(): void {
    this.container.innerHTML = `
        <div class="chronometer">
            <h2 class="time-display">00:00</h2>
            <div class="controls">
                <button class="btn-start">Start</button>
                <button class="btn-pause">Pause</button>
                <button class="btn-reset">Restart</button>
            </div>
      </div>
        `;

    this.display = this.container.querySelector(".time-display") as HTMLElement;
    this.btnStart = this.container.querySelector(
      ".btn-start",
    ) as HTMLButtonElement;
    this.btnPause = this.container.querySelector(
      ".btn-pause",
    ) as HTMLButtonElement;
    this.btnReset = this.container.querySelector(
      ".btn-reset",
    ) as HTMLButtonElement;
  }

  private setupObservables(): void {
    fromEvent(this.btnStart, "click").subscribe(() => {
      if (this.timerSubscription) return;

      this.timerSubscription = interval(1000).subscribe(() => {
        this.timeInSeconds++;
        this.updateDisplay();
      });
    });

    fromEvent(this.btnPause, "click").subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
        this.timerSubscription = undefined;
      }
    });

    fromEvent(this.btnReset, "click").subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
        this.timerSubscription = undefined;
        this.display.innerText = "00:00";
        this.timeInSeconds = 0;
      } else {
        this.display.innerText = "00:00";
        this.timeInSeconds = 0;
      }
    });
  }

  private updateDisplay(): void {
    const minutos = Math.floor(this.timeInSeconds / 60);
    const segundos = this.timeInSeconds % 60;

    const textoMinutos = minutos.toString().padStart(2, "0");
    const textoSegundos = segundos.toString().padStart(2, "0");

    this.display.innerText = `${textoMinutos}:${textoSegundos}`;
  }
}
