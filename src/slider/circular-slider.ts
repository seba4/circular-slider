export interface ICircularSliderOptions {
    container: string;
    color: string;
    maxValue: number;
    minValue: number;
    stepValue: number;
    radius: number;
    strokeWidth: number;
}

class CircularSliderOptions implements ICircularSliderOptions {
    container: string = 'slider';
    color: string = 'blue';
    maxValue: number = 100;
    minValue: number = 0;
    stepValue: number = 1;
    radius: number = 100;
    strokeWidth: number = 20;

    constructor(options: Partial<CircularSliderOptions>) {
        Object.assign(this, options);
    }
}

export class CircularSlider {
    static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    options: CircularSliderOptions;
    container: HTMLElement;
    SVG: Element;
    maxRadius = 200;
    circleCenterX: number;
    circleCenterY: number;

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
        this.circleCenterX = 0;
        this.circleCenterY = 0;
        // Find container where we will render slider
        this.container = document.getElementById(this.options.container);

        if (this.container === null) {
            throw new Error(`Container with name '${this.options.container}' can't be found.`);
        }

        // Create SVG element with all the required attributes so we can draw slider.
        this.SVG = document.getElementById('sliderSVG') as Element;
        if (this.SVG === null) {
            this.SVG = this.createSVG(this.container.offsetWidth) as Element;
            this.container.appendChild(this.SVG);
        }

        this.SVG.appendChild(this.createEmptyCircle());
    }

    createSVG(size: number): Element {
        const svg = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'svg');
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

    createEmptyCircle(): Element {
        const circle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        circle.setAttributeNS(null, 'r', (this.options.radius * 2).toString());
        circle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        circle.setAttributeNS(null, 'cy', this.circleCenterY.toString());
        circle.setAttributeNS(null, 'fill', 'red');
        circle.setAttributeNS(null, 'class', 'dashed-circle');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        return circle;
    }
}
