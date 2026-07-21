# SVKO CFD NQ-ES Levels

## Why I built it

I use Nasdaq 100 and S&P 500 CFD charts, but I also follow the daily percentage change of the underlying exchange traded market. I built this indicator to translate that mapped daily change into practical price levels directly on the CFD chart.

The main level is 0%. It represents the chart price implied when the mapped symbol's standard daily Change % is zero. I use the levels around that anchor to see where the CFD price sits in percentage terms without manually converting the mapped market's daily move.

## How it works

Pine Script cannot read the Change % column from a TradingView watchlist. The indicator reproduces the value from the mapped symbol's current daily close and previous daily close.

It removes that percentage change from the current chart price to calculate the 0% basis. It then places evenly spaced levels above and below the basis. With the default settings, the five levels are `-1%`, `-0.5%`, `0%`, `+0.5%`, and `+1%`.

The first valid 0% basis is stored for the active mapping. The mapped symbol is not requested again until the active mapping changes at a main session boundary, the indicator reloads, or an input changes. This keeps the levels fixed during each mapping period. The optional current price label is not fixed and continues to show the chart price's live percentage distance from the stored 0% basis.

## Mapping and sessions

This indicator has its own two mapping lists and does not require SVKO CFD Symbol Mapper.

During the configured weekday main session in the `America/New_York` time zone, it uses Main session mappings. The defaults map Nasdaq and USTEC CFDs to `NASDAQ:QQQ`, and S&P 500 CFDs to `AMEX:SPY`.

Outside the main session, it uses Outside main session mappings. The defaults map Nasdaq and USTEC CFDs to NQ or MNQ futures, and S&P 500 CFDs to ES futures.

Each entry uses one complete TradingView `source=target` ticker pair per line. Keeping both lists inside this indicator is intentional because the required reference symbol changes with the trading session. The general SVKO CFD Symbol Mapper provides one counterpart per chart symbol, while this indicator needs two session dependent counterparts.

## How to use

1. Add the indicator to a supported Nasdaq 100 or S&P 500 CFD chart.
2. Confirm that the current chart symbol appears on the left side of both mapping lists.
3. Adjust Main session if your workflow uses different New York session hours.
4. Choose the percentage step and the number of levels above and below 0%.
5. Use the Position, style, and text settings to place the levels clearly beside the latest candle.

No companion Mapper indicator or source connection is required.

## Inputs

### Mappings

Outside main session mappings contains the futures references used outside the configured main session. Main session mappings contains the QQQ and SPY references used during the main session. Main session defaults to `09:30-16:00` on weekdays in `America/New_York`.

### Levels

Step (%) sets the percentage distance between adjacent levels and defaults to 0.5%. Steps above and Steps below control how many secondary levels appear on either side of 0%, with two on each side by default.

### Position and appearance

Distance from candle and line length values use 1 minute bar equivalents. On higher chart timeframes, the indicator reduces the actual chart bar count so the approximate elapsed time remains similar. The default distance is 50 one minute bars. The 0% line defaults to 400 one minute bars, while the other lines default to 200.

The zero, upper, and lower levels have independent line and text styles. Labels default to `<price> / <percent>` at 10 pt and remain aligned to the right end of their lines.

### Current price

Current Price label format supports `<percent>` and `<price>`. The default displays only `<percent>`. An empty format hides the label.

Current Price distance from candle controls the moving label. `0` places it immediately after the latest candle. Positive values add empty chart bars before it. `-1` places it at the right end of the level lines.

## Alerts

This indicator does not define alert conditions.

## Limitations

The reproduced percentage uses the mapped symbol's standard TradingView daily data. It is not a direct watchlist data read. Futures daily closes can follow settlement behaviour inherited from TradingView's ticker settings.

The 0% basis is a live snapshot. Once stored, it does not follow later mapped feed changes until the session mapping changes or the indicator reloads. The current price label can therefore diverge from the mapped symbol's later live Change %.

Because the basis is captured from the live last bar, reloading the indicator at another time can produce a different snapshot. Historical bars do not reproduce the exact time at which a previous live snapshot was taken. No future data is used.

Feed timing, spreads, currency, sessions, instrument specifications, and data permissions can make the CFD and mapped symbol diverge. Extended hours percentage columns are separate from the standard daily Change % used here.

If the active mapping is missing or daily data is unavailable, the indicator draws nothing. It continues requesting only until it can store the first valid basis for the active mapping.

## Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.
