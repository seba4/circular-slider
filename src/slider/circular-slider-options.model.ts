export interface ICircularSliderOptions {
    container: string;
    color: string;
    maxValue: number;
    minValue: number;
    stepValue: number;
    radius: number;
    strokeWidth: number;
    onValueChange: (value: number) => void;
}

export class CircularSliderOptions implements ICircularSliderOptions {
    container: string = 'slider';
    color: string = 'green';
    maxValue: number = 4;
    minValue: number = 0;
    stepValue: number = 1;
    radius: number = 200;
    strokeWidth: number = 50;
    onValueChange: (value: number) => void;

    constructor(options: Partial<CircularSliderOptions>) {
        Object.assign(this, options);
    }
}
