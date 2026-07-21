# SVKO CFD Symbol Mapper: internal notes

## Publishing settings

- Privacy: Public
- Access: Open-source
- Categories: TODO
- Tags: TODO
- Licence: Mozilla Public License 2.0
- Author's instructions: N/A

## Chart preparation

Use a clean chart with SVKO CFD Symbol Mapper and one visible receiving indicator that demonstrates the connection. The Mapper itself is visually silent. Confirm that both receiving inputs use `Map: 1st code` and `Map: 2nd code` from the same Mapper instance. Remove unrelated indicators, drawings, and images before creating the publication.

## Publishing procedure

1. Compile and verify the saved cloud source through the repo-local Pine sync workflow.
2. Prepare the clean demonstration chart and confirm the receiving indicator resolves a mapped symbol.
3. Create a separate private open-source test publication using the title and description from `SVKO_CFD_Symbol_Mapper.publish.md`.
4. Review the private script page, chart image, source visibility, title, and description.
5. After explicit final approval, create a new publication with Privacy set to Public and Access set to Open-source.
6. Inspect the public page immediately while TradingView still permits limited corrections.

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

## Pending public release notes

N/A for the initial publication.

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Pine script added to the intended chart
- [ ] Receiving indicator connected to both code plots
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, Pine script name, and receiving output are clear
- [ ] Publication title and description are final
- [ ] Limitations and transport behaviour are documented
- [ ] Attribution and licence are verified
- [ ] Privacy, access, categories, and tags are verified
- [ ] Private draft reviewed before public publication
