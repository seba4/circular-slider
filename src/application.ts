import './styles/style.scss';
import { CircularSlider } from './slider/circular-slider';

function updateLegendValue(id: string, value: number) {
    document.getElementById(id).getElementsByClassName('value')[0].innerHTML = value.toString();
}

const container = 'slider';
const radius = document.getElementById('slider').offsetWidth / 2;
const strokeWidth = 50;

const example1 = new CircularSlider({
    color: 'red',
    container,
    radius: radius,
    maxValue: 5000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example1', value)
});
const example2 = new CircularSlider({
    color: 'green',
    container,
    radius: radius - 1 * strokeWidth * 1.5,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example2', value)
});
const example3 = new CircularSlider({
    color: 'yellow',
    container,
    radius: radius - 2 * strokeWidth * 1.5,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example3', value)
});
const example4 = new CircularSlider({
    color: 'orange',
    container,
    radius: radius - 3 * strokeWidth * 1.5,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example4', value)
});
const example5 = new CircularSlider({
    color: 'grey',
    container,
    radius: radius - 4 * strokeWidth * 1.5,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example5', value)
});

example1.currStep = 0;
example2.currStep = 1;
example3.currStep = 2;
example4.currStep = 3;
example5.currStep = 4;
