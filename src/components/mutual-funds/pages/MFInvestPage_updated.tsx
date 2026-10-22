// Add this code after the Duration select in buy-step-2, around line 1100

{amount && (
  <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6">
    <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wide mb-4">Estimated Returns</h4>
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-white p-4 border border-emerald-100">
        <p className="text-xs text-emerald-600 font-medium">Total Invested</p>
        <p className="text-lg font-bold text-emerald-900 mt-2">₹{(Number(amount) * (sipFrequency === 'Monthly' ? (parseInt(sipDuration) * 12) : (parseInt(sipDuration) * 4))).toLocaleString('en-IN')}</p>
      </div>
      <div className="rounded-lg bg-white p-4 border border-emerald-100">
        <p className="text-xs text-emerald-600 font-medium">Estimated Value</p>
        <p className="text-lg font-bold text-emerald-900 mt-2">₹{(Number(amount) * (sipFrequency === 'Monthly' ? (parseInt(sipDuration) * 12) : (parseInt(sipDuration) * 4)) * 1.12).toLocaleString('en-IN')}</p>
      </div>
      <div className="rounded-lg bg-white p-4 border border-emerald-100">
        <p className="text-xs text-emerald-600 font-medium">Est. Gain</p>
        <p className="text-lg font-bold text-emerald-600 mt-2">+₹{(Number(amount) * (sipFrequency === 'Monthly' ? (parseInt(sipDuration) * 12) : (parseInt(sipDuration) * 4)) * 0.12).toLocaleString('en-IN')}</p>
      </div>
    </div>
    <p className="text-xs text-emerald-700 mt-4 font-medium">*Based on 12% annual return assumption. Actual returns may vary.</p>
  </div>
)}
