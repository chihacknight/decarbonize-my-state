import React from "react"
import { Link } from "gatsby"
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { 
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import { FaCheck } from "react-icons/fa"
import { intcomma } from "journalize"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'


const JobTable = ({data}) => {
  function greenJobFormatter (cell, row) {
    if (cell) {
      return (
        <h2 className={'sunrise-green'} style={ { textAlign: 'center' } }>
          <FaCheck />
        </h2>
      )
    }
  }

  function detailLink (cell, row) {
    if (cell) {
      return (
        <Link to={`/job/${row.occupation_slug}`}>
          {cell}
        </Link>
      )
    }
  }

  function formatEarnings (cell, row) {
    if (cell) {
      return (
        <span>
          ${intcomma(cell)}
        </span>
      )
    }
  }

  function formatPercent (cell, row) {
    if (cell) {
      return (
        <span>
          {cell.toFixed(1)}%
        </span>
      )
    }
  }

  function formatInt (cell, row) {
    if (cell) {
      return (
        <span>
          {intcomma(cell)}
        </span>
      )
    }
  }

  function sortNullLast (a, b, order, dataField, rowA, rowB) {
    if (order === 'desc') {
      if (!a) {
        a = -Infinity
      }
      if (!b) {
        b = -Infinity
      }
      return b - a
    } else {
      if (!a) {
        a = Infinity
      } 
      if (!b) {
        b = Infinity
      }
      return a - b
    }
  }

  const columns = [
    {
      dataField: 'occupation',
      text: 'Occupation',
      formatter: detailLink,
      sort: true
    },
    {
      dataField: 'green_job',
      text: 'Common green job',
      formatter: greenJobFormatter,
      sort: true
    },
    {
      dataField: 'total_employed',
      text: 'US workers',
      formatter: formatInt,
      sort: true,
      sortFunc: sortNullLast
    },
    {
      dataField: 'perc_women',
      text: 'Women',
      formatter: formatPercent,
      sort: true,
      sortFunc: sortNullLast
    },
    {
      dataField: 'perc_black_aa',
      text: 'Black',
      formatter: formatPercent,
      sort: true,
      sortFunc: sortNullLast
    },
    {
      dataField: 'perc_hispanic_latino',
      text: 'Hispanic / Latino',
      formatter: formatPercent,
      sort: true,
      sortFunc: sortNullLast
    },
    {
      dataField: 'perc_asian',
      text: 'Asian',
      formatter: formatPercent,
      sort: true,
      sortFunc: sortNullLast
    },
    {
      dataField: 'weekly_earnings',
      text: 'Weekly Earnings',
      formatter: formatEarnings,
      sort: true,
      sortFunc: sortNullLast
    }
  ]

  const defaultSorted = [{
    dataField: 'green_job',
    order: 'desc' // desc or asc
  }]

  const paginationOptions = {
    custom: true,
    totalSize: data.allOccupationsJson.nodes.length
  }

  const { SearchBar } = Search

  return (
    <ToolkitProvider
      keyField='id'
      data={ data.allOccupationsJson.nodes }
      columns={ columns }
      bootstrap4
      search
    >
      { props => (
        <div>
          <PaginationProvider
            pagination={ paginationFactory(paginationOptions) } 
          >
            { ({ paginationProps, paginationTableProps }) => (
              <>
                <div class="row">
                  <div className="d-inline-block d-md-inline-flex col-12 table-controls">
                    <SearchBar
                      className="col-12"
                      { ...props.searchProps } 
                    />
                    <div className="d-inline-flex px-0 col-12 col-md-6 col-lg-4 justify-content-around">
                      <PaginationListStandalone
                        { ...paginationProps }
                      />
                      <SizePerPageDropdownStandalone
                        { ...paginationProps }
                      />
                    </div>
                  </div>
                </div>
                <BootstrapTable
                  keyField='id'
                  wrapperClasses='table-responsive'
                  classes='jobTable table-sm'
                  data={ data.allOccupationsJson.nodes }
                  columns={ columns }
                  bootstrap4
                  hover
                  condensed
                  defaultSorted={ defaultSorted }
                  { ...paginationTableProps }
                  {... props.baseProps}
                />
              </>
            )}
          </PaginationProvider>
        </div>
      )}
    </ToolkitProvider>
  )
}

export default JobTable
