import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, PieChart, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const EMICalculatorPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = tenure * 12;
    
    const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const totalAmountValue = emiValue * time;
    const totalInterestValue = totalAmountValue - principal;
    
    setEmi(Math.round(emiValue));
    setTotalAmount(Math.round(totalAmountValue));
    setTotalInterest(Math.round(totalInterestValue));
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">EMI Calculator</h1>
          <p className="text-muted-foreground">Calculate your loan EMI and plan your finances</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Download className="mr-2 w-4 h-4" />
          Download Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Loan Amount: {formatCurrency(loanAmount)}</Label>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                max={10000000}
                min={100000}
                step={100000}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹1L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div>
              <Label>Interest Rate: {interestRate}% per annum</Label>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={20}
                min={5}
                step={0.1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <Label>Loan Tenure: {tenure} years</Label>
              <Slider
                value={[tenure]}
                onValueChange={(value) => setTenure(value[0])}
                max={30}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <Label>Loan Amount</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Tenure (Years)</Label>
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              EMI Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly EMI</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(emi)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-sm text-muted-foreground">Principal Amount</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(loanAmount)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-xl font-bold text-warning">{formatCurrency(totalInterest)}</p>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">Total Amount Payable</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Principal</span>
                  <span>{((loanAmount / totalAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interest</span>
                  <span>{((totalInterest / totalAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tenure</th>
                  <th className="text-left p-2">Monthly EMI</th>
                  <th className="text-left p-2">Total Interest</th>
                  <th className="text-left p-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {[10, 15, 20, 25, 30].map((years) => {
                  const rate = interestRate / 12 / 100;
                  const time = years * 12;
                  const emiValue = (loanAmount * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
                  const totalAmountValue = emiValue * time;
                  const totalInterestValue = totalAmountValue - loanAmount;
                  
                  return (
                    <tr key={years} className="border-b">
                      <td className="p-2">{years} years</td>
                      <td className="p-2 font-semibold">{formatCurrency(emiValue)}</td>
                      <td className="p-2">{formatCurrency(totalInterestValue)}</td>
                      <td className="p-2">{formatCurrency(totalAmountValue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMICalculatorPage;