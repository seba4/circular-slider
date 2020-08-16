import './styles/style.scss';
import { CircularSlider } from './slider/circular-slider';

const container = 'slider';
const radius = document.getElementById('slider').offsetWidth / 2;
const example1 = new CircularSlider({ container, radius: radius });
const example2 = new CircularSlider({ container, radius: radius - 1 * 35 });
const example3 = new CircularSlider({ container, radius: radius - 2 * 35 });
const example4 = new CircularSlider({ container, radius: radius - 3 * 35 });
const example5 = new CircularSlider({ container, radius: radius - 4 * 35 });

console.log('CircularSlider was successfully constructed: ', example1);
