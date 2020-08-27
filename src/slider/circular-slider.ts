import { CircularSliderOptions, IPosition } from './circular-slider-options.model';

export class CircularSlider {
    private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    options: CircularSliderOptions;
    circleCenterX: number;
    circleCenterY: number;
    circumference: number;
    radius: number;
    steps: number = 5;
    _currStep: number = 0;
    position: IPosition;

    // Elements
    container: HTMLElement;
    SVG: Element;
    slider: Element;
    handle: Element;
    clickCircle: Element;

    constructor(options?: Partial<CircularSliderOptions>) {
        this.options = new CircularSliderOptions(options);

        this.validateOptions();
        this.initSlider();
        this.initEventHandlers();
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

    get handlerRadius(): number {
        return this.options.strokeWidth / 2 + 2;
    }

    calculateNewPosition(angleRad: number): IPosition {
        const newX = Math.round(Math.sin(angleRad) * this.radius);
        const newY = Math.round(Math.cos(angleRad) * this.radius) * -1;

        // we have our coordinates right, but angles need to be adjusted to positive number
        // basically just add 2PI - 360 degrees
        const radians360 = angleRad < 0 ? angleRad + 2 * Math.PI : angleRad;
        const angelDegrees = (radians360 * 180.0) / Math.PI;
        const path = Math.round(this.radius * radians360);

        return {
            x: Math.floor(angleRad) === 359 ? -1 : newX,
            y: newY,
            degrees: angelDegrees,
            radians: radians360,
            path: path
        };
    }

    private initSlider() {
        this.circleCenterX = 0;
        this.circleCenterY = 0;
        this.radius = this.options.radius - this.options.strokeWidth / 2;
        this.position = this.calculateNewPosition(
            this.cord2Radius(this.circleCenterX, this.circleCenterY - this.radius)
        );
        this.circumference = this.radius * 2 * Math.PI;

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
        this.handle = this.createHandle();
        this.clickCircle = this.createClickCircle();

        this.SVG.appendChild(this.createEmptyCircle());
        this.SVG.appendChild(this.clickCircle);
        this.SVG.appendChild(this.slider);
        this.SVG.appendChild(this.handle);

        this.actOnValueChange();
    }

    actOnValueChange(): void {
        if (this.options.onValueChange) {
            this.options.onValueChange(this.step2Value(this._currStep + 1));
        }
    }

    set currStep(step: number) {
        if (isNaN(step) || step < 0 || this.maxSteps < step) {
            throw new Error(`Current step can be any number between 0 and ${this.maxSteps}`);
        }

        this._currStep = step;
        this.actOnValueChange();
        this.updateSlider();
    }

    private updateSlider(): void {
        requestAnimationFrame(() => {
            (this.slider as SVGSVGElement).style.strokeDashoffset = `${this.calculateSliderCircleOffset()}`;
            (this.handle as SVGSVGElement).style.transform = 'rotate(' + this.step2Radius(this._currStep) + 'deg)';
        });
    }

    private initEventHandlers(): void {
        this.clickCircle.addEventListener('click', (event) => this.handleSliderClick(event));

        this.slider.addEventListener('click', (event) => this.handleSliderClick(event));
    }

    private handleSliderClick(event: Event): void {
        // get current click location
        const svgPoint = (this.SVG as SVGSVGElement).createSVGPoint();
        const localCoords = this.transformToLocalCoordinate(svgPoint, event as MouseEvent);
        const newPosition = this.calculateNewPosition(this.cord2Radius(localCoords.x, localCoords.y));

        console.log('New Position is:', newPosition);
        const nextStep = this.deg2Step(newPosition.degrees);

        // change currStep to selectedStep
        if (this._currStep !== nextStep) {
            this.currStep = nextStep;
        }
    }

    transformToLocalCoordinate(point: SVGPoint, event: MouseEvent) {
        point.x = event.clientX;
        point.y = event.clientY;
        return point.matrixTransform((this.SVG as SVGSVGElement).getScreenCTM().inverse());
    }

    private cord2Radius(x: number, y: number): number {
        const rad = Math.atan2(x - this.circleCenterX, -y - this.circleCenterY);
        return rad;
    }

    private deg2Step(deg: number): number {
        const val = this.deg2Value(deg);

        return this.value2Step(val);
    }

    private deg2Value(deg: number): number {
        const range = this.options.maxValue - this.options.minValue;

        return Math.round(deg * (range / 360.0)) + this.options.minValue;
    }

    private step2Value(step: number): number {
        return step * this.options.minValue;
    }

    private value2Step(val: number): number {
        return Math.round((val - this.options.minValue) / this.options.stepValue);
    }

    step2Radius(step: number): number {
        return this.maxSteps === step ? 359.99 : (360 / this.maxSteps) * step;
    }

    private createSVG(size: number): Element {
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

    private createEmptyCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'dashed-circle');
        circle.setAttributeNS(null, 'stroke', 'lightgray');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.strokeDasharray = '5, 2';
        return circle;
    }

    private createClickCircle(): Element {
        const circle = this.createCircle() as SVGSVGElement;
        circle.style.stroke = 'transparent';
        circle.style.strokeWidth = `${this.options.strokeWidth}px`;
        return circle;
    }

    private createSliderCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'slider');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.stroke = `rgba(${this.options.color}, 0.5)`;
        (circle as SVGSVGElement).style.stroke = this.options.color;
        (circle as SVGSVGElement).style.opacity = '0.8';
        (circle as SVGSVGElement).style.transition = 'stroke-dashoffset 0.5s ease-in-out';

        (circle as SVGSVGElement).style.strokeDashoffset = `${this.calculateSliderCircleOffset()}`;
        return circle;
    }

    private createHandle(): Element {
        const handle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        handle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        handle.setAttributeNS(
            null,
            'cy',
            (this.circleCenterY - this.options.radius + this.options.strokeWidth / 2).toString()
        );
        handle.setAttributeNS(null, 'r', this.handlerRadius.toString());
        handle.setAttributeNS(null, 'fill', '#fff');
        handle.setAttributeNS(null, 'class', 'circle-handle');
        handle.setAttributeNS(null, 'id', `circle-handle-${this.radius}`);
        (handle as SVGSVGElement).style.transition = 'all 0.5s ease-in-out';
        (handle as SVGSVGElement).style.transform = 'rotate(' + this.step2Radius(this._currStep) + 'deg)';

        return handle;
    }

    private calculateSliderCircleOffset(): number {
        return (this.maxSteps - this._currStep) * this.getCircumferenceStep();
    }

    private get maxSteps(): number {
        return (this.options.maxValue - this.options.minValue) / this.options.stepValue;
    }

    private getCircumferenceStep(): number {
        return this.circumference / this.maxSteps;
    }

    private createCircle(): Element {
        const circle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        circle.setAttributeNS(null, 'r', this.radius.toString());
        circle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        circle.setAttributeNS(null, 'cy', this.circleCenterY.toString());
        circle.setAttributeNS(null, 'transform', `rotate(-90 ${this.circleCenterX} ${this.circleCenterY})`);
        circle.setAttributeNS(null, 'stroke-dasharray', this.circumference.toString());
        circle.setAttributeNS(null, 'fill', 'none');
        return circle;
    }
}
