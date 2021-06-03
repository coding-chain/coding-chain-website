import confetti from 'canvas-confetti';
import {Observable} from 'rxjs';

export class ConfettiUtils {
  public static show(colors: string[],  closeObs$?: Observable<any>): void {
    let reset = false;
    (function frame(): void {
      confetti({
        particleCount: colors.length,
        angle: 60,
        spread: 55,
        origin: {x: 0},
        colors
      });
      confetti({
        particleCount: colors.length,
        angle: 120,
        spread: 55,
        origin: {x: 1},
        colors
      });
      if (!reset) {
        requestAnimationFrame(frame);
      }
    }());
    closeObs$.subscribe(close => {
      reset = true;
      confetti.reset();
    });
  }
}
