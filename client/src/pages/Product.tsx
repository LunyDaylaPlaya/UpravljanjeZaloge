import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { BASE_URL } from '../const';
import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductForm from '../components/ProductForm';
import { OverlayTrigger, Popover } from 'react-bootstrap';


function ProductPage() {

  const [isOpen, setIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState<Product>({} as Product);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData: () => void = () => {
    setIsLoading(true);

    axios.get(BASE_URL + "product").then(res => {
      setData(res.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getProduct = (id:number) => {
    axios.get<Product>(BASE_URL + "product/" + id).then((res) => {
      setCurrentData(res.data);
      
      onOpen();
    }).catch(err => {
      console.log(err);
    })
  }

  const handleAdd = () => {
    onOpen();
    setCurrentData({} as Product);
  }

  const onDeleteHandler = (id: number) => {
    axios.delete(BASE_URL + "product/" + id).then(() => {
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
        <h1>Izdelki</h1>
        <Button variant="success" size="sm" onClick={() => handleAdd()}>Dodaj Izdelek</Button>
      </div>
      <Table striped bordered hover responsive className='md-3' style={{ width: '70%', margin: 'auto'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Naziv</th>
            <th>Opis</th>
            <th>Cena</th>
            <th>Urejanje</th>
          </tr>
        </thead>
        <tbody>

        {
            data.map((product: Product, index) => {
              const popover = (
                <Popover id="popover-basic">
                  <Popover.Body className='d-flex flex-column align-items-center row-gap-3'>
                    Ali ste prepričani, da želite izbrisati ta izdelek?
                    <Button variant="danger" onClick={() => onDeleteHandler(product.id)}>Izbriši</Button>
                  </Popover.Body>
                </Popover>
              );

              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td className='d-flex justify-content-center column-gap-2'>
                    <Button variant="primary" size="sm" onClick={() => getProduct(product.id)}>Uredi</Button>
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                      <Button variant="danger" size="sm">Zbriši</Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })
          }

        </tbody>
      </Table>

      {
        data.length ==0 && <h3 className='text-center'>Ni Podatkov</h3>
      }

      {isOpen && <ProductForm isOpen={isOpen} onClose={onClose} fetchProduct={fetchData} currentData={currentData} />}
    </div>
    </>
  )
}

export default ProductPage