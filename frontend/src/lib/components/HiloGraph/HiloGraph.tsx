"use client";

import styles from "./HiloGraph.module.css";

import {
  CandleSeries,
  Category,
  ChartComponent,
  Crosshair,
  DateTime,
  ILoadedEventArgs,
  Inject,
  Logarithmic,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
  Zoom,
  titleSettingsModel,
} from "@syncfusion/ej2-react-charts";

import { loadChartTheme } from "./theme-color.js";
export let zoomFactor: number;
export let zoomPosition: number;
const SAMPLE_CSS = `
    .control-fluid {
		padding: 0px !important;
    }
    .control-section {
        height: 100%;
    }

        `;
const HiloOpenClose = ({
  data,
  title,
  titleStyle = {
    fontWeight: "700",
    size: "36px",
  },
}: {
  data: StockData[];
  title: string;
  titleStyle?: titleSettingsModel;
}) => {
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
            style={{ textAlign: "center", width: "100%", height: "100%" }}
            primaryXAxis={{
              valueType: "DateTime",
              crosshairTooltip: { enable: true },
              majorGridLines: { width: 0 },
            }}
            primaryYAxis={{
              title: "Price",
              labelFormat: "n0",
              lineStyle: { width: 0 },
              interval: 50,
              majorTickLines: { width: 0 },
            }}
            chartArea={{ border: { width: 0 } }}
            tooltip={{
              enable: true,
              shared: true,
              header: "",
              format:
                "<b>Lululemon Atheletica Inc. (LULU)</b> <br> High : <b>${point.high}</b> <br> Low : <b>${point.low}</b> <br> Open : <b>${point.open}</b> <br> Close : <b>${point.close}</b>",
            }}
            width="100%"
            height="100%"
            legendSettings={{ visible: false }}
            crosshair={{ enable: true, lineType: "Vertical" }}
            title={title}
            titleStyle={titleStyle}
          >
            <Inject
              services={[
                CandleSeries,
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
                type="Candle"
                dataSource={data}
                animation={{ enable: true }}
                bearFillColor="#00F000"
                bullFillColor="#FF0000"
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
