# SVKO Info: internal notes

## Detailed user documentation

### Purpose and output

SVKO Info displays key market information for a chart symbol and its mapped native counterpart in one compact table. It is designed for following an exchange-listed underlying from a broker CFD chart without leaving the chart.

Depending on enabled inputs and TradingView data availability, the table can show:

- company and symbol identity;
- a custom multi-period Performance row;
- current extended-hours movement;
- a configurable history high with age, decline, recovery, price, and date details;
- daily ATR as a percentage;
- the next earnings date and countdown, or the most recent reported release and elapsed days;
- average analyst target with upside or downside runway;
- trailing and forward P/E data.

Each optional feature gates its related request and formatting path. A disabled feature does not continue fetching its data.

### Symbol resolution

SVKO Info first checks its own **Mappings** input. Enter one complete source-to-target TradingView ticker pair per line:

```text
TRADENATION:AAPL = NASDAQ:AAPL
TRADENATION:MSFT = NASDAQ:MSFT
TRADENATION:NVDA = NASDAQ:NVDA
```

Local mappings work in both directions, have priority, and bypass Mapper fallback completely. Broker charts use the resolved native symbol as the calculation symbol. Native TradingView charts use their own standard ticker and can display an inverse-mapped CFD counterpart when one exists.

When no local mapping matches, SVKO Info can use SVKO CFD Symbol Mapper. Add the Mapper to the same chart, then connect:

- **1st code** to `Map: 1st code`;
- **2nd code** to `Map: 2nd code` from the same Mapper instance.

The Mapper's built-in fallback currently contains 803 Trade Nation pairs. That count is an implementation detail recorded here rather than in the durable public description. If a broker symbol cannot be resolved by either method, SVKO Info remains silent and skips its data, drawing, and table paths.

The default broker exchange prefixes are `IG`, `TRADENATION`, and `TRADENATIONSB`. Delayed native `_DL` and `_DLY` exchange suffixes are removed only for mapping identity and display; the delayed ticker itself remains the native chart data source.

### Performance and history window

Performance uses regular-session daily closes. It supports up to 12 unique value placeholders in one formatted row:

- `<last-N-days>`
- `<last-N-months>`
- `<last-N-years>`
- `<since-YYYY-MM-DD>`
- `<last-month>`
- `<last-year>`
- `<ytd>`
- `<this-year>`

Use `<nl>` for an unconditional line break and `<cnl>` for a line break shown only when the following segment contains at least one available value. Control placeholders do not count towards the 12-value limit. Months use 30 days and years use 360 days.

The default format is:

```text
<since-2026-04-01> since 1 Apr, <last-5-days> 5D<nl><last-month> 1M, <ytd> YTD
```

The **History window (days)** input defaults to 365 and is the main Performance speed control. A requested period beginning before that window is omitted together with its comma-separated item. The same daily history request supplies the history-high row and refreshes at most once every 30 seconds when the chart receives an update. Leaving **Performance format** blank disables the complete Performance path.

Performance excludes dividends, currency conversion, position sizing, fees, and extended-hours movement.

### Market data and mapped price marker

Extended-hours data compares the active premarket or postmarket price with the most recent regular-session close. The value follows the mapped symbol's trading day and is a current-display value rather than a historical signal. Daily ATR uses daily data regardless of the chart timeframe and defaults to a 14-day length.

The optional mapped price marker places the mapped native symbol's latest available one-minute extended-session quote beside broker CFD candles. By default it:

- appears only while the chart market is closed;
- starts 50 chart bars after the latest candle;
- uses a 100-bar dotted white line;
- shows an 11-point label formatted as `<symbol> @ <exchange> · <price>`.

Set line length to `0` to hide the marker and disable its mapped-price request. The combined distance and line length cannot exceed 500 future bars. Native TradingView charts never request or display the marker. Its colour compares the mapped quote with the chart price using a fixed 0.1% threshold.

### Company, earnings, valuation, and table defaults

The company-name row defaults to a 20-character limit. Set the limit to `0` to hide the row and disable its request.

The Earnings row uses separate windows for upcoming and recent reports. The upcoming window defaults to 20 days with the format `EEE, dd MMM, in X`. The recent window defaults to 15 full elapsed days with the format `was X ago at dd MMM`. `X` inserts `1 day` or `N days`, and a report on the current day appears as `0 days`. Other supported date tokens are `EEEE`, `EEE`, `yyyy`, `yy`, `MMMM`, `MMM`, `MM`, `dd`, `HH`, `hh`, `mm`, `ss`, and `a`. Use `a` as a standalone token for AM or PM so letters inside literal words remain unchanged.

