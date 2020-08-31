import { CircularSliderOptions, IPosition } from './circular-slider-options.model';

type TouchEventType = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';

export class CircularSlider {
    private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    options: CircularSliderOptions;
    circleCenterX: number;
    circleCenterY: number;
    circumference: number;
    radius: number;
    currValue: number;
    value: number;
    _currStep: number = 0;
    position: IPosition;
    isDragging = false;
    lastTouchType: TouchEventType;

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

    /**
     * Calculates Radius for handler
     */
    get handlerRadius(): number {
        return this.options.strokeWidth / 2 + 2;
    }

    /**
     * Based on Angle it calculates new Position
     * @param angleRad selected angle from which we calculate position
     */
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

    /**
     * Initializes base slider
     * @private
     */
    private initSlider() {
        this.circleCenterX = 0;
        this.circleCenterY = 0;
        this.radius = this.options.radius - this.options.strokeWidth / 2;
        this.circumference = this.radius * 2 * Math.PI;
        this.currValue = this.options.minValue;
        this.position = this.calculateNewPosition(
            this.cord2Radius(this.circleCenterX, this.circleCenterY - this.radius)
        );

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

    /**
     * Method which is called when we expect that callback is called.
     * @param value Optional value which we want to pass to callback.
     */
    actOnValueChange(value?: number): void {
        if (this.options.onValueChange && typeof this.options.onValueChange === 'function') {
            this.options.onValueChange(value || this.step2Value(this._currStep));
        }
    }

    /**
     * Setter for current step
     * @param step Current step number to which we want to move slider
     */
    set currStep(step: number) {
        if (isNaN(step) || step < 0 || this.maxSteps < step) {
            throw new Error(`Current step can be any number between 0 and ${this.maxSteps} (${step})`);
        }

        this._currStep = step;
        this.actOnValueChange();
        (this.handle as SVGSVGElement).style.transition = 'all 0.5s ease-in-out';
        (this.slider as SVGSVGElement).style.transition = 'stroke-dashoffset 0.5s ease-in-out';

        const radius = this.step2Radius(this._currStep);
        requestAnimationFrame(() => {
            (this.slider as SVGSVGElement).style.strokeDashoffset = `${this.calculateSliderCircleOffset()}`;
            (this.handle as SVGSVGElement).style.transform = `rotate(${radius}deg)`;
        });
    }

    /**
     * Initializes all event listeners for Slider to act on user input
     * @private
     */
    private initEventHandlers(): void {
        this.container.addEventListener('mousemove', (event) => this.handleDrag(event));
        this.container.addEventListener('mouseup', (event) => this.cancelDrag(event));
        this.container.addEventListener('mouseleave', (event) => this.cancelDrag(event));

        this.handle.addEventListener('touchmove', (event) => this.handleTouch(event));
        this.container.addEventListener('touchcancel', (event) => this.handleTouch(event));
        this.container.addEventListener('touchend', (event) => this.handleTouch(event));

        this.clickCircle.addEventListener('click', (event) => this.handleSliderClick(event));
        this.clickCircle.addEventListener('touchend', (event) => this.handleTouch(event));
        this.clickCircle.addEventListener('touchstart', (event) => this.handleTouch(event));

        this.slider.addEventListener('click', (event) => this.handleSliderClick(event));
        this.slider.addEventListener('touchend', (event) => this.handleTouch(event));
        this.slider.addEventListener('touchstart', (event) => this.handleTouch(event));

        this.handle.addEventListener('touchstart', (event) => this.handleTouch(event));
        this.handle.addEventListener('mousedown', (event) => this.startDrag(event));
    }

    /**
     * Acts on user touch events
     * @param event
     */
    handleTouch(event: Event): void {
        event.preventDefault();
        const touches = (event as TouchEvent).changedTouches;

        if (touches.length > 1) return;

        const touch = touches[0];
        const events: TouchEventType[] = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const mouseEvents = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
        const ev = events.indexOf(event.type as TouchEventType);

        if (ev === -1) return;

        const type = event.type === events[2] && this.lastTouchType === events[0] ? 'click' : mouseEvents[ev];
        const simulatedEvent = document.createEvent('MouseEvent');
        simulatedEvent.initMouseEvent(
            type,
            true,
            true,
            window,
            1,
            touch.screenX,
            touch.screenY,
            touch.clientX,
            touch.clientY,
            false,
            false,
            false,
            false,
            0,
            null
        );

        touch.target.dispatchEvent(simulatedEvent);
        this.lastTouchType = event.type as TouchEventType;
    }

    /**
     * Offset as a tolerance which is used for checking when drag is stopped.
     */
    get dragTolerance(): number {
        return this.options.strokeWidth * 2;
    }

    /**
     * Simple getter from which we can get back main slider color.
     */
    get color(): any {
        return this.options.color;
    }

    /**
     * Handler which moves the slider or cancels the drag because mouse went over tolerance limit.
     * @param event
     */
    handleDrag(event: Event): void {
        event.preventDefault();
        if (this.isDragging === false) {
            return;
        }

        const point = (this.SVG as SVGSVGElement).createSVGPoint();
        const coords = this.transformToLocalCoordinate(point, event as MouseEvent);
        const mouseEvent = event as MouseEvent;
        const mHandleOffsetY = this.position.y - mouseEvent.y;
        const mHandleOffsetX = this.position.x - mouseEvent.x;

        if (mHandleOffsetX > this.dragTolerance || mHandleOffsetY > this.dragTolerance) {
            this.cancelDrag(event);
        } else {
            const angleRadians = this.cord2Radius(coords.x, coords.y);
            this.moveSlider(angleRadians);
        }
    }

    /**
     * Tests whether we can move slider to new position or not.
     * @param position
     */
    canMoveSlider(position: IPosition): boolean {
        return !(
            this.position.y < 0 &&
            ((this.position.x >= 0 && position.x < 0) || (this.position.x < 0 && position.x >= 0))
        );
    }

    /**
     * Updates all the required attributes for slider to change view
     * @param nextStep Next step number to which we want to move slider
     * @param newPosition New Position object which includes all information for moving to next Step
     */
    updateSlider(nextStep: number, newPosition: IPosition): void {
        this.position = newPosition;
        this.value = this.deg2Value(newPosition.degrees);

        if (this.currStep !== nextStep) {
            this.actOnValueChange(this.step2Value(nextStep));
        }
    }

    /**
     * Tries to move the slider to new position
     * @param radians
     */
    moveSlider(radians: number): void {
        const newPosition = this.calculateNewPosition(radians);

        if (!this.canMoveSlider(newPosition)) {
            return;
        }

        const nextStep = this.deg2Step(newPosition.degrees);
        this.updateSlider(nextStep, newPosition);

        (this.handle as SVGSVGElement).style.transition = '';
        (this.slider as SVGSVGElement).style.transition = '';

        requestAnimationFrame(() => {
            (this.slider as SVGSVGElement).style.strokeDashoffset = `${this.circumference - newPosition.path}`;
            (this.handle as SVGSVGElement).style.transform = `rotate(${newPosition.degrees}deg)`;
        });
    }

    /**
     * Marks slider state as it is dragging
     * @param event Mouse event
     */
    startDrag(event: Event): void {
        event.preventDefault();
        this.value = this.currValue;
        this.isDragging = true;
    }

    /**
     * Marks slider state that it is not dragging anymore and if was dragging before updates it with new slider step.
     * @param event Mouse event
     */
    cancelDrag(event: Event): void {
        event.preventDefault();
        if (this.isDragging) {
            this.currValue = this.value;
            this.currStep = this.value2Step(this.currValue);
        }

        this.isDragging = false;
    }

    /**
     * Handles users click directly on slider and recalculates new step which then re-renders.
     * @param event
     * @private
     */
    private handleSliderClick(event: Event): void {
        const svgPoint = (this.SVG as SVGSVGElement).createSVGPoint();
        const localCoords = this.transformToLocalCoordinate(svgPoint, event as MouseEvent);
        const newPosition = this.calculateNewPosition(this.cord2Radius(localCoords.x, localCoords.y));
        const nextStep = this.deg2Step(newPosition.degrees);

        if (this._currStep !== nextStep) {
            this.currValue = this.step2Value(nextStep);
            this.currValue = this.value = this.step2Value(nextStep);
            this.currStep = nextStep;
        }
    }

    transformToLocalCoordinate(point: SVGPoint, event: MouseEvent) {
        point.x = event.clientX;
        point.y = event.clientY;

        return point.matrixTransform((this.SVG as SVGSVGElement).getScreenCTM().inverse());
    }

    /**
     * Calculates Radius from passed coordinates
     * @param x X coordinate
     * @param y Y coordinate
     * @private
     */
    private cord2Radius(x: number, y: number): number {
        return Math.atan2(x - this.circleCenterX, -y - this.circleCenterY);
    }

    /**
     * Calculates Step from passed Degree
     * @param deg Degree which is used for calculating step
     * @private
     */
    private deg2Step(deg: number): number {
        const val = this.deg2Value(deg);

        return this.value2Step(val);
    }

    /**
     * Calculates Value from passed degree
     * @param deg Degree which is used for calculating value
     * @private
     */
    private deg2Value(deg: number): number {
        const range = this.options.maxValue - this.options.minValue;

        return Math.round(deg * (range / 360.0)) + this.options.minValue;
    }

    /**
     * Calculates Value from passed step
     * @param step Step which is used for calculating value
     * @private
     */
    private step2Value(step: number): number {
        return step * this.options.stepValue + this.options.minValue;
    }

    /**
     * Calculates Step from passed value
     * @param val Value which is used for calculating step
     * @private
     */
    private value2Step(val: number): number {
        return Math.round((val - this.options.minValue) / this.options.stepValue);
    }

    /**
     * Calculates Radius from passed step
     * @param step Step which is used for calculating radius
     */
    step2Radius(step: number): number {
        return this.maxSteps === step ? 359.99 : (360 / this.maxSteps) * step;
    }

    /**
     * Renders SVG element
     * @param size
     * @private
     */
    private createSVG(size: number): Element {
        const svg = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'svg');
        svg.setAttributeNS(null, 'viewBox', `-300 -300 600 600`);

        svg.setAttributeNS(null, 'width', size.toString());
        svg.setAttributeNS(null, 'height', size.toString());
        svg.setAttributeNS(null, 'id', 'sliderSVG');

        return svg;
    }

