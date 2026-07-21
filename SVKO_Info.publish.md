# SVKO Info

## Why I built it

I use CFD charts, but the broker symbol often hides the native TradingView listing that provides the market data I want to follow. I built SVKO Info to keep the important information for that underlying symbol in one compact table without leaving the chart.

I use it to see the chart symbol and its mapped counterpart, multi-period performance, extended hours movement, a configurable history high, daily ATR, earnings, analyst target, and P/E ratios. On supported broker charts, it can also place the latest mapped price on the chart scale so I can compare the CFD with the native market.

## How it works

SVKO Info first decides which symbol should supply its calculations. On a broker CFD chart, it uses the mapped native TradingView symbol. On a native TradingView chart, it uses the chart symbol itself and can show an available inverse mapped CFD counterpart.

The bottom right table can show:

- Company name
- Chart symbol and mapped counterpart
- Configurable multi-period price performance
- Current extended hours change
- High within the selected history window
- Daily ATR as a percentage
- Next earnings date and countdown
- Average analyst target and percentage runway
- Current and forward P/E ratios

Every optional row has a setting. Disabling a row also disables its related data request. Native charts can display their own metrics without any mapping. A broker chart remains silent when no native counterpart can be resolved.

The optional mapped price marker is available on supported broker charts. It uses the mapped symbol's latest available extended session one minute price and places a configurable line and label to the right of the latest candle. The label is green when the mapped price is more than 0.1% above the chart close, red when it is more than 0.1% below, and white inside that range.

## Mapping and SVKO CFD Symbol Mapper

SVKO Info provides two mapping levels.

First, it checks its own Mappings input. This is useful for the small set of symbols you use most often. The default list contains Apple, Microsoft, and Nvidia Trade Nation pairs. A local match works without any companion indicator and always takes priority.

When the local list has no match, SVKO Info can use SVKO CFD Symbol Mapper as a fallback. The Mapper contains 803 built in Trade Nation pairs plus user supplied overrides. Keeping that large table in a separate helper avoids duplicating hundreds of pairs inside every receiving indicator.

Pine Script cannot pass a ticker string directly between indicators through `input.source()`. The Mapper therefore sends the ticker as two hidden numeric plots. Connect `1st code` to `Map: 1st code` and `2nd code` to `Map: 2nd code` from the same Mapper instance.

Both local and Mapper mappings work forward and in reverse. Delayed native exchange suffixes `_DL` and `_DLY` are normalised for mapping and display, while the original delayed ticker remains the data source on a native chart.

## How to use

1. Add SVKO Info to the chart.
2. For the symbols you use most often, add complete `source=target` pairs to Mappings.
3. For access to the larger shared mapping table, add SVKO CFD Symbol Mapper to the same chart.
4. Set `1st code` to `Map: 1st code` and `2nd code` to `Map: 2nd code` from that Mapper instance.
5. Enable only the rows and drawings you want.
6. Adjust History window before selecting long Performance periods.
7. Use Table Styling and Mapped Price Marker settings to fit the chart layout.

For a native TradingView symbol, no mapping is required to display native metrics. Mapping is needed only to show a counterpart or to resolve the native calculation symbol from a broker CFD chart.

## Inputs

### Mappings and Mapper fallback

Mappings accepts one complete `source=target` TradingView ticker pair per line. Local pairs are checked first in both directions. The defaults are `TRADENATION:AAPL=NASDAQ:AAPL`, `TRADENATION:MSFT=NASDAQ:MSFT`, and `TRADENATION:NVDA=NASDAQ:NVDA`.

`1st code` and `2nd code` receive the two hidden plots from the same SVKO CFD Symbol Mapper instance. They are used only when Mappings has no match.

Broker exchange prefixes identifies broker charts whose metrics should come from the mapped native symbol. Enter prefixes without colons. Spaces and letter case are ignored. The default is `IG, TRADENATION, TRADENATIONSB`.

### History and performance

History window (days) controls the shared daily history used by Performance and the history high. It defaults to 365 days and is the main performance speed control. Smaller values usually calculate faster. A Performance period that begins before the configured boundary is omitted.

Performance format creates one table row with up to 12 unique value placeholders. Its default is `<since-2026-04-01> since 1 Apr, <last-5-days> 5D<nl><last-month> 1M, <ytd> YTD`. Supported forms are `<last-N-days>`, `<last-N-months>`, `<last-N-years>`, `<since-YYYY-MM-DD>`, `<last-month>`, `<last-year>`, `<ytd>`, and `<this-year>`. Months use 30 days and years use 360 days. Use `<nl>` for an unconditional new line inside the value cell. Use `<cnl>` for a new line that appears only when its following segment contains at least one calculated performance value. That segment ends at the next `<nl>` or `<cnl>`. The two control placeholders do not count towards the 12-value limit. Put each value placeholder and its label in a separate comma separated item so an out of window item can be removed cleanly. Leave the field blank to disable the complete Performance path.

