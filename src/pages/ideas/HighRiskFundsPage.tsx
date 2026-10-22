import React from 'react';
import IdeaFundsPage from './IdeaFundsPage';

const funds = [
  { name: "BANDHAN SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "11.23%", y3: "30.73%", y5: "23.32%", aum: "20,129 Cr", exp: "1.62%" },
  { name: "INVESCO INDIA MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "15.79%", y3: "26.69%", y5: "21.49%", aum: "9,895 Cr", exp: "1.71%" },
  { name: "ICICI PRU MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "27.27%", y3: "26.68%", y5: "21.11%", aum: "6,568 Cr", exp: "1.85%" },
  { name: "WHITEOAK CAPITAL MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "18.45%", y3: "26.53%", y5: "NA", aum: "4,490 Cr", exp: "1.85%" },
  { name: "NIPPON INDIA GROWTH MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "15.21%", y3: "26.42%", y5: "22.86%", aum: "39,676 Cr", exp: "1.52%" },
  { name: "QUANT SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "19.45%", y3: "29.87%", y5: "28.43%", aum: "22,456 Cr", exp: "1.74%" },
  { name: "NIPPON INDIA SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "16.32%", y3: "28.54%", y5: "25.67%", aum: "61,234 Cr", exp: "1.48%" },
  { name: "MOTILAL OSWAL MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "22.34%", y3: "25.91%", y5: "24.12%", aum: "18,604 Cr", exp: "1.68%" },
  { name: "EDELWEISS MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "12.95%", y3: "25.72%", y5: "21.25%", aum: "13,553 Cr", exp: "1.67%" },
  { name: "HDFC MID-CAP OPPORTUNITIES FUND (G)", cat: "Equity • Mid Cap Fund", y1: "14.62%", y3: "25.44%", y5: "22.18%", aum: "78,012 Cr", exp: "1.41%" },
  { name: "KOTAK EMERGING EQUITY FUND (G)", cat: "Equity • Mid Cap Fund", y1: "13.87%", y3: "24.98%", y5: "20.76%", aum: "52,341 Cr", exp: "1.49%" },
  { name: "QUANT FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "18.92%", y3: "27.45%", y5: "25.67%", aum: "7,890 Cr", exp: "1.79%" },
  { name: "QUANT MULTI ASSET FUND (G)", cat: "Equity • Multi Cap Fund", y1: "16.78%", y3: "26.34%", y5: "24.56%", aum: "5,678 Cr", exp: "1.82%" },
  { name: "HSBC SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "6.26%", y3: "16.99%", y5: "20.42%", aum: "13,881 Cr", exp: "1.70%" },
  { name: "TATA MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "13.17%", y3: "21.94%", y5: "17.82%", aum: "4,992 Cr", exp: "1.83%" },
  { name: "AXIS MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "11.23%", y3: "23.56%", y5: "19.84%", aum: "26,789 Cr", exp: "1.62%" },
  { name: "BANK OF INDIA MID & SMALL CAP EQUITY & DEBT FUND (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "12.86%", y3: "20.04%", y5: "17.74%", aum: "1,281 Cr", exp: "2.03%" },
  { name: "QUANT ABSOLUTE FUND (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "14.23%", y3: "22.45%", y5: "20.12%", aum: "2,345 Cr", exp: "1.92%" },
  { name: "NIPPON INDIA MULTI CAP FUND (G)", cat: "Equity • Multi Cap Fund", y1: "12.34%", y3: "22.87%", y5: "20.12%", aum: "28,901 Cr", exp: "1.51%" },
  { name: "QUANT LARGE & MID CAP FUND (G)", cat: "Equity • Large & Mid Cap Fund", y1: "14.23%", y3: "24.56%", y5: "22.34%", aum: "8,765 Cr", exp: "1.78%" },
];

const HighRiskFundsPage = () => (
  <IdeaFundsPage title="High Risk High Return" titleHighlight="Funds" funds={funds} />
);

export default HighRiskFundsPage;
