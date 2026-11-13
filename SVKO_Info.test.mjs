import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./SVKO_Info.pine', import.meta.url), 'utf8');
const pegCell = source.split('\n').find(line => line.includes('"PEG " + formatNumber(pegRatio)'));
assert.ok(pegCell, 'The valuation row must contain a separate PEG cell.');
const greenCondition = pegCell.match(/text_color = (.*?) \? color\.lime : color\.white/)[1];
const boldCondition = pegCell.match(/text_formatting = (.*?) \? text\.format_bold : text\.format_none/)[1];

function evaluate(condition, pegRatio) {
    return vm.runInNewContext(condition.replaceAll(' and ', ' && '), { pegRatio });
}

test('PEG highlights only positive values and uses strict unrounded thresholds', () => {
    const cases = [
        [0.29, true, true],
        [0.299, true, true],
        [0.30, true, false],
        [0.49, true, false],
        [0.499, true, false],
        [0.50, false, false],
        [0, false, false],
        [-0.2, false, false],
        [NaN, false, false],
    ];
    for (const [value, green, bold] of cases) {
        assert.equal(evaluate(greenCondition, value), green, `Green for PEG ${value}`);
        assert.equal(evaluate(boldCondition, value), bold, `Bold for PEG ${value}`);
    }
});

const pegFunction = source.match(/pegValue\(float valuationPrice, float epsTtm, float previousYearEps\) =>\n    float annualGrowthPercent = (.*?)\n    (.*?)\n/);
assert.ok(pegFunction, 'The PEG calculation must be available for regression checks.');
function calculatePeg(valuationPrice, epsTtm, previousYearEps) {
    const expression = `const annualGrowthPercent = ${pegFunction[1]}; ${pegFunction[2]}`
        .replaceAll('math.abs', 'Math.abs').replaceAll(' and ', ' && ').replace(/\bna\b/g, 'NaN');
    return vm.runInNewContext(expression, { valuationPrice, epsTtm, previousYearEps });
}

test('PEG matches captured built-in values on the same closed candles', () => {
    // TradingView built-in observations captured on 13 November 2026.
    const fixtures = [
        ['META', 641.39, 29.3266, 22.6322, 0.7393934221234546],
        ['NVDA', 162.15, 7.9106, 3.5135, 0.16378764683466276],
        ['AAPL', 356.67, 8.9745, 7.4593, 1.9565206332585043],
        ['MSFT', 524.62, 19.1482, 14.0559, 0.7562433448501289],
        ['GOOG', 292.13, 19.1548, 10.1372, 0.1714453003498462],
        ['ASML', 1337.6, 34.9994, 24.2209, 0.8588110256974115],
        ['INTC', 115.97, -2.1201, -4.7628, -0.9858339979711566],
    ];
    for (const [symbol, price, eps, prior, expected] of fixtures) {
        assert.ok(Math.abs(calculatePeg(price, eps, prior) - expected) < 1e-12, symbol);
    }
});

test('PEG stays unavailable for nonpositive growth or missing denominators', () => {
    for (const [price, eps, prior] of [[390.25, .9091, 1.4966], [28.82, .6992, 1.7156], [100, 2, 2], [100, 2, 0], [100, 0, -1], [100, 2, NaN], [NaN, 2, 1]]) {
        assert.ok(Number.isNaN(calculatePeg(price, eps, prior)));
    }
});
