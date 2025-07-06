import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import * as React from "react";

const data = [
  {
    Company: "Apple Inc.",
    Ticker: "AAPL",
    Shares: 50,
    PricePerShare: 195.12,
    Change: "+$1.45 (0.75%)",
  },
  {
    Company: "Microsoft Corp.",
    Ticker: "MSFT",
    Shares: 30,
    PricePerShare: 335.6,
    Change: "+$2.10 (0.63%)",
  },
  {
    Company: "Pfizer Inc.",
    Ticker: "PFE",
    Shares: 120,
    PricePerShare: 34.18,
    Change: "-$0.25 (-0.73%)",
  },
  {
    Company: "JPMorgan Chase",
    Ticker: "JPM",
    Shares: 40,
    PricePerShare: 155.8,
    Change: "+$0.90 (0.58%)",
  },
  {
    Company: "Tesla Inc.",
    Ticker: "TSLA",
    Shares: 15,
    PricePerShare: 246.88,
    Change: "+$3.40 (1.40%)",
  },
  {
    Company: "Caterpillar Inc.",
    Ticker: "CAT",
    Shares: 10,
    PricePerShare: 278.42,
    Change: "-$1.15 (-0.41%)",
  },
  {
    Company: "Exxon Mobil",
    Ticker: "XOM",
    Shares: 25,
    PricePerShare: 108.24,
    Change: "-$0.68 (-0.63%)",
  },
  {
    Company: "Duke Energy",
    Ticker: "DUK",
    Shares: 18,
    PricePerShare: 91.56,
    Change: "+$0.22 (0.24%)",
  },
  {
    Company: "Prologis Inc.",
    Ticker: "PLD",
    Shares: 12,
    PricePerShare: 121.35,
    Change: "-$0.44 (-0.36%)",
  },
  {
    Company: "Meta Platforms",
    Ticker: "META",
    Shares: 8,
    PricePerShare: 486.71,
    Change: "+$5.76 (1.20%)",
  },
];

const styles = `
.e-hide {
    display: none;
}

.e-headercelldiv {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.e-clipboard {
    display:none;
}


`;

function Table() {
 
  return (
    <>
      <style>{styles}</style>
      <GridComponent dataSource={data} gridLines="Default">
        <ColumnsDirective>
          <ColumnDirective field="Company" width="200" textAlign="Left" />
          <ColumnDirective field="Ticker" width="200" textAlign="Left" />
          <ColumnDirective field="Shares" width="200" textAlign="Left" />
          <ColumnDirective
            field="PricePerShare"
            width="200"
            format="C2"
            textAlign="Left"
          />
          <ColumnDirective field="Change" width="200" textAlign="Left" />
        </ColumnsDirective>
      </GridComponent>
    </>
  );
}

export default Table;
