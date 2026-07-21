# SVKO CFD Stocks & NQ-ES Real Volume: internal notes

## Publishing settings

- Privacy: Public
- Access: Open-source
- Categories: TODO
- Tags: TODO
- Licence: Mozilla Public License 2.0
- Author's instructions: N/A

## Chart preparation

Use a clean supported CFD chart with clearly visible volume columns and Real VWAP. Prefer a chart and timeframe where the selected source is active. If demonstrating Mapper fallback, add SVKO CFD Symbol Mapper and confirm that both code inputs use the same Mapper instance. Remove unrelated indicators, drawings, and images.

## Publishing procedure

1. Publish and verify SVKO CFD Symbol Mapper first if the demonstration uses automatic fallback.
2. Compile the Volume indicator and verify its saved cloud source through the repo-local Pine sync workflow.
3. Prepare the clean chart and confirm that the volume columns, selected formula, and optional Real VWAP match the public description.
4. Create a separate private open-source test publication using the title and description from `SVKO_CFD_Stocks_and_NQ-ES_Real_Volume.publish.md`.
5. Review the private page, chart image, pane scaling, source visibility, title, and description.
6. After explicit final approval, create a new publication with Privacy set to Public and Access set to Open-source.
7. Inspect the public page immediately while TradingView still permits limited corrections.

## Internal implementation notes

- Explicit Volume formulas always take priority over Mapper fallback.
- The default NQ proxy is `MNQ + 10*NQ + 60*QQQ`.
- The default ES proxy is `MES + 10*ES + 60*SPY`.
- Mapper fallback provides one decoded source with a weight of one.
- The indicator plots standard volume columns in a dedicated pane and forces Real VWAP onto the price pane.

## Development history

- Renamed the SVKO CFD Symbol Mapper fallback inputs to `1st code` and `2nd code` and updated their connection guidance.
- Changed the volume display from visible range price overlay boxes to standard columns in a dedicated pane.
- Added reusable symbol abbreviations and abbreviated default volume formulas, including direct MNQ and MES chart mappings.
- Changed the default volume colours to lighter `#4D4D4D` up columns and darker `#333333` down columns.
- Simplified Inputs to symbol abbreviations, volume formulas, Show VWAP, and Anchor. Moved plot appearance controls to the Style tab and removed legacy and version controls.
- Added default Trade Nation abbreviations and used them as the left side targets in the corresponding volume formulas.
- Renamed the indicator to SVKO CFD Stocks & NQ-ES Real Volume and the VWAP plot to Real VWAP.
- Added explicit stock volume formulas and an optional SVKO CFD Symbol Mapper fallback for supported CFD prefixes.
- Changed Full Session anchoring to support stock sources and treat missing source bars as zero volume after valid data has been observed.

## Pending public release notes

N/A for the initial publication.

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Pine script added to the intended chart
- [ ] Explicit stock and index formulas verified
- [ ] Mapper fallback verified with both code inputs when it will be demonstrated
- [ ] Main Session and Full Session VWAP behaviour verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, volume columns, and Real VWAP are clear
- [ ] Publication title and description are final
- [ ] Proxy and realtime limitations are documented
- [ ] Attribution and licence are verified
- [ ] Privacy, access, categories, and tags are verified
- [ ] Private draft reviewed before public publication
