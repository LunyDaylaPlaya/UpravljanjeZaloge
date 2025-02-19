import { Table, Placeholder } from "react-bootstrap"

function ProductSkeleton() {
  return (
    <div className='tableContainer' style={{padding: '5em'}}>
      <div className='header'>
        <h1 className="placeholder">Users</h1>
        <Placeholder.Button variant="success" size="sm" disabled xs={1}/>
      </div>
      <Table striped bordered hover style={{ width: '70%', margin: 'auto' }}>
        <thead>
          <tr>
            <th><Placeholder xs={4} /></th>
            <th><Placeholder xs={5} /></th>
            <th><Placeholder xs={6} /></th>
            <th><Placeholder xs={5} /></th>
            <th><Placeholder xs={4} /></th>
            <th><Placeholder xs={3} /></th>
          </tr>
        </thead>
        <tbody>

          {
            Array.from({length: 5}).map((_, index) => (
              <tr key={index}>
                <th><Placeholder xs={10}/></th>
                <th><Placeholder xs={10}/></th>
                <th><Placeholder xs={10}/></th>
                <th><Placeholder xs={10}/></th>
                <th><Placeholder xs={10}/></th>
                <th><Placeholder xs={10}/></th>
                <td className='d-flex justify-content-center column-gap-2'>
                  <Placeholder.Button disabled className="placeholder" variant="primary" size="sm" xs={2}/>
                  <Placeholder.Button disabled className="placeholder" variant="danger" size="sm" xs={2}/>
                </td>
              </tr>
            ))
          }

        </tbody>
      </Table>
    </div>
  )
}

export default ProductSkeleton
