"use client";

import styles from "./HiloGraph.module.css";

import * as React from "react";
import { useEffect } from "react";
import * as ReactDOM from "react-dom";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  HiloOpenCloseSeries,
  Category,
  Tooltip,
  DateTime,
  Zoom,
  Logarithmic,
  ChartTheme,
  Crosshair,
  ILoadedEventArgs,
} from "@syncfusion/ej2-react-charts";
import { chartValues } from "./financial-data.js";
import { Browser } from "@syncfusion/ej2-base";
import { loadChartTheme } from "./theme-color.js";
export let zoomFactor: number;
export let zoomPosition: number;
const SAMPLE_CSS = `
    .control-fluid {
		padding: 0px !important;
    }`;
const HiloOpenClose = () => {
  const loaded = (args: ILoadedEventArgs): void => {
    let chart: Element = document.getElementById("charts")!;
    chart.setAttribute("title", "");
  };
  const load = (args: ILoadedEventArgs): void => {
    args.chart.primaryXAxis.zoomFactor = zoomFactor;
    args.chart.primaryXAxis.zoomPosition = zoomPosition;
    loadChartTheme(args);
  };
  return (
    <div className={styles.graph}>
      <style>{SAMPLE_CSS}</style>
      <div className="control-section">
        <div className="row w-full h-full">
          <ChartComponent
            id="charts"
            load={load.bind(this)}
            loaded={loaded.bind(this)}
            style={{ textAlign: "center" }}
            primaryXAxis={{
              valueType: "DateTime",
              crosshairTooltip: { enable: true },
              majorGridLines: { width: 0 },
            }}
            primaryYAxis={{
              title: "Price",
              labelFormat: "n0",
              lineStyle: { width: 0 },
              minimum: 40,
              maximum: 140,
              interval: 20,
              majorTickLines: { width: 0 },
            }}
            chartArea={{ border: { width: 0 } }}
            tooltip={{
              enable: true,
              shared: true,
              header: "",
              format:
                "<b>Apple Inc. (AAPL)</b> <br> High : <b>${point.high}</b> <br> Low : <b>${point.low}</b> <br> Open : <b>${point.open}</b> <br> Close : <b>${point.close}</b>",
            }}
            width="100%"
            legendSettings={{ visible: false }}
            crosshair={{ enable: true, lineType: "Vertical" }}
            title="AAPL Historical"
          >
            <Inject
              services={[
                HiloOpenCloseSeries,
                Category,
                Tooltip,
                DateTime,
                Zoom,
                Logarithmic,
                Crosshair,
              ]}
            />
            <SeriesCollectionDirective>
              <SeriesDirective
                type="HiloOpenClose"
                dataSource={chartValues}
                animation={{ enable: true }}
                bearFillColor="#FF00FF"
                bullFillColor="#00FFFF"
                xName="period"
                low="low"
                high="high"
                open="open"
                close="close"
                name="Apple Inc"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    </div>
  );
};
export default HiloOpenClose;
