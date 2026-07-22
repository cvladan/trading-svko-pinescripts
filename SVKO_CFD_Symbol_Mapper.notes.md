# SVKO CFD Symbol Mapper: internal notes

## Detailed user documentation

### Purpose

SVKO CFD Symbol Mapper resolves broker CFD tickers to their native TradingView symbols and performs reverse lookups for compatible indicators. It provides one shared mapping source instead of requiring every receiving script to carry the same mapping table.

The Mapper is a visually silent helper. It does not draw signals, levels, tables, or volume, and it does not request price, volume, fundamentals, or other data from the resolved symbol.

### Mapping format and precedence

Enter one complete CFD-to-native ticker pair per line in **Symbol Mappings**:

```text
TRADENATION:NVDA.EX = NASDAQ:NVDA
IG:AAPL = NASDAQ:AAPL
```

Custom pairs are checked before the built-in Trade Nation map and take priority in both directions. On a supported broker chart, the Mapper returns the native TradingView symbol. On a native TradingView chart, it returns the first matching CFD symbol.

When several CFD symbols point to the same US listing, inverse lookup uses deterministic `NASDAQ`, then `NYSE`, then `BATS` precedence. This also handles native symbols that TradingView standardises to its BATS feed. Mapping order determines the first result when several CFD sources still resolve to the same target.

Delayed native exchange suffixes `_DL` and `_DLY` are removed for lookup identity. The original delayed chart symbol remains the chart's own data source.

### Connecting a receiving indicator

Pine `input.source()` cannot transport a ticker string directly, so the Mapper encodes the resolved ticker into two hidden numeric plots:

- `1st code`
- `2nd code`

Add the Mapper and the compatible receiving indicator to the same chart. In the receiving indicator, select `Map: 1st code` for its **1st code** input and `Map: 2nd code` for its **2nd code** input. Both sources must come from the same Mapper instance.

Compatible receiving indicators currently include:

- SVKO Info
- SVKO CFD Stocks & NQ-ES Real Volume

If no mapping is found, both transport plots return zero and the receiving indicator decides how to handle the unresolved result.

### Transport details and limitations

The resolved ticker is split into two chunks of up to nine encoded characters, for an 18-character transport limit. Supported characters are uppercase letters, digits, dash, colon, dot, and underscore. An unsupported character or an overlong ticker produces a runtime error.

Long Trade Nation exchange prefixes are compacted during transport and expanded by compatible receivers:

```text
TRADENATION:   -> TN_
TRADENATIONSB: -> TNSB_
```

The transport contains symbol identity only. The receiving indicator is responsible for requesting the mapped symbol and interpreting its data.

### Alerts

The Mapper defines no alert conditions.

### Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.

## Chart preparation

Use a clean chart with SVKO CFD Symbol Mapper and one visible receiving indicator that demonstrates the connection. The Mapper itself is visually silent. Confirm that both receiving inputs use `Map: 1st code` and `Map: 2nd code` from the same Mapper instance. Remove unrelated indicators, drawings, and images before creating the publication.

## Publishing procedure

1. Assume the saved cloud script has already been compiled, synced, and versioned through the Pine sync workflow.
2. Use the existing `SVKO Publish` chart as the publication image without repeating indicator tests.
3. Publish directly with Privacy set to Public and Access set to Open-source using the exact TradingView-formatted description from `SVKO_CFD_Symbol_Mapper.publish.txt` after explicit action-time confirmation.
4. Inspect the public page immediately while TradingView still permits limited corrections.

## Publication record

- Submitted: 21 July 2026
- Public page URL: https://www.tradingview.com/script/XCvJ5tx9-SVKO-CFD-Symbol-Mapper/

## Internal implementation notes

- The built in fallback map contains 803 Trade Nation pairs.
- The script publishes two hidden numeric plots because Pine `input.source()` cannot transport a ticker string directly.
- Custom Symbol Mappings override the built in map in both directions.
- Compatible receiving scripts currently include SVKO Info and SVKO CFD Stocks & NQ-ES Real Volume.

## Development history

- Changed the indicator name to `SVKO CFD Symbol Mapper` and its short title to `Map`.
- Renamed the two transport plots to `1st code` and `2nd code`.
- Renamed Mappings to Symbol Mappings, added active Trade Nation Nvidia and IG Apple examples, and added detailed connection guidance.
- Removed the Version input and the single input Mapping group.
- Added inverse mapping for delayed native charts by removing terminal `_DL` and `_DLY` exchange suffixes before lookup.
- Added `TRADENATIONSB:` broker recognition and compact `TNSB_` transport for bidirectional mappings.
- Corrected BAC, DSY.JO, EOAN.DE, ASML.AS, and WBD fallback mappings, and removed unresolved AMS.JO and ROCKB.CO entries.
- Added bidirectional lookup. Trade Nation and IG charts return their native TradingView symbol, while native charts return the first matching CFD symbol.
- Added deterministic NASDAQ before NYSE before BATS precedence for inverse lookup, including native symbols that TradingView standardises to its BATS feed.
- Added compact Trade Nation prefix transport so long inverse results such as `TRADENATION:NFLX.EX` remain compatible with the existing two plot channels.
- Removed the chart symbol table so the Mapper stays visually silent.
- Added dot support for class share symbols such as `BATS:BRK.B`.
- Added a built in fallback map that is checked when the custom mapping input has no match.
- Loaded the validated Trade Nation symbol pairs from `tradenation/tradenation-symbol-pairs.txt` into the fallback map.
- Expanded encoding to support digits and underscores in mapped symbols.

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Exact saved script is available in the existing `SVKO Publish` layout
- [ ] Receiving indicator connected to both code plots
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, Pine script name, and receiving output are clear
- [ ] Publication title and description are final
- [ ] Limitations and transport behaviour are documented
- [ ] Attribution and licence are verified
