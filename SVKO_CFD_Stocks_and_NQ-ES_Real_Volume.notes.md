# SVKO CFD Stocks & NQ-ES Real Volume: internal notes

## Detailed user documentation

### Purpose and output

SVKO CFD Stocks & NQ-ES Real Volume replaces broker CFD volume with native stock volume or a configurable activity proxy for Nasdaq 100 and S&P 500 CFDs. It displays standard up and down volume columns in a dedicated pane and can calculate an optional Real VWAP on the CFD price using that external volume.

For a stock CFD, the selected source can be the corresponding exchange-listed share. For an index CFD, the source can combine Micro E-mini futures, E-mini futures, and a tracking ETF with positive user-defined weights.

The NQ and ES combinations are transparent activity proxies. They do not reconstruct an official exchange-defined or consolidated index-volume measurement.

### Symbol abbreviations and formula syntax

**Symbol abbreviations** defines reusable names in this form:

```text
MNQ = CME_MINI:MNQ1!
NQ = CME_MINI:NQ1!
QQQ = NASDAQ:QQQ
MES = CME_MINI:MES1!
ES = CME_MINI:ES1!
SPY = AMEX:SPY
```

An abbreviation can be used on either side of a **Volume formulas** entry. Each formula uses one chart symbol or abbreviation on the left and one or more sources on the right:

```text
TRADENATION:NVDA.EX = NASDAQ:NVDA
MNQ = MNQ + 10*NQ + 60*QQQ
MES = MES + 10*ES + 60*SPY
```

Terms are joined with `+`. Each term can be a complete TradingView ticker, an abbreviation, or `positive_weight*symbol`. A formula can contain up to ten terms. The matching formula is selected by the current standard chart ticker.

The default Nasdaq 100 proxy is:

```text
MNQ + 10*NQ + 60*QQQ
```

This example follows the author's practical normalisation based on typical relative leverage and exposure. QQQ normally has the least leverage of the three instruments, while MNQ and NQ provide greater leveraged exposure. MNQ is used as the reference unit. One NQ contract is exactly ten times the size of one MNQ contract, so NQ volume receives a coefficient of `10`. QQQ receives the larger coefficient of `60` as the author's approximate, adjustable way to bring its activity with less leverage onto a comparable scale.

The default S&P 500 proxy is:

```text
MES + 10*ES + 60*SPY
```

It applies the same logic to MES, ES, and SPY. These coefficients are not fixed market facts or a conversion defined by an exchange. They encode the author's example proxy and can be adjusted to match the user's own leverage and exposure assumptions.

The defaults include direct MNQ and MES chart mappings, Trade Nation and Trade Nation SB abbreviations, and IG Nasdaq 100 and S&P 500 mappings.

### Request and missing-data behaviour

Each unique active source is requested once per chart update. Repeated sources are combined before requests, so the effective weight is accumulated rather than creating duplicate remote requests.

After a source has produced valid data, a later missing bar can contribute zero while the remaining sources continue to contribute. This supports session differences between stock, ETF, and futures sources. Before a source has ever produced a valid bar, missing data can still leave the formula incomplete.

An explicit formula always takes priority over Mapper fallback. Invalid or ambiguous active formula syntax does not silently switch to the fallback.

### SVKO CFD Symbol Mapper fallback

When no formula matches, charts with a configured broker exchange prefix can use SVKO CFD Symbol Mapper as a one-symbol source with weight `1`. The default eligible prefixes are `IG`, `TRADENATION`, and `TRADENATIONSB`.

Add the Mapper to the same chart and connect:

- **1st code** to `Map: 1st code`;
- **2nd code** to `Map: 2nd code` from the same Mapper instance.

If either input remains connected to `close`, the Mapper has no result, or the chart prefix is not eligible, the indicator remains empty and makes no fallback volume request.

### Volume columns and Real VWAP

External volume uses native `plot.style_columns` in a separate pane. The default up-column colour is `#4D4D4D` and the default down-column colour is `#333333`; plot appearance is changed in TradingView's **Style** tab.

