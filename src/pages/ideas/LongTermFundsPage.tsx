import React from 'react';
import IdeaFundsPage from './IdeaFundsPage';

const funds = [
  { name: "NIPPON INDIA LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "6.22%", y3: "17.76%", y5: "17.64%", aum: "46,520 Cr", exp: "1.47%" },
  { name: "INVESCO INDIA LARGECAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "6.13%", y3: "17.23%", y5: "14.47%", aum: "1,536 Cr", exp: "2.02%" },
  { name: "ICICI PRU LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "4.45%", y3: "16.76%", y5: "15.41%", aum: "69,947 Cr", exp: "1.40%" },
  { name: "WHITEOAK CAPITAL LARGE CAP FUND – REGULAR (G)", cat: "Equity • Large Cap Fund", y1: "4.63%", y3: "16.47%", y5: "NA", aum: "1,045 Cr", exp: "2.16%" },
  { name: "MIRAE ASSET LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "3.75%", y3: "12.35%", y5: "11.25%", aum: "35,342 Cr", exp: "1.52%" },
  { name: "HDFC TOP 100 FUND (G)", cat: "Equity • Large Cap Fund", y1: "5.12%", y3: "15.87%", y5: "14.23%", aum: "34,567 Cr", exp: "1.45%" },
  { name: "AXIS BLUECHIP FUND (G)", cat: "Equity • Large Cap Fund", y1: "4.87%", y3: "14.56%", y5: "13.78%", aum: "28,901 Cr", exp: "1.53%" },
  { name: "KOTAK BLUECHIP FUND (G)", cat: "Equity • Large Cap Fund", y1: "5.34%", y3: "15.23%", y5: "14.56%", aum: "12,345 Cr", exp: "1.58%" },
  { name: "SBI BLUECHIP FUND (G)", cat: "Equity • Large Cap Fund", y1: "4.23%", y3: "13.87%", y5: "12.34%", aum: "45,678 Cr", exp: "1.49%" },
  { name: "CANARA ROB BLUECHIP EQUITY FUND (G)", cat: "Equity • Large Cap Fund", y1: "3.98%", y3: "13.45%", y5: "12.67%", aum: "15,234 Cr", exp: "1.55%" },
  { name: "PARAG PARIKH FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "8.92%", y3: "19.87%", y5: "21.34%", aum: "68,921 Cr", exp: "1.29%" },
  { name: "HDFC FLEXI CAP FUND - (G)", cat: "Equity • Flexi Cap Fund", y1: "5.66%", y3: "20.71%", y5: "20.42%", aum: "91,334 Cr", exp: "1.34%" },
  { name: "EDELWEISS BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "7.01%", y3: "12.43%", y5: "10.52%", aum: "12,234 Cr", exp: "1.68%" },
  { name: "HDFC BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "9.87%", y3: "18.34%", y5: "16.78%", aum: "89,234 Cr", exp: "1.38%" },
  { name: "ICICI PRU BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "8.45%", y3: "16.78%", y5: "14.56%", aum: "56,789 Cr", exp: "1.42%" },
  { name: "NIPPON INDIA INDEX FUND NIFTY 50 (G)", cat: "Other • Index Fund", y1: "5.34%", y3: "14.23%", y5: "13.45%", aum: "8,901 Cr", exp: "0.20%" },
  { name: "UTI NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.28%", y3: "14.12%", y5: "13.34%", aum: "18,234 Cr", exp: "0.18%" },
  { name: "HDFC INDEX FUND NIFTY 50 (G)", cat: "Other • Index Fund", y1: "5.31%", y3: "14.18%", y5: "13.41%", aum: "12,567 Cr", exp: "0.20%" },
  { name: "TATA BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "4.66%", y3: "10.24%", y5: "9.56%", aum: "8,725 Cr", exp: "1.73%" },
  { name: "DSP DYNAMIC ASSET ALLOCATION FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "5.74%", y3: "12.36%", y5: "8.88%", aum: "3,548 Cr", exp: "1.88%" },
];

const LongTermFundsPage = () => (
  <IdeaFundsPage title="Long Term" titleHighlight="Funds" funds={funds} />
);

export default LongTermFundsPage;
