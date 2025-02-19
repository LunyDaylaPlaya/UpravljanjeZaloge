import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../const';
import { InventoryRecord } from '../types/inventoryRecord';
import { Product } from '../types/product';
import { Warehouse } from '../types/warehouse';

type InventoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  fetchInventory: () => void;
  currentData?: InventoryRecord;
};

const InventoryForm = ({ isOpen, onClose, fetchInventory, currentData }: InventoryFormProps) => {
  const [show, setShow] = useState(isOpen);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  
  const [inventoryRecord, setInventoryRecord] = useState<InventoryRecord>(
    currentData || {
      id: 0,
      productId: 0,
      warehouseId: 0,
      quantity: 0,
      unit: '',
      dateAdded: new Date(),
      pricePerPiece: 0,
      product: {} as Product,
      warehouse: {} as Warehouse,
    }
  );

  useEffect(() => {
    axios.get(`${BASE_URL}inventory/products`).then(response => setProducts(response.data));
    axios.get(`${BASE_URL}inventory/warehouses`).then(response => setWarehouses(response.data));
  }, []);

  const onSave = async () => {
    const { product, warehouse, ...newInventoryRecord } = inventoryRecord;
    const recordToSave = {
      ...newInventoryRecord,
      id: currentData?.id || 0,
      dateAdded: new Date().toISOString(),  // Set current date/time
    };
  
    if (currentData && currentData.id) {
      axios
        .put(`${BASE_URL}inventory/${currentData.id}`, recordToSave)
        .then(() => {
          onClose();
          fetchInventory();
        })
        .catch((err) => {
          console.error('Error updating inventory record:', err);
        });
    } else {
      axios
        .post(`${BASE_URL}inventory`, recordToSave)
        .then(() => {
          onClose();
          fetchInventory();
        })
        .catch((err) => {
          console.error('Error adding inventory record:', err);
        });
    }
  };
    
  

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleInputChange = (field: keyof InventoryRecord, value: any) => {
    setInventoryRecord((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal show" style={{ display: 'block', position: 'initial' }}>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{inventoryRecord.id ? 'Uredi Zapis Zaloge' : 'Dodaj Zapis Zaloge'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group>
                <Form.Label>Izdelek</Form.Label>
                <Form.Control
                as="select"
                value={inventoryRecord.productId}
                onChange={(e) => handleInputChange('productId', Number(e.target.value))}
                required
                >
                <option value={0}>Izberi Izdelek</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Skladišče</Form.Label>
                <Form.Control
                as="select"
                value={inventoryRecord.warehouseId}
                onChange={(e) => handleInputChange('warehouseId', Number(e.target.value))}
                required
                >
                <option value={0}>Izberi Skladišče</option>
                {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Količina</Form.Label>
                <Form.Control
                type="number"
                value={inventoryRecord.quantity}
                onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Merska Enota</Form.Label>
                <Form.Control
                as="select"
                value={inventoryRecord.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                required
                >
                <option value="">Izberi Enoto</option>
                <option value="kos">kos</option>
                <option value="kg">kg</option>
                <option value="komad">kom</option>
                <option value="komad">l</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Control
                type="date"
                value={''}
                onChange={(e) => handleInputChange('dateAdded', e.target.value)}
                hidden
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Zapri</Button>
            <Button variant="primary" onClick={onSave}>Shrani</Button>
        </Modal.Footer>
        </Modal>
    </div>

  );
};

export default InventoryForm;
