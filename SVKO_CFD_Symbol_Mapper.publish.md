# SVKO CFD Symbol Mapper

## Why I built it

I use broker CFD charts, but the broker ticker often differs from the native exchange ticker available on TradingView. I built SVKO CFD Symbol Mapper so my other indicators can find the corresponding native symbol and use its market data without requiring me to enter the same mapping on every chart.

This is a helper indicator. It does not draw trading signals, levels, tables, or volume. Its only job is to resolve the counterpart of the current chart symbol and make that symbol available to a receiving indicator.

## How it works

The indicator contains 803 built in Trade Nation mapping pairs. You can add or replace mappings through the Symbol Mappings input. Custom pairs are checked first, so they override the built in map without changing the script.

Each pair uses a complete TradingView ticker ID on both sides:

```text
TRADENATION:NVDA.EX = NASDAQ:NVDA
IG:AAPL = NASDAQ:AAPL
```

On a Trade Nation, Trade Nation SB, or IG chart, the indicator looks for the broker symbol on the left and returns the native TradingView symbol on the right. On a native TradingView chart, it performs the inverse lookup and returns the first matching CFD symbol.

Pine Script cannot pass a ticker string from one indicator to another through `input.source()`. The Mapper therefore converts the resolved ticker ID into two numeric values named `1st code` and `2nd code`. A receiving indicator reads both hidden plots and reconstructs the complete symbol.

Keeping this logic in a separate indicator provides one large mapping table for several companion scripts. It avoids copying hundreds of pairs into every indicator and lets a mapping correction benefit every connected script.

## Mapping details

Custom mappings take priority over the built in map in both directions. When several CFD symbols point to the same native symbol, inverse lookup returns the first pair in mapping order.

Delayed native exchange prefixes ending in `_DL` or `_DLY` are normalised before lookup. For US native symbols, inverse lookup checks `NASDAQ`, then `NYSE`, then `BATS`. The `TRADENATION:` and `TRADENATIONSB:` prefixes are compacted during transport and restored by compatible receiving indicators.

If no mapping exists, both code plots return zero. The Mapper does not request price, volume, fundamentals, or any other data from the resolved symbol.

## How to use

1. Add SVKO CFD Symbol Mapper to the chart.
2. Open its settings and add any required custom pairs to Symbol Mappings.
3. Add a compatible receiving indicator, such as SVKO Info or SVKO CFD Stocks & NQ-ES Real Volume.
4. In the receiving indicator, select `Map: 1st code` for its `1st code` input and `Map: 2nd code` for its `2nd code` input. Both selections must come from the same Mapper instance.

The Mapper stays visually silent after it is connected. You can keep it on the chart without adding visible plots.

## Inputs

### Symbol Mappings

Enter one `CFD source = native target` pair per line with complete TradingView ticker IDs. The input includes editable Trade Nation Nvidia and IG Apple examples. Custom pairs override the built in map.

## Alerts

This indicator does not define alert conditions.

## Limitations

The transported ticker can contain at most 18 encoded characters. The automatically compacted Trade Nation prefixes do not count at their full displayed length.

Supported transport characters are uppercase letters, digits, dash, colon, dot, and underscore. An unsupported character produces a runtime error.

Delayed exchange normalisation recognises only terminal `_DL` and `_DLY` suffixes. When more than one CFD mapping points to the same native symbol, inverse lookup can return only the first matching pair.

The Mapper only transports a symbol identity. The receiving indicator remains responsible for requesting and interpreting data from that symbol.

## Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.
