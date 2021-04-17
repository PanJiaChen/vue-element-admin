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

import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

class Criteria {
  constructor({
    tableName,
    query,
    whereClause,
    referenceUuid,
    conditionsList = [],
    orderByClause,
    valuesList = [],
    orderByColumnsList = [],
    limit
  }) {
    this.tableName = tableName
    this.query = query
    this.whereClause = whereClause
    this.referenceUuid = referenceUuid
    this.conditionsList = conditionsList
    this.orderByClause = orderByClause
    this.valuesList = valuesList
    this.orderByColumnsList = orderByColumnsList
    this.limit = limit
  }

  setTableName(tableName) {
    this.tableName = tableName
    return this
  }

  setQuery(query) {
    this.query = query
    return this
  }

  setWhereClause(whereClause) {
    this.whereClause = whereClause
    return this
  }

  setReferenceUuid(referenceUuid) {
    this.referenceUuid = referenceUuid
    return this
  }

  addCondition({ columnName, condition, value }) {
    if (isEmptyValue(value)) {
      return this
    }

    this.conditionsList.push({
      columnName,
      condition,
      value
    })
    return this
  }

  setConditionsList(conditionsList) {
    this.conditionsList = conditionsList
    return this
  }

  setOrderByClause(orderByClause) {
    this.orderByClause = orderByClause
    return this
  }

  addValue(value) {
    if (isEmptyValue(value)) {
      return this
    }

    this.valuesList.push(value)
    return this
  }

  setValuesList(valuesList) {
    this.valuesList = valuesList
    return this
  }

  addOrderByColumn(orderByColumn) {
    if (isEmptyValue(orderByColumn)) {
      return this
    }

    this.orderByColumnsList.push(orderByColumn)
    return this
  }

  setOrderByColumnsList(orderByColumnsList) {
    this.orderByColumnsList = orderByColumnsList
    return this
  }

  setLimit(limit) {
    this.limit = limit
    return this
  }

  getCriteria() {
    return {
      tableName: this.tableName,
      query: this.query,
      whereClause: this.whereClause,
      referenceUuid: this.referenceUuid,
      conditionsList: this.conditionsList,
      orderByClause: this.orderByClause,
      valuesList: this.valuesList,
      orderByColumnsList: this.orderByColumnsList,
      limit: this.limit
    }
  }

  get criteria() {
    return this.getCriteria()
  }
}

export default Criteria
