# SVKO CFD NQ-ES Levels: internal notes

## Detailed user documentation

### Purpose and levels

SVKO CFD NQ-ES Levels translates the mapped underlying market's daily percentage change into price levels on Nasdaq 100 and S&P 500 CFD charts. It makes the mapped move visible directly on the CFD chart without manual conversion.

The central `0%` level is the CFD price implied when the mapped symbol's standard daily Change % is zero. With the default 0.5% step and two levels on either side, the displayed set is:

```text
-1.0%
-0.5%
 0.0%
+0.5%
+1.0%
```

The optional current-price label remains live and shows the chart price's percentage distance from the stored `0%` basis.

### Calculation and snapshot behaviour

TradingView does not expose the watchlist Change % column directly to Pine. The indicator reproduces it from the mapped symbol's current daily close and previous daily close, removes that percentage move from the current CFD price, and stores the resulting `0%` basis.

The first valid live basis is cached for the active calculation symbol. It changes only when that symbol changes, the indicator reloads, or an input change causes a reload. This keeps all levels fixed during a calculation period while the current-price label continues to move.

The basis is not tick-rounded, so its initial percentage matches the mapped symbol's reproduced Change % without an additional rounding difference. The last confirmed historical bar does not commit the cache; the initial snapshot waits for the mapped symbol's current last-bar value.

### Mappings and sessions

The indicator owns two independent mapping lists because the reference changes by session. The active session mapping always has priority over the optional SVKO CFD Symbol Mapper fallback.

The default weekday main session is `09:30-16:00` in `America/New_York`. During that session, the defaults use QQQ for Nasdaq 100 CFDs and SPY for S&P 500 CFDs:

```text
IG:NASDAQ = NASDAQ:QQQ
TRADENATION:USTEC = NASDAQ:QQQ
TRADENATIONSB:USTEC = NASDAQ:QQQ
IG:SPTRD = AMEX:SPY
TRADENATION:US500 = AMEX:SPY
TRADENATIONSB:US500 = AMEX:SPY
```

Outside the main session, the defaults use current NQ, MNQ, and ES continuous futures:

```text
IG:NASDAQ = CME_MINI:NQ1!
TRADENATION:USTEC = CME_MINI:MNQ1!
TRADENATIONSB:USTEC = CME_MINI:MNQ1!
IG:SPTRD = CME_MINI:ES1!
TRADENATION:US500 = CME_MINI:ES1!
TRADENATIONSB:US500 = CME_MINI:ES1!
```

Each custom entry must use one complete TradingView source and target ticker pair per line. Native TradingView charts calculate from their own standard ticker; supported broker charts calculate from the active mapped target.

When the active mapping list has no match, **Broker prefixes** limits which broker charts can use the counterpart symbol decoded by SVKO CFD Symbol Mapper. The default eligible prefixes are `IG`, `TRADENATION`, and `TRADENATIONSB`.

Add the Mapper to the same chart and connect:

- **1st code** to `Map: 1st code`;
- **2nd code** to `Map: 2nd code` from the same Mapper instance.

Both codes are required. If either input remains on `close`, the Mapper returns no mapping, or the decoded symbol is invalid, the indicator stays empty and makes no fallback daily request. The Mapper supplies one fallback calculation symbol for either session. Use the local lists whenever the main session and outside main session require different reference symbols.

### Position and display defaults

The default distance from the latest candle is 50 one-minute bar equivalents. The `0%` line defaults to 400 one-minute bar equivalents, while other levels default to 200. On higher chart timeframes, these values are converted to fewer chart bars to preserve approximately the same elapsed-time spacing. The combined distance and each line length are capped at 500 future chart bars.

The default level labels are enabled, use 10-point monospace text, and follow `<price> / <percent>`. Labels are right-aligned at the right end of their lines. Zero, upper, and lower levels have separate line styles, widths, line colours, and text colours. The `0%` level defaults to an opaque `#B3B3B3` dotted line; upper levels use lime and lower levels use red.

The moving current-price label defaults to `<percent>`. Its position input uses:

- `0` to place a left-aligned label immediately after the latest candle;
- a positive value to add that many empty chart bars;
- `-1` to preserve the older right-aligned position at the level-line endpoint.

Leave the current-price label format empty to hide that label.

### Alerts

The indicator defines no alert conditions.

### Limitations

The reproduced percentage uses TradingView daily data rather than a direct watchlist read. Futures daily closes can inherit settlement behaviour from TradingView's ticker settings.

The `0%` basis is a live snapshot. Reloading at another time can produce a different basis, and historical bars cannot reproduce the exact time of an earlier live snapshot. No future data is used.

Feed timing, spreads, currencies, sessions, instrument specifications, and data permissions can make the CFD and calculation symbol diverge. If neither the active mapping nor the configured Mapper fallback supplies a valid symbol, or if daily data is unavailable, the indicator draws nothing.

### Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.

## Chart preparation

Use a clean supported Nasdaq 100 or S&P 500 CFD chart. Choose a timeframe that leaves the 0% line, secondary levels, and current price label legible. Confirm that the active session mapping resolves. When demonstrating the fallback, add SVKO CFD Symbol Mapper and connect both code inputs from the same instance. Remove unrelated scripts, drawings, and images from the chart.

## Publishing procedure

1. Assume the saved cloud script has already been compiled, synced, and versioned through the Pine sync workflow.
2. Use the existing `SVKO Publish` chart and the existing script instance when present. Do not add a duplicate or open another layout merely for publication.
3. Publish directly with Privacy set to Public and Access set to Open-source using the exact TradingView-formatted description from `SVKO_CFD_NQ-ES_Levels.publish.txt` after explicit action-time confirmation.
4. Inspect the public page immediately while TradingView still permits limited corrections, including title, rendered description, chart image, categories, access, and source visibility.

## Internal implementation notes

- An active session mapping takes priority over the optional SVKO CFD Symbol Mapper fallback.
- The Mapper fallback is limited by `Broker prefixes`, requires both code inputs from one Mapper instance, and makes no daily request when it cannot resolve a valid symbol.
- The Mapper provides one fallback calculation symbol for either session.
- It owns separate main session and outside main session mapping lists because the reference changes between QQQ or SPY and futures.
- The 0% basis is stored in `varip` state after the first valid live last bar request for the active calculation symbol.
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
- Added an optional SVKO CFD Symbol Mapper fallback with configurable broker prefixes and two code inputs. Active session mappings retain priority, and unresolved fallback input remains silent without a daily request.

## Publication record

- Submitted: 21 July 2026
- Public page URL: https://www.tradingview.com/script/VWtZmFRE-SVKO-CFD-NQ-ES-Levels/

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Exact saved script is available in the existing `SVKO Publish` layout
- [ ] Both mapping lists resolve on the selected chart, or the intended Mapper fallback is connected and verified
- [ ] Main session and outside main session behaviour verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, name, levels, and current price label are clear
- [ ] Publication title and description are final
- [ ] Snapshot and realtime behaviour are documented
- [ ] Attribution and licence are verified
