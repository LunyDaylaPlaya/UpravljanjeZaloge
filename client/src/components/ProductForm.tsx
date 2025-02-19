import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../const';
import { Product } from '../types/product';

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  fetchProduct: () => void;
  currentData?: Product;
};

const ProductForm = ({ isOpen, onClose, fetchProduct, currentData }: ProductFormProps) => {
  const [show, setShow] = useState(isOpen);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const [product, setProduct] = useState({
    id: 0,
    name: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    if (currentData) {
      setProduct({
        id: currentData.id || 0,
        name: currentData.name || '',
        description: currentData.description || '',
        price: currentData.price || 0,
      });
    }
  }, [currentData]);

  console.log(currentData);

  const onSave = () => {
    if (currentData && currentData.id) {
      axios
        .put(`${BASE_URL}product/${currentData.id}`, product)
        .then(() => {
          onClose();
          fetchProduct();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const { id, ...newProduct } = product;
      axios
        .post(`${BASE_URL}product`, newProduct)
        .then(() => {
          onClose();
          fetchProduct();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {product.id ? 'Uredi Izdelek' : 'Dodaj Izdelek'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Label htmlFor="prod-name">Vnesi naziv</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Naziv Izdelka"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </InputGroup>

          <Form.Label htmlFor="prod-desc">Opis</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              as="textarea"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </InputGroup>

          <Form.Label htmlFor="prod-price">Cena</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="number"
              value={product.price}
              placeholder="€0.00"
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zapri
          </Button>
          <Button variant="primary" onClick={onSave}>
            Shrani
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductForm;
