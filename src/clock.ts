import { interval, map } from 'rxjs';

export class Clock {
    private container: HTMLElement;
    private display!: HTMLElement;

    constructor(containerSelector: string) {
        const element = document.querySelector<HTMLElement>(containerSelector);
        if (!element) {
            throw new Error(`No se encontró el contenedor: ${containerSelector}`);
        }
        this.container = element;

        this.render();
        this.startClock();
    }

    private render(): void {
        this.container.innerHTML = `
            <div><h2 class="time-display">00:00:00</h2></div>
        `;
        
        this.display = this.container.querySelector('.time-display') as HTMLElement;
    }

    private startClock(): void {
        interval(1000).pipe(
            map(() => {
                const now = new Date();
                return now.toLocaleTimeString();
            })
        ).subscribe((time) => {
            this.display.innerText = time;
        })
    }
}

