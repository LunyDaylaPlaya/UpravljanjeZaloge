import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../const';

type Warehouse = {
  id: number;
  name: string;
  streetName: string;
  houseNumber: number;
  zipCode: string;
  city: string;
  state: string;
  capacity: number;
};

type WarehouseFormProps = {
  isOpen: boolean;
  onClose: () => void;
  fetchWarehouse: () => void;
  currentData?: Warehouse;
};

const WarehouseForm = ({ isOpen, onClose, fetchWarehouse, currentData }: WarehouseFormProps) => {
  const [show, setShow] = useState(isOpen);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const [warehouse, setWarehouse] = useState<Warehouse>({
    id: 0,
    name: '',
    streetName: '',
    houseNumber: 0,
    zipCode: '',
    city: '',
    state: '',
    capacity: 0,
  });

  useEffect(() => {
    if (currentData) {
      setWarehouse({
        id: currentData.id || 0,
        name: currentData.name || '',
        streetName: currentData.streetName || '',
        houseNumber: currentData.houseNumber || 0,
        zipCode: currentData.zipCode || '',
        city: currentData.city || '',
        state: currentData.state || '',
        capacity: currentData.capacity || 0,
      });
    }
  }, [currentData]);

  console.log(currentData);

  const onSave = () => {
    if (currentData && currentData.id) {
      axios
        .put(`${BASE_URL}warehouse/${currentData.id}`, warehouse)
        .then(() => {
          onClose();
          fetchWarehouse();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const { id, ...newWarehouse } = warehouse;
      axios
        .post(`${BASE_URL}warehouse`, newWarehouse)
        .then(() => {
          onClose();
          fetchWarehouse();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', position: 'initial' }}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{warehouse.id ? 'Uredi Skladišče' : 'Dodaj Skladišče'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Naziv</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={warehouse.name}
                onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })}
              />
            </InputGroup>

            <Form.Label>Ulica</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={warehouse.streetName}
                onChange={(e) => setWarehouse({ ...warehouse, streetName: e.target.value })}
              />
            </InputGroup>

            <Form.Label>Hišna Številka</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                value={warehouse.houseNumber}
                onChange={(e) => setWarehouse({ ...warehouse, houseNumber: Number(e.target.value) })}
              />
            </InputGroup>

            <Form.Label>Poštna Številka</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={warehouse.zipCode}
                onChange={(e) => setWarehouse({ ...warehouse, zipCode: e.target.value })}
              />
            </InputGroup>

            <Form.Label>Mesto</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={warehouse.city}
                onChange={(e) => setWarehouse({ ...warehouse, city: e.target.value })}
              />
            </InputGroup>

            <Form.Label>Država</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={warehouse.state}
                onChange={(e) => setWarehouse({ ...warehouse, state: e.target.value })}
              />
            </InputGroup>

            <Form.Label>Kapaciteta</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                value={warehouse.capacity}
                onChange={(e) => setWarehouse({ ...warehouse, capacity: Number(e.target.value) })}
              />
            </InputGroup>
          </Form>
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

export default WarehouseForm;
