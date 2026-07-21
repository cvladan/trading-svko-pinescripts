# SVKO CFD Stocks & NQ-ES Real Volume

## Why I built it

I trade CFD charts, but their displayed volume does not always represent activity in the underlying exchange traded market. I built this indicator so I can view native stock volume on stock CFDs and a consistent activity proxy on Nasdaq 100 and S&P 500 CFDs.

For a stock CFD, I can use the corresponding exchange listed share volume. For an index CFD, I use a configurable weighted combination of Micro E-mini futures, E-mini futures, and the major tracking ETF. I also use the selected volume to calculate an optional Real VWAP on the current CFD price.

This does not claim to reconstruct an official consolidated index volume. The NQ and ES result is a user defined proxy designed to give the CFD chart a more useful and transparent activity measure.

## How it works

The indicator selects one Volume formulas entry whose left side matches the current standard chart ticker. The right side lists up to ten volume sources. A term can be a complete TradingView ticker, a configured abbreviation, or a positive weighted term such as `10*NQ`.

The default Nasdaq composite is:

```text
MNQ + 10*NQ + 60*QQQ
```

The default S&P 500 composite is:

```text
MES + 10*ES + 60*SPY
```

Each unique active symbol is requested once per chart update. Repeated sources are combined before requests are made. All sources use their available extended sessions. A missing source contributes zero after that source has produced valid data, while the remaining sources continue to contribute.

Volume is shown as separate standard columns for up and down CFD candles in a dedicated pane. Their colours and visibility are controlled from TradingView's Style tab.

The optional Real VWAP applies the selected external volume to the current CFD's `hlc3` price. Main Session follows the regular session of the first non-futures source. Full Session follows the trading day of the first CME or CME_MINI source, or the first source when no futures source exists.

## Mapping and SVKO CFD Symbol Mapper

An explicit Volume formulas match always has priority. This lets you define precise stock mappings and custom weighted index formulas directly in the indicator.

When no formula matches, the indicator can use SVKO CFD Symbol Mapper as a fallback for the exchange prefixes listed in Broker exchange prefixes. The Mapper contains the large shared broker to native symbol table. It sends the resolved ticker through two hidden numeric plots because Pine Script cannot pass a ticker string directly between indicators.

Connect both inputs to the same Mapper instance. Select `Map: 1st code` for `1st code` and `Map: 2nd code` for `2nd code`. A valid decoded native symbol becomes one volume source with a weight of one.

This separation keeps the large general mapping table in one helper indicator, while Volume formulas remain available for cases that need several symbols, custom weights, or a deliberately chosen source.

## How to use

1. Add the indicator to a supported standard time based chart.
2. Check whether Volume formulas already contains the chart symbol or one of its abbreviations.
3. Add or edit a formula when you want a specific source or weighted composite.
4. If you want general automatic stock CFD fallback, add SVKO CFD Symbol Mapper and connect both code inputs.
5. Use the Style tab to customise Up Volume, Down Volume, and Real VWAP.
6. Choose Main Session or Full Session for the Real VWAP anchor.

Keep the indicator in its dedicated pane for conventional volume scaling. TradingView's Move to command can place it in the main pane, but TradingView then controls its scaling and placement.

An unsupported chart with no formula and no valid Mapper result remains empty. A compact warning appears when the active formula is invalid, the chart is not standard and time based, or a Main Session anchor cannot be inferred.

## Inputs

### Symbol abbreviations

Enter one `ABBREVIATION = TRADINGVIEW_SYMBOL` pair per line. Abbreviations can be used on either side of a volume formula. Complete TradingView ticker IDs remain valid without an abbreviation.

### Volume formulas

Enter one `CHART_SYMBOL_OR_ABBREVIATION = term + term` formula per line. A term is a full symbol, an abbreviation, or `positive_weight*symbol`. Each formula supports up to ten terms.

For example, `TRADENATION:NVDA.EX = NASDAQ:NVDA` uses exchange listed Nvidia volume. `IG:NVDA = IG:NVDA` deliberately keeps the IG symbol's own volume and session data.

### VWAP

Show VWAP enables the external volume weighted VWAP and is on by default. Anchor selects Main Session or Full Session, with Main Session as the default.

### SVKO CFD Symbol Mapper fallback

`1st code` and `2nd code` receive the two hidden plots from the same Mapper instance. They are used only when no explicit volume formula matches.

Broker exchange prefixes lists the chart prefixes allowed to use the fallback. The default is `IG, TRADENATION, TRADENATIONSB`. Direct formulas are not affected by this list.

### Style

Up Volume defaults to opaque `#4D4D4D`, Down Volume to opaque `#333333`, and Real VWAP to an orange one pixel dotted line.

## Alerts

This indicator does not define alert conditions.

## Limitations

A single stock source represents the reported volume of the selected TradingView symbol. A multi-source NQ or ES formula is a user defined weighted proxy, not an exchange defined consolidated volume measurement.

Source availability, feed delay, subscription permissions, sessions, and bar alignment can differ. Missing or unavailable sources can make the result incomplete.

Volume sources and the current CFD candle can update during an open realtime bar. The current volume column and Real VWAP can therefore change until the bar closes. No future data is used.

Main Session VWAP requires at least one non-futures source. Full Session uses a CME or CME_MINI trading day when present and otherwise uses the first resolved source. Missing source bars contribute zero after valid data has been observed, so Full Session Real VWAP remains at its last value through gaps and resets on the next source trading day.

Daily and higher timeframes are supported, but a session anchored VWAP naturally contains less intraday detail on those bars.

Unsupported charts and unresolved Mapper results draw nothing and make no fallback volume request. Invalid or duplicate abbreviations suppress requests and display a warning.

## Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.
