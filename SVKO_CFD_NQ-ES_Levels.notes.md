# SVKO CFD NQ-ES Levels: internal notes

## Detailed user documentation

### Purpose and levels

SVKO CFD NQ-ES Levels translates the mapped underlying market's daily percentage change into price levels on Nasdaq 100 and S&P 500 CFD charts. It makes the mapped move visible directly on the CFD chart without manual conversion.

The central `0%` level is the CFD price implied when the mapped symbol's standard daily Change % is zero. The `0%` level is always present. A flexible definition table controls every additional percentage level, including exact chart symbol overrides and ranges derived from the chart symbol's ATR.

### Level definitions

**Level definitions** is the first settings group. It contains one text area with a required `DEFAULT` definition and any number of optional exact chart symbol overrides. The default input is:

```text
DEFAULT = -ATR/2 to ATR step 1
```

The complete table can combine a general default with symbol specific definitions:

```text
DEFAULT = -ATR/2 to ATR step 1
TRADENATION:NFLX = 2, 1.5, 1, 0, -1, -2, -3
NASDAQ:NVDA = -ATR to ATR step 0.5
TRADENATION:USTEC = -ATR/2 to ATR+1, step 0.5
```

The indicator compares override keys with the complete standard chart ticker ID. An exact chart symbol match replaces the whole `DEFAULT` level definition. The mapped calculation symbol does not affect this lookup. When no exact override exists, the indicator uses `DEFAULT`. The `DEFAULT` keyword and syntax keywords are not case sensitive. When the same key appears more than once, the last entry wins.

Each definition can combine comma separated percentages and ranges:

```text
2, 1.5, 1, 0, -2, -2.5
3 to -4
3 to -4 step 0.5
-1 to 0.5 step 0.5, 1.5, 3, 3.5, 5 to 7
```

A range uses `START to END` and can run upwards or downwards. Its default step is `1`. Add `step SIZE` to use another positive interval. The optional comma before `step` is accepted, so both of these forms are valid:

```text
-ATR to ATR+1 step 0.5
-ATR to ATR+1, step 0.5
```

Range endpoints must align with the selected step after ATR resolution. Use decimal points because commas separate definition items. The indicator automatically adds `0%`, removes duplicate values, sorts the final percentages, and accepts up to 50 unique levels. A malformed active definition displays one compact error message and draws no partial level set.

### ATR based ranges

`ATR` means the last confirmed daily `ATR(14)` of the chart symbol. It never uses either session source mapping or SVKO CFD Symbol Mapper. This keeps the volatility measurement tied to the instrument visible on the chart.

The indicator converts the price based ATR into a percentage of the cached `0%` basis:

```text
ATR percentage = confirmed daily ATR(14) / cached 0% basis × 100
```

The result is stored with the level set. It does not expand and contract during the current daily bar. Expressions can use `ATR`, `+ATR`, or `-ATR`. An optional `/N` can immediately follow `ATR`, where `N` is any positive integer or decimal divisor. An optional signed number after that adds or subtracts percentage points. For example:

```text
ATR/2
-ATR/2
+ATR/3.5
ATR/2+1
-ATR/2-0.5
```

Division is applied to ATR first, followed by the leading sign and then the percentage-point adjustment. Therefore, `-ATR/2+1` means `-(ATR / 2) + 1`. A zero or negative divisor is invalid. Parentheses, multiplication, chained division, and other general arithmetic are not supported.

ATR endpoints are rounded away from zero to the range step. This guarantees that the outer level covers at least the requested ATR expression. For example, if the converted ATR is `1.23%`, the default lower endpoint is `-0.615%` before rounding and the upper endpoint is `+1.23%`. With a step of `1`, the default definition resolves as follows:

```text
-1%
 0%
+1%
+2%
```

In the same example, `-ATR to ATR+1, step 0.5` resolves its outer endpoints to `-1.5%` and `+2.5%`.

The optional current-price label remains live and shows the chart price's percentage distance from the stored `0%` basis.

### Calculation and snapshot behaviour

TradingView does not expose the watchlist Change % column directly to Pine. The indicator reproduces it from the mapped symbol's current daily close and previous daily close, removes that percentage move from the current CFD price, and stores the resulting `0%` basis.

The first valid live basis is cached for the active calculation symbol. It changes only when that symbol changes, the indicator reloads, or an input change causes a reload. This keeps all levels fixed during a calculation period while the current-price label continues to move.

The basis is not tick-rounded, so its initial percentage matches the mapped symbol's reproduced Change % without an additional rounding difference. The last confirmed historical bar does not commit the cache; the initial snapshot waits for the mapped symbol's current last-bar value.

The indicator parses the definition table once when the script loads and resolves its percentage set when the `0%` basis changes. It creates reusable line and text objects instead of deleting and recreating them. Pine rolls back drawing changes before each new execution on an open realtime bar, so the indicator must reapply the fixed object coordinates on every realtime update. The percentage definition and ATR boundary are not reparsed on those updates. The moving current price label also follows every realtime price update. An active definition without `ATR` makes no ATR request.

