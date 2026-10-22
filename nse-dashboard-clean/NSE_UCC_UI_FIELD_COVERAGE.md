# UCC UI field coverage

Updated after enabling the documented investor, holding and physical/demat selections in both frontends. Compared all 181 supplied fields with the current UI and request mapping.

| Status | Count |
| --- | ---: |
| input | 132 |
| automatic | 4 |
| server | 6 |
| missing | 39 |

Inputs appear conditionally. Joint/anyone-or-survivor holding displays the second holder and an Add third holder button; minor investor types display guardian details; demat displays PMS, depository and relevant identifiers; overseas types display a foreign address; PAN-exempt holders display category and KRA reference; entities display an optional LEI and its validity when provided. The request preserves the selected tax status, holding and client type.

All 59 tax statuses are selectable. Their required fields are checked locally. Tests do not establish live API acceptance for each category. The earlier deployed opt-out reference rejection remains an upstream contract issue.

## Remaining missing fields

- `account_type_2`
- `account_no_2`
- `micr_no_2`
- `ifsc_code_2`
- `default_bank_flag_2`
- `account_type_3`
- `account_no_3`
- `micr_no_3`
- `ifsc_code_3`
- `default_bank_flag_3`
- `account_type_4`
- `account_no_4`
- `micr_no_4`
- `ifsc_code_4`
- `default_bank_flag_4`
- `account_type_5`
- `account_no_5`
- `micr_no_5`
- `ifsc_code_5`
- `default_bank_flag_5`
- `cheque_name`
- `resi_phone`
- `resi_fax`
- `office_phone`
- `office_fax`
- `foreign_address_resi_phone`
- `foreign_address_fax`
- `foreign_address_off_phone`
- `foreign_address_off_fax`
- `mapin_id`
- `nominee_1_dob`
- `nominee_1_guardian`
- `nominee_1_guardian_pan`
- `nominee_2_dob`
- `nominee_2_guardian`
- `nominee_2_guardian_pan`
- `nominee_3_dob`
- `nominee_3_guardian`
- `nominee_3_guardian_pan`

These remaining fields cover banks 2?5, cheque name, optional local/foreign phone and fax numbers, MAPIN, and minor nominees. The form still supports one default bank and up to three adult nominees.

## Automatic and backend-managed fields

The first bank is automatically the default. Each included adult nominee receives minor flag N. Backend-managed IDs, timestamps and registration status/remarks are not editable registration inputs.

## UI-only controls and aliases

`confirm_account`, `nominee_count`, and `third_holder_enabled` are not submitted. Nominee identity_no/pincode map to identity_number/pin. Country master code 101 maps to INDIA in the domestic address request. `nominee_opt_out_ref_no` is not in the supplied list; the PDF requires it, but the deployed API currently rejects it.

## Complete inventory

