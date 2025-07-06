import {
  AccumulationChartComponent,
  AccumulationDataLabel,
  AccumulationLegend,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationTooltip,
  Inject,
  PieSeries,
} from "@syncfusion/ej2-react-charts";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import * as React from "react";

const data = [
  { x: "Technology", y: 25 },
  { x: "Healthcare", y: 15 },
  { x: "Finance", y: 12 },
  { x: "Consumer Discretionary", y: 10 },
  { x: "Industrials", y: 9 },
  { x: "Energy", y: 8 },
  { x: "Utilities", y: 6 },
  { x: "Real Estate", y: 5 },
  { x: "Materials", y: 5 },
  { x: "Communication Services", y: 5 },
];

const styles = `
    #pie-chart * {
        font-family: "PP Mori", sans-serif;
        font-size: 12px;
    }
`;

function Table() {
  return (
    <>
      <style>{styles}</style>
      <AccumulationChartComponent
        id="pie-chart"
        legendSettings={{ visible: true }}
        tooltip={{ enable: true }}
      >
        <Inject
          services={[
            PieSeries,
            AccumulationLegend,
            AccumulationDataLabel,
            AccumulationTooltip,
          ]}
        />
        <AccumulationSeriesCollectionDirective>
          <AccumulationSeriesDirective
            dataSource={data}
            xName="x"
            yName="y"
            innerRadius="40%"
            dataLabel={{
              visible: true,
              position: "Inside",
              name: "text",
            }}
          />
        </AccumulationSeriesCollectionDirective>
      </AccumulationChartComponent>
    </>
  );
}

export default Table;
