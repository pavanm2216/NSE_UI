# Scheme Code Issue - Solution

## Problem
The API `/master_scheme_list` is not returning `parent_scheme_code` or `scheme_isin` fields, causing the error:
```
⚠️ Invalid scheme code: L-Unknown-Unknown
```

## Root Cause
When scheme codes are missing, the system generates a placeholder: `L-Unknown-Unknown`

This happens because:
1. `parent_scheme_code` is empty
2. `isin` is empty
3. System falls back to generating `L-Unknown-Unknown`

## Solution Implemented

### 1. Enhanced Debugging (`schemeService.ts`)
Now logs ALL fields from the API response to identify what's actually available:

```javascript
[Scheme Debug] First scheme - ALL FIELDS:
{
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  parent_scheme_code: "",
  scheme_isin: "",
  scheme_code: "...",      ← Check if this exists
  scheme_id: "...",        ← Check if this exists
  scheme_amc_code: "SBI",
  ...
}
```

### 2. Scheme Code Resolver (`schemeCodeResolver.ts`)
New utility that resolves scheme codes with priority:

**Priority Order:**
1. `parent_scheme_code` (if available)
2. `scheme_isin` (if available)
3. `scheme_code` (if available)
4. `scheme_id` (if available)
5. **Generated from scheme name** (fallback)

**Example Generation:**
```
"SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH"
↓
"SBI-ESG-EXCL-GR"
```

### 3. Updated MFInvestPage
Now uses `getBestSchemeCode()` instead of simple fallback:

```javascript
const schemeCode = getBestSchemeCode(selectedFund!);
// Returns: "SBI-ESG-EXCL-GR" (generated) or actual code if available
```

## How It Works

### Step 1: Check Console Logs
Run the app and check browser console for:

```
[Scheme Debug] First scheme - ALL FIELDS:
{
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  scheme_code: "SBIESIGGR",    ← If this exists, we can use it
  scheme_id: "12345",          ← Or this
  ...
}
```

### Step 2: Identify Available Field
Look for which field contains the scheme code:
- `scheme_code`?
- `scheme_id`?
- Something else?

### Step 3: Update Resolver
If a different field has the code, update `schemeCodeResolver.ts`:

```javascript
// Add to resolveSchemeCode() function
if (scheme.your_field_name && scheme.your_field_name.trim()) {
  return {
    code: scheme.your_field_name,
    source: 'your_field_name',
    isValid: true,
  };
}
```

## Files Created/Modified

### New Files:
1. **`schemeCodeResolver.ts`** - Scheme code resolution logic
2. **`schemeService.ts`** - Enhanced with detailed debugging

### Modified Files:
1. **`MFInvestPage.tsx`** - Uses new resolver

## Testing

### Test 1: Check Available Fields
1. Open browser console (F12)
2. Load the app
3. Look for `[Scheme Debug] First scheme - ALL FIELDS:`
4. Note which fields have values

### Test 2: Check Generated Codes
1. Trigger SIP flow
2. Look for `[Scheme Code Resolution]` logs
3. Check if code is generated or from API

### Test 3: Verify SIP Registration
1. Complete SIP flow
2. Check if API accepts the generated code
3. If not, we need to find the correct field

## Expected Console Output

### ✅ If scheme_code field exists:
```
[Scheme Debug] First scheme - ALL FIELDS:
{
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  scheme_code: "SBIESIGGR",
  ...
}

[Scheme Code Resolution] {
  schemeName: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  resolvedCode: "SBIESIGGR",
  source: "scheme_code",
  isValid: true
}

[SIP Register] Sending payload: {
  src_scheme: "SBIESIGGR",
  ...
}
```

### ⚠️ If no field exists (fallback to generated):
```
[Scheme Debug] First scheme - ALL FIELDS:
{
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  parent_scheme_code: "",
  scheme_isin: "",
  scheme_code: "",
  scheme_id: "",
  ...
}

[Scheme Code] Generated code from name: {
  name: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  generatedCode: "SBI-ESG-EXCL-GR"
}

[Scheme Code Resolution] {
  schemeName: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH",
  resolvedCode: "SBI-ESG-EXCL-GR",
  source: "generated",
  isValid: false
}
```

## Next Steps

1. **Run the app** and check console logs
2. **Identify which field** has the scheme code
3. **Share the console output** showing:
   - `[Scheme Debug] First scheme - ALL FIELDS:`
   - `[Scheme Code Resolution]` output
4. **We'll update the resolver** if needed

## Fallback Strategy

If the API doesn't provide any scheme code field:
- System generates code from scheme name
- Generated codes may not work with BSE API
- We'll need to contact BSE to get the correct scheme codes
- Or find an alternative API that provides scheme codes

## Summary

| Issue | Solution |
|-------|----------|
| Missing scheme codes | Check all possible fields in API response |
| No valid code found | Generate from scheme name as fallback |
| Generated code fails | Update resolver with correct field name |
| Still fails | Contact BSE for scheme code mapping |

The system is now more robust and will work with whatever scheme code field the API provides!