For example, `<last-5-days> 5D, <last-month> 1M<cnl><ytd> YTD, <since-2026-04-01> since 1 Apr` keeps the shorter periods on the first line. It adds the second line only when YTD or the custom since period has a calculated value.

Show history high displays the regular session high within History window, its age, the decline from that high, and the rise required to recover it. The label follows the selected window, such as `365d High`. Show history-high price and date adds the price and exchange calendar date.

### Company and market data

Max characters shows the calculation symbol's company name as the first row and truncates longer names. The default is 20. Set it to 0 to disable the row and its request.

Show extended-hours change compares the active premarket or postmarket price with the most recent regular session close. It is enabled by default.

Show ATR percentage displays daily ATR as a percentage of daily price. ATR length defaults to 14.

Show analyst average target displays TradingView's average target and its directional percentage distance from the current calculation symbol price. Show P/E ratios displays current and forward P/E when available. Both are enabled by default.

### Earnings

Show earnings within (days) displays the row only when the next report is within the chosen calendar day window. It defaults to 20 days. The row becomes bold red at 10 days or fewer. Set it to 0 to disable the earnings request, row, and alert values.

Earnings format supports date tokens and `X`, which inserts the complete countdown. The default is `EEE, dd MMM, in X`.

### Mapped price marker

Show only while chart market is closed is enabled by default. It hides the marker and skips realtime mapped price updates while the chart market is open. The script primes the mapped extended session context once on historical data so the marker can start safely when the market closes. Disable the option to show the marker whenever mapped price data is available.

Distance from candle defaults to 50 chart bars. Line length defaults to 100 and can be set to 0 to disable the marker and its request. The combined distance and length cannot exceed 500 future bars.

Line width, style, and colour control the marker line. The defaults are one pixel, Dotted, and white. Label font size defaults to 11 pt.

Label format supports `<symbol>`, `<exchange>`, and `<price>`. Other text remains literal. The default is `<symbol> @ <exchange> · <price>`.

### Table styling

Table font size defaults to 12 pt. Table row height defaults to 0 for automatic sizing. The Performance label and value are top aligned when its format creates multiple text lines. Table font family defaults to Monospace. Table frame width defaults to 0, which hides the outer frame. Table background colour defaults to fully transparent. Inner cell borders are not displayed.

## Alerts

`Days to Earnings` is a hidden numeric plot for manually configured TradingView alerts. In the alert dialog, select SVKO Info and `Days to Earnings`, choose `Crossing`, and enter the required number of days.

The script does not emit an alert by itself. You can create several alerts with different thresholds. When Show earnings within (days) is 0, the plot contains no values and cannot trigger. On a broker CFD chart, the countdown comes from the mapped native symbol, while recalculation still follows updates from the chart.

## Limitations

Company metadata, mapped quotes, analyst targets, extended hours data, historical daily data, earnings, EPS, and forward P/E depend on TradingView's data coverage and the user's data permissions. Unavailable values appear as `N/A` where applicable.

Performance is a regular session price return. It does not include dividends, currency conversion, position sizing, fees, or extended hours movement. Performance and the shared history-high data refresh at most once every 30 seconds, on the first chart update after that interval. Pine Script cannot run an independent timer, so no refresh occurs while the chart receives no data updates. The latest daily price can change while the regular session is open. Rolling boundaries, earnings countdown, and history high age use the current time, so their values can change when the script recalculates.

The extended hours row uses the latest available one minute context for the calculation symbol and compares premarket and postmarket prices with the same most recent regular session close. The two component percentages are contextual and are not added together. Its last bar display uses lookahead only to obtain the latest table value. It is not intended as a historical signal or backtest series.

The table requests live data only for the current last chart bar. The 30-second Performance and history-high refresh interval uses intrabar state and cannot be reconstructed from elapsed realtime updates after a script reload. The mapped price marker also primes its extended session context once on the last confirmed historical bar, then updates its price on the current last bar only while the marker is allowed to display. If the chart symbol stops producing updates, the mapped quote cannot refresh independently. It updates after a new chart update, chart change, refresh, or settings reload.

Daily ATR always uses the calculation symbol's daily timeframe, regardless of the chart timeframe. The mapped price marker uses the latest available extended session one minute quote and is never displayed on native TradingView charts.

A broker chart absent from Mappings requires correctly connected Mapper sources. When neither mapping method resolves a native symbol, SVKO Info renders nothing and skips its mapped data paths. A native chart does not require a counterpart mapping to display its own metrics.

## Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.
