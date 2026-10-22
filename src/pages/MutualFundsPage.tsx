import React, { useState } from 'react';
import { Info, ChevronRight, Calculator, Landmark, Building2, Cpu, Stethoscope, Share2, ShieldCheck, TrendingUp, PiggyBank, Search } from 'lucide-react';
import TopHeader from '@/components/landing/TopHeader';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const MutualFundsPage = () => {
  const [featuredTab, setFeaturedTab] = useState<'equity' | 'hybrid'>('equity');
  const [topTab, setTopTab] = useState<'equity' | 'hybrid' | 'tax'>('equity');
  const [exploreTab, setExploreTab] = useState<'equity' | 'debt' | 'hybrid' | 'other'>('equity');
  const [sectorTab, setSectorTab] = useState<'sectoral' | 'thematic'>('sectoral');
  // Calculator State
  const [calcTab, setCalcTab] = useState<'investment' | 'target'>('investment');
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  const [targetAmount, setTargetAmount] = useState(15000000);
  const [years, setYears] = useState(30);
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('lumpsum');
  const [fundType, setFundType] = useState<'equity' | 'debt' | 'hybrid'>('equity');
  const [returns, setReturns] = useState(12);

  const fundReturnsConfig = {
    equity: { default: 12, steps: [8, 10, 12, 14, 16, 18, 20, 22, 24], min: 8, max: 24 },
    debt:   { default: 7,  steps: [3, 4, 5, 6, 7, 8, 9, 10, 11],       min: 3, max: 11 },
    hybrid: { default: 10, steps: [6, 7, 8, 9, 10, 11, 12, 13, 14],    min: 6, max: 14 },
  };

  const handleFundTypeChange = (type: 'equity' | 'debt' | 'hybrid') => {
    setFundType(type);
    setReturns(fundReturnsConfig[type].default);
  };

  // Growth Calculation
  const baseAmount = calcTab === 'investment' ? investmentAmount : targetAmount;
  const finalValue = Math.round(baseAmount * Math.pow(1 + returns / 100, years));
  const fdReturns = Math.round(baseAmount * Math.pow(1 + 7 / 100, years));

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a202c]">
      <TopHeader />
      <Header />

      {/* 1. TOP NAVIGATION BAR */}
      <nav className="border-b sticky top-[calc(2.5rem+4rem)] bg-white z-40 overflow-x-auto whitespace-nowrap px-6 py-4 flex gap-8 text-sm font-medium text-gray-700">
        <a href="#featured" className="hover:text-blue-900">Featured Mutual Funds</a>
        <a href="#top-performing" className="hover:text-blue-900">Top performing funds</a>
        <a href="#explore" className="hover:text-blue-900">Explore All Funds</a>
        <a href="#ideas" className="hover:text-blue-900">Idea's for investment</a>
        <a href="#calculator" className="hover:text-blue-900">Mutual Fund growth calculator</a>
        <a href="#sector" className="hover:text-blue-900">Sector Based funds</a>
        <a href="#index" className="hover:text-blue-900">Index Based Funds</a>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-16">
        
        {/* 2. WHY INVEST BANNER */}
        <section className="bg-white rounded-xl p-8 flex flex-wrap items-center justify-between border shadow-sm">
          <h2 className="text-2xl font-bold">Why Invest In <span className="text-blue-900">Mutual Funds?</span></h2>
          <div className="flex gap-12 items-center">
            <FeatureItem icon={<PiggyBank className="w-6 h-6 text-red-500"/>} label="Start investing as low as ₹500" />
            <FeatureItem icon={<TrendingUp className="w-6 h-6 text-red-500"/>} label="Higher Returns" />
            <FeatureItem icon={<ShieldCheck className="w-6 h-6 text-red-500"/>} label="Managed by professionals" />
            <button className="flex items-center gap-2 font-bold text-blue-900">
              Know more <ChevronRight className="w-5 h-5 bg-blue-900 text-white rounded-full p-1"/>
            </button>
          </div>
        </section>

        {/* 3. FEATURED MUTUAL FUNDS */}
        <section id="featured" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-6">Featured Mutual <span className="text-slate-500 font-normal">Funds</span></h2>
          <div className="flex gap-8 border-b mb-6 text-lg font-semibold">
            <button onClick={() => setFeaturedTab('equity')} className={featuredTab === 'equity' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Equity Funds</button>
            <button onClick={() => setFeaturedTab('hybrid')} className={featuredTab === 'hybrid' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Hybrid Funds</button>
          </div>
          <FundTable data={featuredTab === 'equity' ? featuredEquityData : featuredHybridData} />
          <a href="/mutual-funds/featured" className="w-full mt-8 text-blue-900 font-bold underline text-center block">Show All Featured Mutual Funds</a>
        </section>

        {/* 4. TOP PERFORMING FUNDS */}
        <section id="top-performing" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-3xl font-bold text-blue-900">Top Performing <span className="text-slate-500 font-normal">Funds</span></h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-8 border-b mb-6 text-lg font-semibold">
            <button onClick={() => setTopTab('equity')} className={topTab === 'equity' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Equity Funds</button>
            <button onClick={() => setTopTab('hybrid')} className={topTab === 'hybrid' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Hybrid Funds</button>
            <button onClick={() => setTopTab('tax')} className={topTab === 'tax' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Tax Saving Funds</button>
          </div>
          <FundTable data={topTab === 'equity' ? topEquityData : topTab === 'hybrid' ? topHybridData : topTaxData} />
          <a href="/mutual-funds/top-performing" className="w-full mt-8 text-blue-900 font-bold underline text-center block">Show All Top Performing Funds</a>
        </section>

        {/* 5. EXPLORE ALL FUNDS GRID */}
        <section id="explore" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Explore All <span className="text-slate-500 font-normal">Funds</span></h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-8 border-b mb-8 font-semibold">
            <button onClick={() => setExploreTab('equity')} className={exploreTab === 'equity' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Equity Funds</button>
            <button onClick={() => setExploreTab('debt')} className={exploreTab === 'debt' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Debt Funds</button>
            <button onClick={() => setExploreTab('hybrid')} className={exploreTab === 'hybrid' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Hybrid Funds</button>
            <button onClick={() => setExploreTab('other')} className={exploreTab === 'other' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Other Funds</button>
          </div>
          {exploreTab === 'equity' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ExploreCol title="By Solution" items={["ELSS"]} />
              <ExploreCol title="By Market Capitalisation" items={["Large & Mid Cap Fund", "Mid Cap Fund", "Small Cap Fund", "Large Cap Fund"]} />
              <ExploreCol title="By Diversification" items={["Focused Fund", "Contra Fund", "Flexi Cap Fund", "Multi Cap Fund", "Value Fund"]} />
              <ExploreCol title="By Sectoral / Thematic" items={["Sectoral / Thematic", "Dividend Yield Fund"]} />
            </div>
          )}
          {exploreTab === 'debt' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ExploreCol title="By Others" items={["Gilt Fund", "Credit Risk Fund", "Fixed Maturity Plans", "Gilt Fund with 10 year Constant duration", "Floater Fund"]} />
              <ExploreCol title="By Park your Savings" items={["Overnight Fund", "Money Market Fund", "Low Duration Fund", "Ultra Short Duration Fund", "Liquid Fund"]} />
              <ExploreCol title="By Better Than FDs" items={["Corporate Bond Fund", "Short Duration Fund", "Banking and PSU Fund"]} />
              <ExploreCol title="By Invest for Medium to Long Term" items={["Dynamic Bond", "Long Duration Fund", "Medium Duration Fund", "Medium to Long Duration Fund"]} />
            </div>
          )}
          {exploreTab === 'hybrid' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ExploreCol title="By Others" items={["Arbitrage Fund"]} />
              <ExploreCol title="By Equity Debt Allocation" items={["Aggressive Hybrid Fund", "Conservative Hybrid Fund", "Balanced Hybrid Fund", "Equity Savings"]} />
              <ExploreCol title="By Solution" items={["Multi Asset Allocation", "Dynamic Asset Allocation or Balanced Advantage"]} />
            </div>
          )}
          {exploreTab === 'other' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ExploreCol title="By Solution" items={["Childrens Fund", "Retirement Fund", "FoFs Overseas", "FoFs Domestic"]} />
              <ExploreCol title="By Index" items={["Index Fund"]} />
            </div>
          )}
        </section>

        {/* 6. IDEAS FOR INVESTMENT */}
        <section id="ideas" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-blue-900">Ideas For <span className="text-slate-500 font-normal">Investment</span></h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-8 max-w-4xl">Carefully curated categories of Mutual funds to suit needs of all our customers. Every category has been thought from perspective of lakhs of Edelweiss customers personalities, risk taking ability and confidence in markets.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x border rounded-lg">
            <IdeaCard icon={<Landmark className="w-8 h-8 text-red-500"/>} title="Safe Bets for Long Term" desc="Invest and forget! These funds are for long term" link="/mutual-funds/ideas/long-term" />
            <IdeaCard icon={<TrendingUp className="w-8 h-8 text-red-500"/>} title="High Risk, High Return Funds" desc="Funds with best RoI and high volatility" link="/mutual-funds/ideas/high-risk" />
            <IdeaCard icon={<Search className="w-8 h-8 text-red-500"/>} title="Low Cost Index Funds" desc="Invest less earn more." link="/mutual-funds/ideas/index-funds" />
          </div>
        </section>

        {/* 7. GROWTH CALCULATOR */}
        <section id="calculator" style={{ scrollMarginTop: '160px' }} className="grid lg:grid-cols-2 gap-12 border rounded-xl p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              Mutual Fund <span className="text-slate-500 font-normal">Growth Calculator</span> <Info className="w-4 h-4 text-slate-400"/>
            </h2>
            <p className="text-gray-500 mb-8">Use our calculators to simulate how your money will grow</p>
            <div className="space-y-8">
              <div className="flex gap-8 border-b pb-2">
                <button onClick={() => setCalcTab('investment')} className={calcTab === 'investment' ? 'text-blue-900 border-b-2 border-blue-900 font-bold pb-2' : 'text-gray-400 font-bold pb-2'}>By Investment amount</button>
                <button onClick={() => setCalcTab('target')} className={calcTab === 'target' ? 'text-blue-900 border-b-2 border-blue-900 font-bold pb-2' : 'text-gray-400 font-bold pb-2'}>By Target amount</button>
              </div>

              {calcTab === 'target' ? (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-semibold uppercase">Target Amount</label>
                    <div className="text-5xl font-bold">₹ {targetAmount.toLocaleString('en-IN')}.00</div>
                  </div>
                  <Slider label="For a time period of" val={years} setVal={setYears} unit="Yrs" max={40} steps={[3, 5, 10, 15, 20, 30, 40]} />
                  <div>
                    <label className="block text-gray-400 text-sm mb-4 font-semibold uppercase">Investment Type</label>
                    <div className="flex gap-10">
                      <label className="flex items-center gap-3 font-bold cursor-pointer">
                        <input type="radio" name="inv-type-target" checked={investmentType === 'lumpsum'} onChange={() => setInvestmentType('lumpsum')} className="w-5 h-5 accent-blue-900" /> One Time (Lumpsum)
                      </label>
                      <label className="flex items-center gap-3 font-bold cursor-pointer text-gray-400">
                        <input type="radio" name="inv-type-target" checked={investmentType === 'sip'} onChange={() => setInvestmentType('sip')} className="w-5 h-5 accent-blue-900" /> Every Month (SIP)
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-4 font-semibold uppercase">Fund Type</label>
                    <div className="flex gap-4">
                      {(['equity', 'debt', 'hybrid'] as const).map(ft => (
                        <button key={ft} onClick={() => handleFundTypeChange(ft)}
                          className={`flex items-center gap-2 px-6 py-2 border rounded font-bold capitalize ${
                            fundType === ft ? 'border-2 border-blue-900 bg-white' : 'border text-gray-400'
                          }`}>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            fundType === ft ? 'border-blue-900' : 'border-gray-300'
                          }`}>
                            {fundType === ft && <span className="w-3 h-3 rounded-full bg-blue-900 block" />}
                          </span>
                          {ft.charAt(0).toUpperCase() + ft.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(fundType === 'debt' || fundType === 'hybrid') && (
                    <SliderReturns
                      label="Assumed Returns"
                      val={returns}
                      setVal={setReturns}
                      unit="%"
                      config={fundReturnsConfig[fundType]}
                    />
                  )}
                  <button className="w-1/2 bg-blue-900 text-white py-4 rounded-lg font-bold text-lg">Calculate</button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-4 font-semibold uppercase">Investment Type</label>
                    <div className="flex gap-10">
                      <label className="flex items-center gap-3 font-bold cursor-pointer">
                        <input type="radio" name="inv-type-inv" checked={investmentType === 'lumpsum'} onChange={() => setInvestmentType('lumpsum')} className="w-5 h-5 accent-blue-900" /> One Time (Lumpsum)
                      </label>
                      <label className="flex items-center gap-3 font-bold cursor-pointer text-gray-400">
                        <input type="radio" name="inv-type-inv" checked={investmentType === 'sip'} onChange={() => setInvestmentType('sip')} className="w-5 h-5 accent-blue-900" /> Every Month (SIP)
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-semibold uppercase">Investment Amount</label>
                    <div className="text-5xl font-bold text-blue-900">₹ {investmentAmount.toLocaleString('en-IN')}.00</div>
                  </div>
                  <Slider label="For a time period of" val={years} setVal={setYears} unit="Yrs" max={40} steps={[3, 5, 10, 15, 20, 30, 40]} />
                  <div>
                    <label className="block text-gray-400 text-sm mb-4 font-semibold uppercase">Fund Type</label>
                    <div className="flex gap-4">
                      {(['equity', 'debt', 'hybrid'] as const).map(ft => (
                        <button key={ft} onClick={() => handleFundTypeChange(ft)}
                          className={`flex items-center gap-2 px-6 py-2 border rounded font-bold capitalize ${
                            fundType === ft ? 'border-2 border-blue-900 bg-white' : 'border text-gray-400'
                          }`}>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            fundType === ft ? 'border-blue-900' : 'border-gray-300'
                          }`}>
                            {fundType === ft && <span className="w-3 h-3 rounded-full bg-blue-900 block" />}
                          </span>
                          {ft.charAt(0).toUpperCase() + ft.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderReturns
                    label="Assumed Returns"
                    val={returns}
                    setVal={setReturns}
                    unit="%"
                    config={fundReturnsConfig[fundType]}
                  />
                  <button className="w-1/2 bg-blue-900 text-white py-4 rounded-lg font-bold text-lg">Calculate</button>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-10 flex flex-col justify-center border">
            <p className="text-center text-gray-500 font-medium">You will receive</p>
            <h3 className="text-5xl font-bold text-center mb-12 text-gray-700">₹ {finalValue.toLocaleString('en-IN')}.00</h3>

            <p className="text-center text-sm text-gray-400 mb-8 font-bold">After {years} years with {fundType.charAt(0).toUpperCase() + fundType.slice(1)} MF*</p>
            <h4 className="font-bold text-gray-500 text-center mb-6">Mutual Funds Returns vs FD Returns</h4>
            <div className="space-y-8">
              <ProgressBar label="With Mutual Fund*" value={finalValue} total={finalValue} color="bg-[#2A938F]" amount={finalValue} />
              <ProgressBar label="With Fixed Deposit*" value={fdReturns} total={finalValue} color="bg-[#1E3A6D]" amount={fdReturns} />
            </div>
            <div className="flex justify-between mt-12 text-xs font-bold text-gray-400 border-t pt-8">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-400 rounded-sm"></span> Invested Amount</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#2A938F] rounded-sm"></span> MF Gains</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#1E3A6D] rounded-sm"></span> FD Gains</div>
            </div>
            <p className="text-[10px] text-gray-400 mt-10 text-center">* Assumed MF Returns {returns}.00%, FD Returns 7.00% (Before Tax)</p>
          </div>
        </section>

        {/* 8. SECTOR BASED FUNDS */}
        <section id="sector" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-blue-900">Sector Based <span className="text-slate-500 font-normal">Funds</span></h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-8 border-b mb-6 font-semibold">
            <button onClick={() => setSectorTab('sectoral')} className={sectorTab === 'sectoral' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Sectoral</button>
            <button onClick={() => setSectorTab('thematic')} className={sectorTab === 'thematic' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Thematic</button>
          </div>
          <p className="text-gray-500 mb-8">Sector based Funds are equity mutual funds investing in a specific sector such as real estate, energy, healthcare, infrastructure, etc.</p>
          {sectorTab === 'sectoral' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x border rounded-lg overflow-hidden">
              <SectorCard icon={<Building2 className="text-blue-900"/>} label="Banking" link="/mutual-funds/sector/banking" />
              <SectorCard icon={<Landmark className="text-red-500"/>} label="Infrastructure" link="/mutual-funds/sector/infrastructure" />
              <SectorCard icon={<Cpu className="text-blue-900"/>} label="Technology" link="/mutual-funds/sector/technology" />
              <SectorCard icon={<Stethoscope className="text-red-400"/>} label="Healthcare" link="/mutual-funds/sector/healthcare" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x border rounded-lg overflow-hidden">
              <SectorCard icon={<TrendingUp className="text-blue-900"/>} label="Multi National Company" link="/mutual-funds/sector/mnc" />
              <SectorCard icon={<ShieldCheck className="text-[#2A938F]"/>} label="ESG" link="/mutual-funds/sector/esg" />
              <SectorCard icon={<Landmark className="text-red-500"/>} label="PSU" link="/mutual-funds/sector/psu" />
              <SectorCard icon={<PiggyBank className="text-orange-500"/>} label="Consumption" link="/mutual-funds/sector/consumption" />
            </div>
          )}
        </section>

        {/* 9. INDEX BASED FUNDS */}
        <section id="index" style={{ scrollMarginTop: '160px' }} className="border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-blue-900">Index Based <span className="text-slate-500 font-normal">Funds</span></h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-8 max-w-4xl">Index funds are Mutual Funds that follow a benchmark index, such as the Nifty 50 or BSE Sensex. Index fund tries to replicate the returns provided by the benchmark index via passive investment.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 border rounded-lg overflow-hidden divide-x divide-y">
            {[
              { label: "Nifty 50", slug: "nifty-50" },
              { label: "Bank Nifty", slug: "bank-nifty" },
              { label: "BSE Sensex", slug: "bse-sensex" },
              { label: "Midcap", slug: "midcap" },
              { label: "Small Cap", slug: "small-cap" },
              { label: "Nifty 100", slug: "nifty-100" },
              { label: "Nifty Next 50", slug: "nifty-next-50" },
              { label: "", slug: "" },
            ].map((item, i) => (
              item.slug
                ? <a key={i} href={`/mutual-funds/index/${item.slug}`} className="p-6 font-bold text-center hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition-colors block">{item.label}</a>
                : <div key={i} className="p-6" />
            ))}
          </div>
        </section>

        {/* 10. UNDERSTANDING SECTIONS */}
        <section className="space-y-12 pb-20">
          <h2 className="text-4xl font-bold">Understanding <span className="text-blue-900 font-normal text-3xl">Sections</span></h2>
          <DetailSection title="Featured Mutual Funds" content="These are some of the handpicked funds for you, carefully selected from the vast universe of mutual funds to match your requirements. You can see the returns of these funds over the last 1 year, 3 years and 5 years." anchor="Back to Featured Mutual Funds" href="#featured" />
          <DetailSection title="Top Performing Funds" content="Mutual Funds which have been giving good returns over a long term period of 3 years, they are highly rated by Morning Star and have a AUM of at least 300Cr." anchor="Back to Top Performing Funds" href="#top-performing" />
          <DetailSection title="Explore All Funds" content="Explore all Funds in the mutual Fund universe, systematically based on your choice of category / subcategories. Choose the best funds for investment suitable to your needs with the help of various tools like filters, fund comparison, sorting etc" anchor="Back to Explore All Funds" href="#explore" />
          <DetailSection title="Ideas For Investment" content="Carefully curated categories of Mutual funds to suit needs of all our customers. Every category has been thought from perspective of lakhs of customers personalities and risk taking ability." anchor="Back to Ideas For Investment" href="#ideas" />
          <DetailSection title="Mutual Fund Growth Calculator" content="Use our calculators to simulate how your money will grow over a period of time. You can also compare your returns with other traditional investment options like FD." anchor="Back to Growth Calculator" href="#calculator" />
          <DetailSection title="Sector Based Funds" content="Sector based Funds are equity mutual funds investing in a specific sector such as real estate, energy, healthcare, infrastructure, etc. Sectoral funds enable investors to invest in preferred sectors." anchor="Back to Sector Based Funds" href="#sector" />
          <DetailSection title="Index Based Funds" content="Index funds follow a benchmark index like Nifty 50. They are low-cost funds and are suitable for investors looking for long term wealth creation via passive investment." anchor="Back to Index Based Funds" href="#index" />
        </section>

      </main>
      <Footer />
    </div>
  );
};

// --- DATA MOCKUP ---
const featuredEquityData = [
  { name: "BANDHAN SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "11.23%", y3: "30.73%", y5: "23.32%", aum: "20,129 Cr", exp: "1.62%" },
  { name: "NIPPON INDIA GROWTH MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "15.21%", y3: "26.42%", y5: "22.86%", aum: "39,676 Cr", exp: "1.52%" },
  { name: "EDELWEISS MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "12.95%", y3: "25.72%", y5: "21.25%", aum: "13,553 Cr", exp: "1.67%" },
];

const featuredHybridData = [
  { name: "EDELWEISS BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "7.01%", y3: "12.43%", y5: "10.52%", aum: "12,234 Cr", exp: "1.68%" },
  { name: "DSP DYNAMIC ASSET ALLOCATION FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "5.74%", y3: "12.36%", y5: "8.88%", aum: "3,548 Cr", exp: "1.88%" },
  { name: "TATA BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "4.66%", y3: "10.24%", y5: "9.56%", aum: "8,725 Cr", exp: "1.73%" },
];

const topEquityData = [
  { name: "INVESCO INDIA MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "15.79%", y3: "26.69%", y5: "21.49%", aum: "9,895 Cr", exp: "1.71%" },
  { name: "ICICI PRU MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "27.27%", y3: "26.68%", y5: "21.11%", aum: "6,568 Cr", exp: "1.85%" },
  { name: "WHITEOAK CAPITAL MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "18.45%", y3: "26.53%", y5: "NA", aum: "4,490 Cr", exp: "1.85%" },
];

const topHybridData = [
  { name: "BANK OF INDIA MID & SMALL CAP EQUITY & DEBT FUND (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "12.86%", y3: "20.04%", y5: "17.74%", aum: "1,281 Cr", exp: "2.03%" },
  { name: "ICICI PRU EQUITY & DEBT FUND - (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "7.36%", y3: "18.64%", y5: "18.81%", aum: "46,700 Cr", exp: "1.52%" },
  { name: "JM AGGRESSIVE HYBRID FUND - (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "0.48%", y3: "17.3%", y5: "14.88%", aum: "651 Cr", exp: "2.34%" },
];

const topTaxData = [
  { name: "MOTILAL OSWAL ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "15.01%", y3: "24.84%", y5: "19.27%", aum: "3,968 Cr", exp: "1.82%" },
  { name: "SBI ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "5.18%", y3: "21.97%", y5: "18.82%", aum: "28,441 Cr", exp: "1.57%" },
  { name: "WHITEOAK CAPITAL ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "4.3%", y3: "19.55%", y5: "NA", aum: "402 Cr", exp: "2.33%" },
];

// --- HELPER COMPONENTS ---
const FeatureItem = ({ icon, label }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-gray-50 border rounded-full flex items-center justify-center shadow-sm">{icon}</div>
    <p className="text-sm font-semibold text-gray-600 max-w-[140px]">{label}</p>
  </div>
);

const FundTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-400 text-xs uppercase tracking-widest border-b">
          <th className="pb-4 font-bold">Fund</th>
          <th className="pb-4 font-bold text-center">1Y</th>
          <th className="pb-4 font-bold text-center">3Y CAGR</th>
          <th className="pb-4 font-bold text-center">5Y CAGR</th>
          <th className="pb-4 font-bold text-center">AUM</th>
          <th className="pb-4 font-bold text-center">Exp</th>
          <th className="pb-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map((fund, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors">
            <td className="py-6">
              <div className="font-bold text-sm text-gray-800">{fund.name}</div>
              <div className="text-xs text-gray-400 mt-1 font-medium">{fund.cat}</div>
            </td>
            <td className="text-center font-bold text-[#2A938F]">{fund.y1}</td>
            <td className="text-center font-bold text-[#2A938F]">{fund.y3}</td>
            <td className="text-center font-bold text-[#2A938F]">{fund.y5}</td>
            <td className="text-center font-bold text-gray-700">{fund.aum}</td>
            <td className="text-center font-bold text-gray-700">{fund.exp}</td>
            <td className="text-right">
              <div className="flex items-center justify-end gap-6">
                <a href="https://lendrixventech.investwell.app" target="_blank" rel="noopener noreferrer" className="bg-blue-900 text-white px-10 py-2 rounded font-bold text-sm shadow-md">Invest</a>
                <Share2 className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExploreCol = ({ title, items }) => (
  <div className="space-y-4 border p-6 rounded-lg bg-white">
    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <div className="space-y-4 divide-y">
      {items.map((item, i) => (
        <div key={i} className="pt-4 flex justify-between items-center group cursor-pointer">
          <span className="font-bold text-gray-700 group-hover:text-blue-900">{item}</span>
          <ChevronRight className="w-6 h-6 p-1 bg-blue-50 text-blue-900 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const IdeaCard = ({ icon, title, desc, link }) => (
  <a href={link} className="p-8 flex flex-col gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
    <h3 className="font-bold text-xl text-gray-800">{title}</h3>
    <p className="text-gray-400 text-sm font-medium">{desc}</p>
  </a>
);

const SliderReturns = ({ label, val, setVal, unit, config }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-6">
      <label className="text-gray-400 text-sm font-bold uppercase">{label}</label>
      <span className="bg-white px-4 py-1 rounded border shadow-sm font-bold text-blue-900">{val} {unit}</span>
    </div>
    <input
      type="range"
      min={config.min}
      max={config.max}
      value={val}
      onChange={(e) => setVal(parseInt(e.target.value))}
      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
    />
    <div className="flex justify-between mt-3 px-1">
      {config.steps.map(s => <span key={s} className="text-[11px] text-gray-400 font-bold">{s}</span>)}
    </div>
  </div>
);

const Slider = ({ label, val, setVal, unit, max, steps }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-6">
      <label className="text-gray-400 text-sm font-bold uppercase">{label}</label>
      <span className="bg-white px-4 py-1 rounded border shadow-sm font-bold text-blue-900">{val} {unit}</span>
    </div>
    <input 
      type="range" 
      min={steps[0]} 
      max={max} 
      value={val} 
      onChange={(e) => setVal(parseInt(e.target.value))} 
      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900" 
    />
    <div className="flex justify-between mt-3 px-1">
      {steps.map(s => <span key={s} className="text-[11px] text-gray-400 font-bold">{s}Y</span>)}
    </div>
  </div>
);

const ProgressBar = ({ label, value, total, color, amount }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
      <span>{label}</span>
      <span className="text-gray-800 text-sm">₹ {amount.toLocaleString('en-IN')}</span>
    </div>
    <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
      <div 
        className={`h-full ${color} transition-all duration-500 shadow-inner`} 
        style={{ width: `${(value / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

const SectorCard = ({ icon, label, link }) => (
  <a href={link} className="p-12 flex flex-col items-center gap-6 hover:bg-blue-50 cursor-pointer transition-all group">
    <div className="p-4 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    <span className="font-bold text-gray-700 text-lg text-center">{label}</span>
  </a>
);

const DetailSection = ({ title, content, anchor, href }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end border-b pb-4">
      <h3 className="text-2xl font-bold text-blue-900">{title}</h3>
      <a href={href} className="text-blue-900 font-bold text-sm flex items-center gap-1">
        <TrendingUp className="w-4 h-4 rotate-[-45deg]" /> {anchor}
      </a>
    </div>
    <p className="text-gray-500 leading-relaxed font-medium">{content}</p>
  </div>
);

export default MutualFundsPage;