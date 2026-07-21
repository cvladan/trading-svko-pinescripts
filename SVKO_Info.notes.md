# SVKO Info: internal notes

## Publishing settings

- Privacy: Public
- Access: Open-source
- Categories: TODO
- Tags: TODO
- Licence: Mozilla Public License 2.0
- Author's instructions: N/A

## Chart preparation

Use a clean chart where the bottom right table is legible and the mapped price marker can be seen without overlapping unrelated drawings. For a broker CFD demonstration, add SVKO CFD Symbol Mapper and confirm that `1st code` and `2nd code` use the same Mapper instance. Choose a symbol with available metrics, extended hours data, and a mapped quote. Remove unrelated indicators, drawings, and images.

## Publishing procedure

1. Publish and verify SVKO CFD Symbol Mapper first because the demonstration chart uses it as a companion.
2. Compile SVKO Info and verify its saved cloud source and existing Mapper bindings through the repo-local Pine sync workflow.
3. Prepare the clean chart and confirm that the table and mapped price marker match the public description.
4. Create a separate private open-source test publication using the title and description from `SVKO_Info.publish.md`.
5. Review the private page, chart image, table legibility, source visibility, title, and description.
6. After explicit final approval, create a new publication with Privacy set to Public and Access set to Open-source.
7. Inspect the public page immediately while TradingView still permits limited corrections.

## Internal implementation notes

- Local Mappings always take priority and bypass Mapper fallback completely.
- Broker charts use the resolved native symbol as `calculationSymbol`.
- Native charts use their own standard ticker and can display an inverse mapped CFD counterpart.
- A broker chart with no resolved native symbol finalises silently and skips requests, formatting, drawings, tables, and alert values.
- The mapped price marker primes its dynamic extended session context on the last confirmed historical bar before any market state change can enable realtime updates.
- Performance and history-high data share one cached daily request that refreshes at most once every 30 seconds when the chart receives an update. Intrabar refresh timing uses `varip` and is not reconstructible after reload.
- Optional rows and drawings gate their related requests.
- Input changes are migration sensitive because existing Mapper plot bindings must be preserved.

## Development history

- Top aligned both Performance cells for multiline formats. Pine tables do not expose text line spacing, so no artificial blank line or row-height workaround was added.
- Changed the default Performance format to show the custom since period and 5-day value on the first line, followed by the 1-month and year-to-date values on the second line.
- Added `<nl>` and `<cnl>` Performance format controls for unconditional and value-dependent line breaks without consuming the 12-value placeholder limit.
- Limited the shared Performance and history-high daily request to one refresh per 30 seconds on active chart updates.
- Fixed `RE10058` when a broker chart crossed from an open to a closed market by resolving Mapper fallback on the last confirmed historical bar and priming the mapped extended session request before realtime display can begin.
- Renamed the SVKO CFD Symbol Mapper fallback inputs to `1st code` and `2nd code` and updated their connection guidance.
- Removed the Version input without changing calculations or display.
- Added delayed native chart support. `_DL` and `_DLY` exchange suffixes are removed for mapping identity and display while the original delayed ticker remains the native data source.
- Added Broker exchange prefixes and allowed native charts to display their own metrics without requiring a counterpart mapping.
- Changed unresolved mapping handling to finalise silently after the fallback check, render no output, and skip all expensive data and display paths.
- Added `TRADENATIONSB:` broker recognition and decoding for Mapper's compact `TNSB_` transport prefix.
- Added a first position Mappings group with three editable default pairs. Local matches bypass SVKO CFD Symbol Mapper while retaining Mapper as a fallback.
- Fixed the mapped price marker to use the latest extended session one minute quote instead of the last regular session close.
- Added a prominent 365 day History window input as the main Performance speed control, omitted out of window Performance items, and changed the high row to a dynamic `Xd High` label.
- Added one custom Performance row with rolling days, fixed 30 day months, fixed 360 day years, year to date, and arbitrary `since` dates through one shared regular session daily request.
- Changed the mapped price marker defaults to a 50 bar candle distance, a 100 bar line length, and Dotted line style.
- Added a default enabled option to show the mapped price marker only while the chart symbol's market is closed, a configurable candle distance, and a custom label template.
- Added mapped price label font size, line style, line width, and line colour inputs.
- Changed the mapped price label to an 11 point monospace `SYMBOL @ EXCHANGE · X` format and reapplied the selected line width on every update.
- Added a reusable mapped price line and transparent left aligned text box whose colour reflects a fixed 0.1% comparison threshold. Zero line length disables its request and drawing.
- Reordered settings into Mapper sources, Company Name, Mapped Price Marker, Market Data, Earnings, and Table Styling groups while preserving existing values through explicit input migration.
- Added an optional average analyst price target row with directional upside or downside percentage runway.
- Added an optional first row company name with one maximum length input. Zero hides the row and disables its request.
- Changed the Earnings row to bold red text when the next report is 10 or fewer calendar days away.
- Fixed live table background colour and frame width changes by rebuilding the selected colour at runtime and reapplying the frame width on the last bar.
- Changed table defaults to 12 point monospace text with no outer frame and removed the artificial frame width maximum.
- Added table font family, outer frame width, background colour, row height, and numeric font size controls.
- Removed inner cell borders.
- Replaced the earnings toggle with a 20 day display window. Zero disables the complete earnings request, row, and alert path.
- Added exchange local earnings formatting with `X` as the complete countdown placeholder.
- Added the hidden `Days to Earnings` plot for manually configured Crossing alerts.
- Added a history high row with age, decline, required recovery, and optional price and date details.
- Changed every optional metric to gate its full data path and bundled compatible daily requests.
- Changed symbol selection so broker charts calculate from their mapped native symbol, while native TradingView charts calculate directly from the chart symbol.
- Added decoding for Mapper's compact Trade Nation transport prefixes.
- Fixed extended hours values on chart symbols that stop trading before the mapped symbol by retrieving the mapped symbol's latest extended intrabar independently of the chart time axis.
- Changed extended hours detail to follow the mapped symbol's trading day and to use one common regular session baseline.
- Changed all table cells to use left aligned text consistently.
- Expanded Mapper decoding to support digits, underscores, and dots.
- Changed ATR to use daily timeframe data regardless of chart timeframe.
- Reduced mapped symbol requests to last bar table updates and consolidated daily data into tuple requests.
- Changed Mapper decoding so the symbol is read once per script load after the received codes resolve to a valid symbol or explicit empty mapping.
- Guarded empty or prefixless Mapper output before any mapped symbol request.
- Replaced separate stale premarket and postmarket rows with one current Extended Hours row.

## Pending public release notes

N/A for the initial publication.

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Pine script added to the intended chart
- [ ] Local Mappings verified in both directions
- [ ] Mapper fallback verified with both existing source bindings preserved
- [ ] Broker and native chart behaviour verified
- [ ] Optional rows and mapped price marker verified
- [ ] `Days to Earnings` alert source verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Table and mapped price marker are legible
- [ ] Publication title and description are final
- [ ] Realtime, lookahead, data availability, and performance limitations are documented
- [ ] Attribution and licence are verified
- [ ] Privacy, access, categories, and tags are verified
- [ ] Private draft reviewed before public publication
