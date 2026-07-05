// factor = how many base units in 1 of this unit
const CATS = {
  Length: { base: 'm', units: { Meters: 1, Kilometers: 1000, Centimeters: 0.01, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254, Yards: 0.9144 } },
  Weight: { base: 'g', units: { Grams: 1, Kilograms: 1000, Pounds: 453.592, Ounces: 28.3495, Stone: 6350.29, Tonnes: 1e6 } },
  Volume: { base: 'L', units: { Liters: 1, Milliliters: 0.001, 'Gallons (US)': 3.78541, 'Cups (US)': 0.236588, 'Fluid oz': 0.0295735, 'Pints (US)': 0.473176 } },
  Speed:  { base: 'm/s', units: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'Knots': 0.514444, 'ft/s': 0.3048 } },
  Data:   { base: 'B', units: { Bytes: 1, Kilobytes: 1024, Megabytes: 1048576, Gigabytes: 1073741824, Terabytes: 1099511627776 } },
  Temperature: { special: true, units: ['Celsius', 'Fahrenheit', 'Kelvin'] },
};
const $ = id => document.getElementById(id);
let cat = 'Length';

const tabs = $('tabs');
Object.keys(CATS).forEach((c, i) => {
  const b = document.createElement('button');
  b.textContent = c; if (i === 0) b.classList.add('on');
  b.onclick = () => { document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = c; loadUnits(); };
  tabs.appendChild(b);
});

function unitNames() { const c = CATS[cat]; return c.special ? c.units : Object.keys(c.units); }
function loadUnits() {
  const names = unitNames();
  [$('fromU'), $('toU')].forEach(sel => { sel.innerHTML = ''; names.forEach(n => sel.add(new Option(n, n))); });
  $('toU').selectedIndex = Math.min(1, names.length - 1);
  convert();
}
function toBase(val, u) {
  if (CATS[cat].special) { // to Celsius
    if (u === 'Fahrenheit') return (val - 32) * 5 / 9;
    if (u === 'Kelvin') return val - 273.15;
    return val;
  }
  return val * CATS[cat].units[u];
}
function fromBase(val, u) {
  if (CATS[cat].special) { // from Celsius
    if (u === 'Fahrenheit') return val * 9 / 5 + 32;
    if (u === 'Kelvin') return val + 273.15;
    return val;
  }
  return val / CATS[cat].units[u];
}
function fmt(n) { return Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-4 && n !== 0) ? n.toExponential(4) : +n.toFixed(6); }
function convert() {
  const v = +$('fromVal').value || 0;
  const fu = $('fromU').value, tu = $('toU').value;
  const res = fromBase(toBase(v, fu), tu);
  $('toVal').value = fmt(res);
  $('eq').textContent = `${v} ${fu} = ${fmt(res)} ${tu}`;
}
$('fromVal').addEventListener('input', convert);
$('fromU').addEventListener('change', convert);
$('toU').addEventListener('change', convert);
$('swap').onclick = () => {
  const a = $('fromU').value; $('fromU').value = $('toU').value; $('toU').value = a;
  $('fromVal').value = $('toVal').value || $('fromVal').value; convert();
  const s = $('swap'); s.classList.remove('spin'); void s.offsetWidth; s.classList.add('spin');
};
// click the result to copy it
$('toVal').addEventListener('click', () => {
  const v = $('toVal').value;
  if (navigator.clipboard) navigator.clipboard.writeText(v);
  if (window.UI) UI.toast('Result copied · ' + v, 'success');
});
$('toVal').style.cursor = 'pointer';
$('toVal').title = 'Click to copy';
loadUnits();