### Source mappings and sessions

The **Source mappings** group owns two independent mapping lists because the reference changes by session. The fields are named **Outside main session** and **During main session**. The existing **Main session** control remains in the same group. The active session source mapping always has priority over the optional SVKO CFD Symbol Mapper fallback.

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

ATR ranges use the last confirmed daily ATR rather than the developing current daily ATR. They therefore remain stable during the day but do not reflect volatility added by the current unfinished daily bar. ATR divisors must be positive. The active definition is limited to 50 unique levels. Invalid syntax, an unavailable required ATR value, or a range whose endpoints do not align with its step produces a visible configuration error and no partial levels.

### Credits and licence

Original work by SVKO. Open source + commercial licence under the SVKO Personal Use and Commercial Licence 1.0. Individuals may use and modify the script free of charge for personal use, including trading real money for their own profit. Company use, work for an employer or client, integration, redistribution, bundling and hosting as part of a business require a separate paid commercial agreement, even if the script is supplied free to clients. This is a source-available licence, not an OSI open-source licence.

[Licence terms and commercial enquiries](https://trading.cvladan.com/licensing/).

## Chart preparation

Use a clean supported Nasdaq 100 or S&P 500 CFD chart. Choose a timeframe that leaves the 0% line, secondary levels, and current price label legible. Confirm that the active session mapping resolves. When demonstrating the fallback, add SVKO CFD Symbol Mapper and connect both code inputs from the same instance. Remove unrelated scripts, drawings, and images from the chart.

## Publishing procedure

1. Assume the saved cloud script has already been compiled, synced, and versioned through the Pine sync workflow.
2. Use the existing `SVKO Publish` chart and the existing script instance when present. Do not add a duplicate or open another layout merely for publication.
3. Publish directly with Privacy set to Public and Access set to Open-source using the exact TradingView-formatted description from `SVKO_CFD_NQ-ES_Levels.publish.txt` after explicit action-time confirmation.
4. Inspect the public page immediately while TradingView still permits limited corrections, including title, rendered description, chart image, categories, access, and source visibility.

## Internal implementation notes

- `Level definitions` is the first input. Its exact chart symbol overrides are independent of both session source mappings and Mapper fallback.
- `DEFAULT` is required, `0%` is inserted before parsing, and the final unique values are sorted in ascending order.
- The confirmed daily ATR request runs only when the active chart symbol definition contains `ATR`.
- ATR endpoints are rounded away from zero on the active range step after conversion against the cached `0%` basis.
- Level percentages and ATR boundaries persist across realtime updates. Existing line and box objects are reused, while their coordinates are reapplied on each realtime execution because Pine rolls drawing changes back between open bar updates.
- An active session mapping takes priority over the optional SVKO CFD Symbol Mapper fallback.
- The Mapper fallback is limited by `Broker prefixes`, requires both code inputs from one Mapper instance, and makes no daily request when it cannot resolve a valid symbol.
- The Mapper provides one fallback calculation symbol for either session.
- It owns separate main session and outside main session mapping lists because the reference changes between QQQ or SPY and futures.
- The 0% basis is stored in `varip` state after the first valid live last bar request for the active calculation symbol.
- The optional current price label remains live after the basis has been stored.

## Development history

22 September 2026: the local source notice and licensing documentation were changed to SVKO Personal Use and Commercial Licence 1.0. Executable Pine code is unchanged. This records local preparation only; no TradingView cloud sync or publication update has been verified for this licensing change. Previously published MPL-2.0 permissions remain valid for the code they cover.


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
- Replaced the fixed step and level count controls with one `Level definitions` table that supports `DEFAULT`, exact chart symbol overrides, explicit values, ascending or descending ranges, optional steps, and chart symbol daily ATR expressions. Moved `Levels` to the first settings group, renamed `Mappings` to `Source mappings`, shortened its two mapping field names, raised the level capacity to 50, added clear configuration errors, cached the resolved percentage set, and retained reusable drawing objects with rollback safe realtime updates.
- Added an optional positive divisor directly after `ATR`, documented its evaluation order and limits, and changed the default to `DEFAULT = -ATR/2 to ATR step 1`.

## Publication record

- Submitted: 21 July 2026
- Public page URL: https://www.tradingview.com/script/VWtZmFRE-SVKO-CFD-NQ-ES-Levels/

## Pre-publish checklist

- [x] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [x] Cloud source re-fetched and verified
- [x] Exact saved script is available in the existing `SVKO Publish` layout
- [ ] Both mapping lists resolve on the selected chart, or the intended Mapper fallback is connected and verified
- [ ] `Level definitions` default, exact chart symbol override, explicit list, mixed ranges, ATR division, ATR rounding, duplicate removal, and invalid syntax verified
- [x] Existing inputs and Mapper source bindings migrated from the previous stable input IDs without unintended resets
- [ ] Main session and outside main session behaviour verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, name, levels, and current price label are clear
- [ ] Publication title and description are final
- [ ] Snapshot and realtime behaviour are documented
- [ ] Attribution and licence are verified
