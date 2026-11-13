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
