import React from 'karet'
import * as U from 'karet.util'

export default ({ fields, data, sortFn, sortedBy, className = '' }) => {
  const HeadCells = U.seq(fields, U.values, U.mapIndexed((field, idx) => {
    const key = U.view('key', field)
    const sortable = U.ift(key, true, false)
    const sortedByKey = U.view('key', sortedBy)
    const direction = U.view('direction', sortedBy)

    return (
      <th
        {...U.classes(
          field.className,
          U.ift(sortable, 'table-sortable'),
          U.ift(U.equals(key, sortedByKey),
            U.ifte(U.equals(direction, 'ASC'),
              'table-sortedAsc',
              'table-sortedDesc'))
        )}
        key={idx}
        onClick={() => sortable && sortFn(field)}
      >
        {field.title && field.title.length && field.title}
      </th>
    )
  }))

  const Rows = U.seq(data, U.mapIndexed((row, idx) => <Row data={row} fields={fields} key={idx} />), U.toProperty)

  Rows.log()

  return (
    <div className={'table-wrapper'}>
      <table {...U.classes(className, 'table')}>
        <thead>
          <tr>
            {HeadCells}
          </tr>
        </thead>
        <tbody>
          {U.ifte(U.isEmpty(Rows),
            (
              <tr className={'table-empty'}>
                <td colSpan={U.length(fields)}>No results</td>
              </tr>
            ),
            Rows
          )}
        </tbody>
      </table>
    </div>
  )
}

const Row = ({ data, fields }) => {
  const Cells = Object.values(fields).map((field, idx) => {
    return (
      <td className={field.className} key={idx}>{field.render ? field.render(data) : data[field.key]}</td>
    )
  })

  return (
    <tr>
      {Cells}
    </tr>
  )
}
