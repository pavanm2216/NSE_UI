import React from 'react';
import IdeaFundsPage from './IdeaFundsPage';

const funds = [
  { name: "MOTILAL OSWAL BSE ENHANCED VALUE INDEX...", cat: "Other • Index Fund", y1: "20.4%", y3: "32.19%", y5: "NA", aum: "1,570 Cr", exp: "1.06%" },
  { name: "AXIS NIFTY SMALLCAP 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "7.65%", y3: "24.74%", y5: "NA", aum: "512 Cr", exp: "1.02%" },
  { name: "AXIS NIFTY MIDCAP 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "14.16%", y3: "24.19%", y5: "NA", aum: "565 Cr", exp: "1.01%" },
  { name: "EDELWEISS NIFTY MIDCAP150 MOMENTUM 5...", cat: "Other • Index Fund", y1: "8.98%", y3: "23.25%", y5: "NA", aum: "1,333 Cr", exp: "1.11%" },
  { name: "NIPPON INDIA NIFTY MIDCAP 150 INDEX FUND (G)", cat: "Other • Index Fund", y1: "9.34%", y3: "22.87%", y5: "NA", aum: "2,456 Cr", exp: "0.35%" },
  { name: "MOTILAL OSWAL NIFTY MIDCAP 150 INDEX FUND (G)", cat: "Other • Index Fund", y1: "9.12%", y3: "22.56%", y5: "NA", aum: "3,234 Cr", exp: "0.30%" },
  { name: "UTI NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.28%", y3: "14.12%", y5: "13.34%", aum: "18,234 Cr", exp: "0.18%" },
  { name: "HDFC INDEX FUND NIFTY 50 (G)", cat: "Other • Index Fund", y1: "5.31%", y3: "14.18%", y5: "13.41%", aum: "12,567 Cr", exp: "0.20%" },
  { name: "NIPPON INDIA INDEX FUND NIFTY 50 (G)", cat: "Other • Index Fund", y1: "5.34%", y3: "14.23%", y5: "13.45%", aum: "8,901 Cr", exp: "0.20%" },
  { name: "ICICI PRU NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.29%", y3: "14.15%", y5: "13.38%", aum: "9,678 Cr", exp: "0.17%" },
  { name: "SBI NIFTY INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.22%", y3: "14.05%", y5: "13.28%", aum: "6,789 Cr", exp: "0.20%" },
  { name: "AXIS NIFTY 100 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.67%", y3: "14.89%", y5: "13.92%", aum: "3,456 Cr", exp: "0.20%" },
  { name: "MOTILAL OSWAL NIFTY 500 INDEX FUND (G)", cat: "Other • Index Fund", y1: "6.78%", y3: "16.34%", y5: "NA", aum: "4,567 Cr", exp: "0.25%" },
  { name: "NIPPON INDIA NIFTY SMALLCAP 250 INDEX FUND (G)", cat: "Other • Index Fund", y1: "8.45%", y3: "20.12%", y5: "NA", aum: "2,345 Cr", exp: "0.30%" },
  { name: "HDFC NIFTY NEXT 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "7.23%", y3: "17.45%", y5: "14.56%", aum: "3,678 Cr", exp: "0.20%" },
  { name: "UTI NIFTY NEXT 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "7.18%", y3: "17.34%", y5: "14.45%", aum: "5,234 Cr", exp: "0.18%" },
  { name: "ICICI PRU NIFTY NEXT 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "7.21%", y3: "17.41%", y5: "14.52%", aum: "4,123 Cr", exp: "0.19%" },
  { name: "KOTAK NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.26%", y3: "14.09%", y5: "13.31%", aum: "4,890 Cr", exp: "0.20%" },
  { name: "TATA NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.24%", y3: "14.07%", y5: "13.29%", aum: "2,345 Cr", exp: "0.20%" },
  { name: "MIRAE ASSET NIFTY 50 INDEX FUND (G)", cat: "Other • Index Fund", y1: "5.27%", y3: "14.11%", y5: "13.33%", aum: "3,456 Cr", exp: "0.20%" },
];

const IndexFundsPage = () => (
  <IdeaFundsPage title="Low Cost Index" titleHighlight="Funds" funds={funds} />
);

export default IndexFundsPage;
