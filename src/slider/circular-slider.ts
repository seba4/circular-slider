export interface ICircularSliderOptions {
    container: string;
    color: string;
    maxValue: number;
    minValue: number;
    stepValue: number;
    radius: number;
}

class CircularSliderOptions implements ICircularSliderOptions {
    container: string = 'slider';
    color: string = 'blue';
    maxValue: number = 100;
    minValue: number = 0;
    stepValue: number = 1;
    radius: number = 100;

    constructor(options: Partial<CircularSliderOptions>) {
        Object.assign(this, options);
    }
}

export class CircularSlider {
    options: CircularSliderOptions;

    constructor(options?: Partial<CircularSliderOptions>) {
        this.options = new CircularSliderOptions(options);

        this.validateOptions();
    }

    /**
     *
     *
     * Checks whether passed options are valid and rendering should succeed.
     */
    private validateOptions(): void {
        const min = this.options.minValue;
        const max = this.options.maxValue;
        const step = this.options.stepValue;
        const radius = this.options.radius;
        const maxRadius = 200;
        const minRadius = 0;

        if (min > max) {
            throw new Error(`Minimum Value (${min}) must be smaller than maximum Value (${max})!`);
        }

        if (max % step !== 0 || min % step !== 0) {
            throw new Error(`Minimum Value ${min} and maximum value ${max} must be divisible by step ${step}!`);
        }

        if (radius > maxRadius || radius < minRadius) {
            throw new Error(`Radius must be between ${minRadius} and ${maxRadius}.`);
        }
    }
}
