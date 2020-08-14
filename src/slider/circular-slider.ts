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
    container: HTMLElement;
    SVG: SVGSVGElement;
    maxRadius: 200;

    constructor(options?: Partial<CircularSliderOptions>) {
        this.options = new CircularSliderOptions(options);

        this.validateOptions();
        this.initSlider();
    }

    /**
     * Checks whether passed options are valid and rendering should succeed.
     */
    private validateOptions(): void {
        const min = this.options.minValue;
        const max = this.options.maxValue;
        const step = this.options.stepValue;
        const radius = this.options.radius;
        const minRadius = 0;

        if (min > max) {
            throw new Error(`Minimum Value (${min}) must be smaller than maximum Value (${max})!`);
        }

        if (max % step !== 0 || min % step !== 0) {
            throw new Error(`Minimum Value ${min} and maximum value ${max} must be divisible by step ${step}!`);
        }

        if (radius > this.maxRadius || radius < minRadius) {
            throw new Error(`Radius must be between ${minRadius} and ${this.maxRadius}.`);
        }
    }

    initSlider() {
        // Find container where we will render slider
        this.container = document.getElementById(this.options.container);

        // Create SVG element with all the required attributes so we can draw slider.
        this.SVG = (document.getElementById('sliderSVG') as Element) as SVGSVGElement;
        if (this.SVG === null) {
            this.SVG = this.createSVG(this.container.offsetWidth);
            this.container.appendChild(this.SVG);
        }
    }

    createSVG(size: number): SVGSVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttributeNS(null, 'width', size.toString());
        svg.setAttributeNS(null, 'height', size.toString());
        svg.setAttributeNS(
            null,
            'viewBox',
            `-${this.maxRadius} -${this.maxRadius} ${this.maxRadius * 2} ${this.maxRadius * 2}`
        );

        svg.setAttributeNS(null, 'id', 'sliderSVG');

        return svg;
    }
}
