export interface ICircularSliderOptions {
    container: string;
    color: string;
    maxValue: number;
    minValue: number;
    stepValue: number;
    radius: number;
    strokeWidth: number;
}

export class CircularSliderOptions implements ICircularSliderOptions {
    container: string = 'slider';
    color: string = 'green';
    maxValue: number = 100;
    minValue: number = 0;
    stepValue: number = 100;
    radius: number = 200;
    strokeWidth: number = 20;

    constructor(options: Partial<CircularSliderOptions>) {
        Object.assign(this, options);
    }
}
