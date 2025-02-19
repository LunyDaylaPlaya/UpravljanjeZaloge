import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Table, Popover, OverlayTrigger } from "react-bootstrap";
import ProductSkeleton from "../components/ProductSkeleton";
import { BASE_URL } from "../const";
import { Warehouse } from '../types/warehouse';
import WarehouseForm from "../components/WarehouseForm";

function WarehousePage() {

    const [isOpen, setIsOpen] = useState(false);
    const [currentData, setCurrentData] = useState<Warehouse>({} as Warehouse);
  
    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);
  
    const [data, setData] = useState<Warehouse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    useEffect(() => {
      fetchData();
    }, [])
  

    const fetchData: () => void = () => {
      setIsLoading(true);
  
      axios.get(BASE_URL + "warehouse").then(res => {
        setData(res.data);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      })
    }
  
    const getWarehouse = (id:number) => {
      axios.get<Warehouse>(BASE_URL + "warehouse/" + id).then((res) => {
        setCurrentData(res.data);
        
        onOpen();
      }).catch(err => {
        console.log(err);
      })
    }
  
    const handleAdd = () => {
      onOpen();
      setCurrentData({} as Warehouse);
    }
  
    const onDeleteHandler = (id: number) => {
      axios.delete(BASE_URL + "warehouse/" + id).then(() => {
        fetchData();
      }).catch(err => {
        console.log(err);
      })
    }
  
    if(isLoading) return <ProductSkeleton />
  
    return (
      <>
      <div className='tableContainer' style={{padding: '2em'}}>
        <div className='header'>
          <h1>Skladišča</h1>
          <Button variant="success" size="sm" onClick={() => handleAdd()}>Dodaj Skladišče</Button>
        </div>
        <Table striped bordered hover responsive style={{ width: '70%', margin: 'auto' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Id</th>
              <th>Naziv</th>
              <th>Ime Ulice</th>
              <th>Hišna Številka</th>
              <th>Poštna Številka</th>
              <th>Kraj</th>
              <th>Država</th>
              <th>Kapaciteta</th>
              <th>Urejanje</th>
            </tr>
          </thead>
          <tbody>
  
          {
              data.map((warehouse: Warehouse, index) => {
                const popover = (
                  <Popover id="popover-basic">
                    <Popover.Body className='d-flex flex-column align-items-center row-gap-3'>
                      Are you sure you want to delete this product?
                      <Button variant="danger" onClick={() => onDeleteHandler(warehouse.id)}>Delete</Button>
                    </Popover.Body>
                  </Popover>
                );
  
                return (
                  <tr key={warehouse.id}>
                    <td>{index + 1}</td>
                    <td>{warehouse.id}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.streetName}</td>
                    <td>{warehouse.houseNumber}</td>
                    <td>{warehouse.zipCode}</td>
                    <td>{warehouse.city}</td>
                    <td>{warehouse.state}</td>
                    <td>{warehouse.capacity}</td>
                    <td className='d-flex justify-content-center column-gap-2'>
                      <Button variant="primary" size="sm" onClick={() => getWarehouse(warehouse.id)}>Edit</Button>
                      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                        <Button variant="danger" size="sm">Delete</Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })
            }
  
          </tbody>
        </Table>
  
        {
          data.length ==0 && <h3 className='text-center'>No Data</h3>
        }
  
        {isOpen && <WarehouseForm isOpen={isOpen} onClose={onClose} fetchWarehouse={fetchData} currentData={currentData} />}
      </div>
      </>
    )
  
}

export default WarehousePage;
