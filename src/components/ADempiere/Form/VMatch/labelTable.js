// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// List of fields to send in search
import language from '@/lang'

export default [
  {
    columnName: 'nrDocument',
    label: language.t('form.match.table.nrDocument'),
    isNumeric: false,
    size: '150'
  },
  {
    columnName: 'date',
    label: language.t('table.recentItems.date'),
    isNumeric: false,
    size: '150'
  },
  {
    columnName: 'C_BPartner_ID',
    label: language.t('form.pos.order.BusinessPartnerCreate.businessPartner'),
    isNumeric: false,
    size: '200'
  },
  {
    columnName: 'noLínea',
    label: language.t('form.pos.order.numberLines'),
    isNumeric: true,
    size: '150'
  },
  {
    columnName: 'product',
    label: language.t('form.pos.tableProduct.product'),
    isNumeric: true,
    size: '150'
  },
  {
    columnName: 'quantity',
    label: language.t('form.pos.tableProduct.quantity'),
    isNumeric: true,
    size: '150'
  },
  {
    columnName: 'assigned',
    label: language.t('form.match.field.assigning'),
    isNumeric: true,
    size: '150'
  }
]
