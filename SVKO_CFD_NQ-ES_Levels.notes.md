# SVKO CFD NQ-ES Levels: internal notes

## Publishing settings

- Privacy: Public
- Access: Open-source
- Categories: TODO
- Tags: TODO
- Licence: Mozilla Public License 2.0
- Author's instructions: N/A

## Chart preparation

Use a clean supported Nasdaq 100 or S&P 500 CFD chart. Choose a timeframe that leaves the 0% line, secondary levels, and current price label legible. Confirm that the active session mapping resolves and that no unrelated scripts, drawings, or images appear on the chart.

## Publishing procedure

1. Compile and verify the saved cloud source through the repo-local Pine sync workflow.
2. Prepare the clean chart and confirm that the active mapping, 0% basis, secondary levels, and current price label are legible.
3. Create a separate private open-source test publication using the title and description from `SVKO_CFD_NQ-ES_Levels.publish.md`.
4. Review the private page, chart image, source visibility, title, description, and absence of any stated Mapper dependency.
5. After explicit final approval, create a new publication with Privacy set to Public and Access set to Open-source.
6. Inspect the public page immediately while TradingView still permits limited corrections.

## Internal implementation notes

- This indicator does not use SVKO CFD Symbol Mapper.
- It owns separate main session and outside main session mapping lists because the reference changes between QQQ or SPY and futures.
- The 0% basis is stored in `varip` state after the first valid live last bar request for the active mapping.
- The optional current price label remains live after the basis has been stored.

## Development history

- Removed the Version input without changing calculations or display.
- Changed level calculations to remain fixed after the first valid snapshot and refresh only when the indicator reloads.
- Fixed initial level calculation when the chart has an open realtime bar.
- Changed the default mappings to the supported Nasdaq and USTEC pairs and increased the default line length to 400 one minute bar equivalents.
- Changed the default label format and font size, and changed the 0% level to a dotted opaque `#B3B3B3` grey style.
- Added an independent 0% line length with a 400 one minute bar default and changed the other level lines to a 200 one minute bar default.
- Right aligned all level lines and label boxes.
- Added an optional moving white current price label that defaults to the percentage distance from the cached 0% level.
- Removed tick rounding from the cached 0% basis and current price percentage calculation so the initial percentage matches the mapped symbol's Change % exactly.
- Prevented the last confirmed historical bar from committing the cache so the initial snapshot uses the mapped symbol's current last bar Change %.
- Changed the default futures mappings from delayed to realtime TradingView feeds and stopped mapped symbol requests after the first valid basis is cached.
- Added separate main session mappings with QQQ and SPY defaults, added ES pairs to both mapping sets, removed the SVKO CFD Symbol Mapper fallback, and limited recalculation to mapping changes and reloads.
- Renamed the indicator and chart display name to `SVKO CFD NQ-ES Levels`.
- Changed level distance and line length settings to one minute bar equivalents that scale down automatically on higher chart timeframes.
- Added one current price positioning input. `0` places a left aligned label immediately after the latest candle, positive values add padding, and `-1` preserves the previous right aligned position.

## Pending public release notes

N/A for the initial publication.

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Pine script added to the intended chart
- [ ] Both mapping lists resolve on the selected chart
- [ ] Main session and outside main session behaviour verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, name, levels, and current price label are clear
- [ ] Publication title and description are final
- [ ] Snapshot and realtime behaviour are documented
- [ ] Attribution and licence are verified
- [ ] Privacy, access, categories, and tags are verified
- [ ] Private draft reviewed before public publication