| # | Field | Status |
| ---: | --- | --- |
| 1 | `id` | server |
| 2 | `client_code` | input |
| 3 | `primary_holder_first_name` | input |
| 4 | `primary_holder_middle_name` | input |
| 5 | `primary_holder_last_name` | input |
| 6 | `tax_status` | input |
| 7 | `gender` | input |
| 8 | `primary_holder_dob_incorporation` | input |
| 9 | `occupation_code` | input |
| 10 | `holding_nature` | input |
| 11 | `second_holder_first_name` | input |
| 12 | `second_holder_middle_name` | input |
| 13 | `second_holder_last_name` | input |
| 14 | `third_holder_first_name` | input |
| 15 | `third_holder_middle_name` | input |
| 16 | `third_holder_last_name` | input |
| 17 | `second_holder_dob` | input |
| 18 | `third_holder_dob` | input |
| 19 | `guardian_first_name` | input |
| 20 | `guardian_middle_name` | input |
| 21 | `guardian_last_name` | input |
| 22 | `guardian_dob` | input |
| 23 | `primary_holder_pan_exempt` | input |
| 24 | `second_holder_pan_exempt` | input |
| 25 | `third_holder_pan_exempt` | input |
| 26 | `guardian_pan_exempt` | input |
| 27 | `primary_holder_pan` | input |
| 28 | `second_holder_pan` | input |
| 29 | `third_holder_pan` | input |
| 30 | `guardian_pan` | input |
| 31 | `primary_holder_exempt_category` | input |
| 32 | `second_holder_exempt_category` | input |
| 33 | `third_holder_exempt_category` | input |
| 34 | `guardian_exempt_category` | input |
| 35 | `client_type` | input |
| 36 | `pms` | input |
| 37 | `default_dp` | input |
| 38 | `cdsl_dpid` | input |
| 39 | `cdslcltid` | input |
| 40 | `cmbp_id` | input |
| 41 | `nsdldpid` | input |
| 42 | `nsdlcltid` | input |
| 43 | `account_type_1` | input |
| 44 | `account_no_1` | input |
| 45 | `micr_no_1` | input |
| 46 | `ifsc_code_1` | input |
| 47 | `default_bank_flag_1` | automatic |
| 48 | `account_type_2` | missing |
| 49 | `account_no_2` | missing |
| 50 | `micr_no_2` | missing |
| 51 | `ifsc_code_2` | missing |
| 52 | `default_bank_flag_2` | missing |
| 53 | `account_type_3` | missing |
| 54 | `account_no_3` | missing |
| 55 | `micr_no_3` | missing |
| 56 | `ifsc_code_3` | missing |
| 57 | `default_bank_flag_3` | missing |
| 58 | `account_type_4` | missing |
| 59 | `account_no_4` | missing |
| 60 | `micr_no_4` | missing |
| 61 | `ifsc_code_4` | missing |
| 62 | `default_bank_flag_4` | missing |
| 63 | `account_type_5` | missing |
| 64 | `account_no_5` | missing |
| 65 | `micr_no_5` | missing |
| 66 | `ifsc_code_5` | missing |
| 67 | `default_bank_flag_5` | missing |
| 68 | `cheque_name` | missing |
| 69 | `div_pay_mode` | input |
| 70 | `address_1` | input |
| 71 | `address_2` | input |
| 72 | `address_3` | input |
| 73 | `city` | input |
| 74 | `state` | input |
| 75 | `pincode` | input |
| 76 | `country` | input |
| 77 | `resi_phone` | missing |
| 78 | `resi_fax` | missing |
| 79 | `office_phone` | missing |
| 80 | `office_fax` | missing |
| 81 | `email` | input |
| 82 | `communication_mode` | input |
| 83 | `foreign_address_1` | input |
| 84 | `foreign_address_2` | input |
| 85 | `foreign_address_3` | input |
| 86 | `foreign_address_city` | input |
| 87 | `foreign_address_pincode` | input |
| 88 | `foreign_address_state` | input |
| 89 | `foreign_address_country` | input |
| 90 | `foreign_address_resi_phone` | missing |
| 91 | `foreign_address_fax` | missing |
| 92 | `foreign_address_off_phone` | missing |
| 93 | `foreign_address_off_fax` | missing |
| 94 | `indian_mobile_no` | input |
| 95 | `primary_holder_kyc_type` | input |
| 96 | `primary_holder_ckyc_number` | input |
| 97 | `second_holder_kyc_type` | input |
| 98 | `second_holder_ckyc_number` | input |
| 99 | `third_holder_kyc_type` | input |
| 100 | `third_holder_ckyc_number` | input |
| 101 | `guardian_kyc_type` | input |
| 102 | `guardian_ckyc_number` | input |
| 103 | `primary_holder_kra_exempt_ref_no` | input |
| 104 | `second_holder_kra_exempt_ref_no` | input |
| 105 | `third_holder_kra_exempt_ref_no` | input |
| 106 | `guardian_exempt_ref_no` | input |
| 107 | `aadhaar_updated` | input |
| 108 | `mapin_id` | missing |
| 109 | `paperless_flag` | input |
| 110 | `lei_no` | input |
| 111 | `lei_validity` | input |
| 112 | `mobile_declaration_flag` | input |
| 113 | `email_declaration_flag` | input |
| 114 | `second_holder_email` | input |
| 115 | `second_holder_email_declaration` | input |
| 116 | `second_holder_mobile` | input |
| 117 | `second_holder_mobile_declaration` | input |
| 118 | `third_holder_email` | input |
| 119 | `third_holder_email_declaration` | input |
| 120 | `third_holder_mobile` | input |
| 121 | `third_holder_mobile_declaration` | input |
| 122 | `guardian_relation` | input |
| 123 | `nomination_opt` | input |
| 124 | `nomination_authentication` | input |
| 125 | `nominee_1_name` | input |
| 126 | `nominee_1_relationship` | input |
| 127 | `nominee_1_applicable` | input |
| 128 | `nominee_1_minor_flag` | automatic |
| 129 | `nominee_1_dob` | missing |
| 130 | `nominee_1_guardian` | missing |
| 131 | `nominee_1_guardian_pan` | missing |
| 132 | `nominee_1_identity_type` | input |
| 133 | `nominee_1_identity_number` | input |
| 134 | `nominee_1_email` | input |
| 135 | `nominee_1_mobile` | input |
| 136 | `nominee_1_address1` | input |
| 137 | `nominee_1_address2` | input |
| 138 | `nominee_1_address3` | input |
| 139 | `nominee_1_city` | input |
| 140 | `nominee_1_pin` | input |
| 141 | `nominee_1_country` | input |
| 142 | `nominee_2_name` | input |
| 143 | `nominee_2_relationship` | input |
| 144 | `nominee_2_applicable` | input |
| 145 | `nominee_2_minor_flag` | automatic |
| 146 | `nominee_2_dob` | missing |
| 147 | `nominee_2_guardian` | missing |
| 148 | `nominee_2_guardian_pan` | missing |
| 149 | `nominee_2_identity_type` | input |
| 150 | `nominee_2_identity_number` | input |
| 151 | `nominee_2_email` | input |
| 152 | `nominee_2_mobile` | input |
| 153 | `nominee_2_address1` | input |
| 154 | `nominee_2_address2` | input |
| 155 | `nominee_2_address3` | input |
| 156 | `nominee_2_city` | input |
| 157 | `nominee_2_pin` | input |
| 158 | `nominee_2_country` | input |
| 159 | `nominee_3_name` | input |
| 160 | `nominee_3_relationship` | input |
| 161 | `nominee_3_applicable` | input |
| 162 | `nominee_3_minor_flag` | automatic |
| 163 | `nominee_3_dob` | missing |
| 164 | `nominee_3_guardian` | missing |
| 165 | `nominee_3_guardian_pan` | missing |
| 166 | `nominee_3_identity_type` | input |
| 167 | `nominee_3_identity_number` | input |
| 168 | `nominee_3_email` | input |
| 169 | `nominee_3_mobile` | input |
| 170 | `nominee_3_address1` | input |
| 171 | `nominee_3_address2` | input |
| 172 | `nominee_3_address3` | input |
| 173 | `nominee_3_city` | input |
| 174 | `nominee_3_pin` | input |
| 175 | `nominee_3_country` | input |
| 176 | `nominee_soa` | input |
| 177 | `reg_id` | server |
| 178 | `reg_status` | server |
| 179 | `reg_remark` | server |
| 180 | `created_at` | server |
| 181 | `updated_at` | server |
