import './styles/style.scss';
import { CircularSlider } from './slider/circular-slider';

function updateLegendValue(id: string, value: number) {
    document.getElementById(id).getElementsByClassName('value')[0].innerHTML = value.toString();
}

function updateLegendColor(id: string, color: any) {
    (document
        .getElementById(id)
        .getElementsByClassName('legendColor')[0] as SVGSVGElement).style.backgroundColor = color;
}

const container = 'slider';
const example1 = new CircularSlider({
    color: 'red',
    container,
    radius: 190,
    maxValue: 5000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example1', value)
});
const example2 = new CircularSlider({
    color: 'green',
    container,
    radius: 160,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example2', value)
});
const example3 = new CircularSlider({
    color: 'yellow',
    container,
    radius: 130,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example3', value)
});
const example4 = new CircularSlider({
    color: 'orange',
    container,
    radius: 100,
    maxValue: 4000,
    minValue: 1000,
    stepValue: 1000,
    onValueChange: (value: number) => updateLegendValue('example4', value)
});

example1.currStep = 0;
example2.currStep = 1;
example3.currStep = 2;
example4.currStep = 3;

updateLegendColor('example1', example1.color);
updateLegendColor('example2', example2.color);
updateLegendColor('example3', example3.color);
updateLegendColor('example4', example4.color);