**Show VWAP** is enabled by default. Real VWAP uses the calculated "real" volume from the active formula, after all source coefficients have been applied, as the volume weight for the current CFD chart price. It is forced onto the main price pane. Its anchor can be:

- **Main Session**, which resets around the relevant regular session;
- **Full Session**, which follows the complete active source session.

Main Session is the default. The result is called Real VWAP because its weight comes from the selected external market volume rather than the broker CFD's local volume. It is still calculated on the CFD's own price, so it is not the native symbol's VWAP.

### Limitations

A stock source represents the reported volume of the selected TradingView symbol. A weighted NQ or ES formula is a user-defined activity proxy, not a consolidated index-volume value.

Feed availability, delays, subscription permissions, sessions, and bar alignment can differ between sources. Missing data can make a formula incomplete. Current volume and Real VWAP can change until an open realtime bar closes. No future data is used.

Use a standard time-based chart. Session-anchored VWAP contains less intraday detail on daily and higher timeframes. Unsupported charts, unresolved Mapper results, and configurations without a valid source draw nothing.

### Alerts

The indicator defines no alert conditions.

### Credits and licence

Original work by SVKO. Published open source under the Mozilla Public License 2.0.

## Chart preparation

Use a clean supported CFD chart with clearly visible volume columns and Real VWAP. Prefer a chart and timeframe where the selected source is active. If demonstrating Mapper fallback, add SVKO CFD Symbol Mapper and confirm that both code inputs use the same Mapper instance. Remove unrelated indicators, drawings, and images.

## Publishing procedure

1. Assume the saved cloud script has already been compiled, synced, and versioned through the Pine sync workflow.
2. Use the existing `SVKO Publish` chart and the existing script instance when present. Do not add a duplicate or open another layout merely for publication.
3. Publish directly with Privacy set to Public and Access set to Open-source using the exact TradingView-formatted description from `SVKO_CFD_Stocks_and_NQ-ES_Real_Volume.publish.txt` after explicit action-time confirmation.
4. Inspect the public page immediately while TradingView still permits limited corrections, including title, rendered description, chart image, categories, access, source visibility, and pane scaling.

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
- Documented the leverage and exposure logic behind the default index proxy coefficients and clarified that Real VWAP is weighted by the resulting calculated volume.
- Changed the default volume colours to lighter `#4D4D4D` up columns and darker `#333333` down columns.
- Simplified Inputs to symbol abbreviations, volume formulas, Show VWAP, and Anchor. Moved plot appearance controls to the Style tab and removed legacy and version controls.
- Added default Trade Nation abbreviations and used them as the left side targets in the corresponding volume formulas.
- Renamed the indicator to SVKO CFD Stocks & NQ-ES Real Volume and the VWAP plot to Real VWAP.
- Added explicit stock volume formulas and an optional SVKO CFD Symbol Mapper fallback for supported CFD prefixes.
- Changed Full Session anchoring to support stock sources and treat missing source bars as zero volume after valid data has been observed.

## Publication record

- Submitted: 21 July 2026
- Public page URL: https://www.tradingview.com/script/ulDZ4fEm-SVKO-CFD-Stocks-NQ-ES-Real-Volume/

## Pre-publish checklist

- [ ] Pine source compiled and validated through the repo-local TradingView Pine sync skill
- [ ] Cloud source re-fetched and verified
- [ ] Exact saved script is available in the existing `SVKO Publish` layout
- [ ] Explicit stock and index formulas verified
- [ ] Mapper fallback verified with both code inputs when it will be demonstrated
- [ ] Main Session and Full Session VWAP behaviour verified
- [ ] Chart contains only necessary scripts, drawings, and images
- [ ] Symbol, timeframe, volume columns, and Real VWAP are clear
- [ ] Publication title and description are final
- [ ] Proxy and realtime limitations are documented
- [ ] Attribution and licence are verified