    /**
     * Generates Slider background circle which includes dotted stroke
     * @private
     */
    private createEmptyCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'dashed-circle');
        circle.setAttributeNS(null, 'stroke', 'lightgray');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.strokeDasharray = '5, 2';
        return circle;
    }

    /**
     * Generates Circle which is used for click/touch events
     * @private
     */
    private createClickCircle(): Element {
        const circle = this.createCircle() as SVGSVGElement;
        circle.style.stroke = 'transparent';
        circle.style.strokeWidth = `${this.options.strokeWidth}px`;
        return circle;
    }

    /**
     * Generates Circle which marks the value && shows to the user which part of slider is selected.
     * @private
     */
    private createSliderCircle(): Element {
        const circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'slider');
        (circle as SVGSVGElement).style.strokeWidth = `${this.options.strokeWidth}px`;
        (circle as SVGSVGElement).style.stroke = `rgba(${this.options.color}, 0.5)`;
        (circle as SVGSVGElement).style.stroke = this.options.color;
        (circle as SVGSVGElement).style.opacity = '0.8';
        (circle as SVGSVGElement).style.transition = 'stroke-dashoffset 0.5s ease-in-out';

        (circle as SVGSVGElement).style.strokeDashoffset = `${this.circumference}`;
        return circle;
    }

    /**
     * Generates Handle for slider which is then used for Drag movement
     * @private
     */
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

    /**
     * Calculates how many steps should be available based on min and max value
     * @private
     */
    private get maxSteps(): number {
        return (this.options.maxValue - this.options.minValue) / this.options.stepValue;
    }

    private getCircumferenceStep(): number {
        return this.circumference / this.maxSteps;
    }

    /**
     * Base SVG Circle helper which generates based circle element.
     * @private
     */
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
