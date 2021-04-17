// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

// This file can be used for all related to location util like capture sequence and others values.
// Please add here all locations util methods

// Use this function for get a list of sequence of capture for locations
export function getSequenceAsList(captureSequence) {
  if (!captureSequence) {
    return undefined
  }
  //  Split it
  return captureSequence
    .replace('@@', '@')
    .replace(',', '')
    .trim()
    .split('@')
    .filter(value => value.trim())
}