An upcoming report inside its window has priority. When none qualifies, the row shows the most recent reported release if it is inside the recent window. Upcoming reports within 10 days use bold red text, while recent reports use the normal table style. Setting either window to `0` disables only that request and display path. Setting both to `0` disables the complete earnings path.

The table defaults to 12-point monospace text, automatic row height, transparent background, no inner borders, and no outer frame. Table font family, size, row height, frame width, and background colour are configurable.

Company metadata, earnings, analyst targets, P/E ratios, and mapped quotes depend on TradingView coverage and the user's market-data permissions. Missing values appear as `N/A` where applicable.

### Realtime and historical limitations

Current-bar table values and mapped quotes can change before the bar closes. Performance refresh timing uses `varip`; an intrabar refresh state cannot be reconstructed after a reload.

The mapped price marker and extended-hours row can update only when the chart receives an update. They cannot refresh independently after the chart symbol stops producing updates. Their realtime request priming uses a last-confirmed-historical-bar path so a later market-state change does not introduce a new dynamic request.

The script uses lookahead only where it pairs the requested series with the required historical offset or where the value is explicitly a current-display tool. It does not use future data for historical signals. Data-feed timing, sessions, permissions, and missing fundamentals can still make displayed values incomplete.

### Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.

## Chart preparation

Use a clean chart where the bottom right table is legible and the mapped price marker can be seen without overlapping unrelated drawings. For a broker CFD demonstration, add SVKO CFD Symbol Mapper and confirm that `1st code` and `2nd code` use the same Mapper instance. Choose a symbol with available metrics, extended hours data, and a mapped quote. Remove unrelated indicators, drawings, and images.

## Publishing procedure

1. Assume the saved cloud script has already been compiled, synced, and versioned through the Pine sync workflow.
2. Use the existing `SVKO Publish` chart and the existing script instance when present. Do not add a duplicate or open another layout merely for publication.
3. For an update, select the existing SVKO Info publication and paste only the newest dated block from **Public release notes** in `SVKO_Info.publish.txt`.
4. Keep the existing published chart unless a future update explicitly requires a replacement image.
5. Verify the publication target, release note, saved script version, and chart replacement choice before submitting once.
6. Inspect the public page after the update, including the new release note, script version, chart image, access, and source visibility, then record the verified result below.

## Internal implementation notes

- Local Mappings always take priority and bypass Mapper fallback completely.
- Broker charts use the resolved native symbol as `calculationSymbol`.
- Native charts use their own standard ticker and can display an inverse mapped CFD counterpart.
- A broker chart with no resolved native symbol finalises silently and skips requests, formatting, drawings, and tables.
- The mapped price marker primes its dynamic extended session context on the last confirmed historical bar before any market state change can enable realtime updates.
- Performance and history-high data share one cached daily request that refreshes at most once every 30 seconds when the chart receives an update. Intrabar refresh timing uses `varip` and is not reconstructible after reload.
- Optional rows and drawings gate their related requests.
- The Earnings row bundles its enabled daily values into one request. The reported earnings history uses the calculation symbol and does not run when the recent window is `0`.
- Input changes are migration sensitive because existing Mapper plot bindings must be preserved.

## Development history

- Added an optional recent earnings window and format. The Earnings row now prefers an upcoming report, then shows the most recent reported release with full elapsed days when it is still inside the recent window.
- Removed the hidden `Days to Earnings` plot and its manually configured alert path.
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

## Publication record

- Submitted: 21 July 2026
- Public page URL: https://www.tradingview.com/script/XP6l9CnM-SVKO-Info/

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Exact saved script is available in the existing `SVKO Publish` layout
- [ ] Local Mappings verified in both directions
- [ ] Mapper fallback verified with both existing source bindings preserved
- [ ] Broker and native chart behaviour verified
- [ ] Optional rows and mapped price marker verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Table and mapped price marker are legible
- [ ] Publication title and description are final
- [ ] Newest dated public release note is final and matches `SVKO_Info.publish.txt`
- [ ] Exact existing publication and chart replacement choice are verified
- [ ] Realtime, lookahead, data availability, and performance limitations are documented
- [ ] Attribution and licence are verified
