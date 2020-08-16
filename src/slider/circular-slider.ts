import { CircularSliderOptions } from './circular-slider-options.model';

export class CircularSlider {
    static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    options: CircularSliderOptions;
    circleCenterX: number;
    circleCenterY: number;
    circumference: number;
    radius: number;
    steps: number = 5;
    currStep: number = 3;

    // Elements
    container: HTMLElement;
    SVG: Element;
    slider: Element;

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

        if (min > max) {
            throw new Error(`Minimum Value (${min}) must be smaller than maximum Value (${max})!`);
        }

        if (max % step !== 0 || min % step !== 0) {
            throw new Error(`Minimum Value ${min} and maximum value ${max} must be divisible by step ${step}!`);
        }
    }

    initSlider() {
        this.circleCenterX = 0;
        this.circleCenterY = 0;
        this.circumference = this.options.radius * 2 * Math.PI;
        this.radius = this.options.radius - this.options.strokeWidth / 2;
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

        this.slider = this.createSliderCircle();

        this.SVG.appendChild(this.createEmptyCircle());
        this.SVG.appendChild(this.slider);
    }

    createSVG(size: number): Element {
        const containerWidth = this.container.offsetWidth;
        const svg = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'svg');
        svg.setAttributeNS(null, 'width', size.toString());
        svg.setAttributeNS(null, 'height', size.toString());
        svg.setAttributeNS(
            null,
            'viewBox',
            `-${containerWidth} -${containerWidth} ${containerWidth * 2} ${containerWidth * 2}`
        );

        svg.setAttributeNS(null, 'id', 'sliderSVG');

        return svg;
    }

    createEmptyCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'dashed-circle');
        circle.setAttributeNS(null, 'stroke', 'lightgray');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.strokeDasharray = '5, 2';
        return circle;
    }

    createSliderCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'slider');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.stroke = this.options.color;

        // 0 = 100%;
        // this.circumference = 0%;
        (circle as SVGSVGElement).style.strokeDashoffset = `${
            this.circumference - this.currStep * (this.circumference / this.steps - 1)
        }`;
        return circle;
    }

    createCircle(): Element {
        const circle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        circle.setAttributeNS(null, 'r', this.radius.toString());
        circle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        circle.setAttributeNS(null, 'cy', this.circleCenterY.toString());
        circle.setAttributeNS(null, 'transform', `rotate(-90 ${this.circleCenterX} ${this.circleCenterY})`);
        console.log('CircleCenterX: ', this.circleCenterX);
        console.log('CircleCenterY: ', this.circleCenterY);

        console.log('circumference: ', this.circumference);
        circle.setAttributeNS(null, 'stroke-dasharray', this.circumference.toString());
        circle.setAttributeNS(null, 'fill', 'none');
        return circle;
    }
}
