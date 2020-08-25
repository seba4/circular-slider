import './styles/style.scss';
import { CircularSlider } from './slider/circular-slider';

const container = 'slider';
const radius = document.getElementById('slider').offsetWidth / 2;
const example1 = new CircularSlider({
    color: 'red',
    container,
    radius: radius,
    maxValue: 1000,
    minValue: 100,
    stepValue: 100
});
const example2 = new CircularSlider({
    color: 'green',
    container,
    radius: radius - 1 * 35,
    maxValue: 6000,
    minValue: 5000,
    stepValue: 200
});
const example3 = new CircularSlider({
    color: 'yellow',
    container,
    radius: radius - 2 * 35,
    maxValue: 1000,
    minValue: 100,
    stepValue: 5
});
const example4 = new CircularSlider({
    color: 'orange',
    container,
    radius: radius - 3 * 35
});
const example5 = new CircularSlider({ container, radius: radius - 4 * 35 });

example1.currStep = 3;
example2.currStep = 3;
example3.currStep = 100;
example4.currStep = 5;

console.log('CircularSlider was successfully constructed: ', example1);
