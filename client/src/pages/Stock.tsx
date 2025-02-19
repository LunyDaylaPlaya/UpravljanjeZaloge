import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Table, Popover, OverlayTrigger, Form } from "react-bootstrap";
import InventoryForm from "../components/InventoryForm";
import ProductSkeleton from "../components/ProductSkeleton";
import { BASE_URL } from "../const";
import { InventoryRecord } from "../types/inventoryRecord";
import { Product } from "../types/product";
import { Warehouse } from "../types/warehouse";

function StockPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentData, setCurrentData] = useState<InventoryRecord>({} as InventoryRecord);
    const [data, setData] = useState<InventoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

    useEffect(() => {
        fetchData();
        axios.get(`${BASE_URL}inventory/products`).then((response) => setProducts(response.data));
        axios.get(`${BASE_URL}inventory/warehouses`).then((response) => setWarehouses(response.data));
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        axios.get(BASE_URL + "inventory")
            .then((res) => setData(res.data))
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };

    const getProductNameById = (id: number) => products.find((p) => p.id === id)?.name || "N/A";
    const getProductPriceById = (id: number) => products.find((p) => p.id === id)?.price || 0;
    const getWarehouseNameById = (id: number) => warehouses.find((w) => w.id === id)?.name || "N/A";

    const filteredData = data.filter((record) => {
        const productName = getProductNameById(record.productId).toLowerCase();
        const warehouseName = getWarehouseNameById(record.warehouseId);
        return (
            productName.includes(searchQuery.toLowerCase()) &&
            (selectedWarehouse === "" || warehouseName === selectedWarehouse)
        );
    });

    const totalQuantity = filteredData.reduce((sum, record) => sum + record.quantity, 0);
    const totalValue = filteredData.reduce((sum, record) => sum + getProductPriceById(record.productId) * record.quantity, 0);

    if (isLoading) return <ProductSkeleton />;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Zaloga</h1>
                <Button variant="success" size="sm" onClick={() => setIsOpen(true)}>
                    Dodaj Nov Zapis
                </Button>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <Form.Control
                        type="text"
                        placeholder="Išči po nazivu izdelka..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <Form.Select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
                        <option value="">Išči po nazivu skladišča...</option>
                        <option value="">Vsa skladišča</option>
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.name}>
                                {warehouse.name}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Id</th>
                        <th>Naziv Izdelka</th>
                        <th>Skladišče</th>
                        <th>Količina</th>
                        <th>Merska Enota</th>
                        <th>Nabavna Cena (€)</th>
                        <th>Nabavna Vrednost (€)</th>
                        <th>Dodano ali Posodobljeno</th>
                        <th>Urejanje</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((record, index) => {
                        const popover = (
                            <Popover id="popover-basic">
                                <Popover.Body className="d-flex flex-column align-items-center row-gap-3">
                                    Ali ste prepričani da želite izbrisati ta zapis?
                                    <Button variant="danger" onClick={() => axios.delete(BASE_URL + "inventory/" + record.id).then(fetchData)}>
                                        Izbriši
                                    </Button>
                                </Popover.Body>
                            </Popover>
                        );

                        return (
                            <tr key={record.id}>
                                <td>{index + 1}</td>
                                <td>{record.id}</td>
                                <td>{getProductNameById(record.productId)}</td>
                                <td>{getWarehouseNameById(record.warehouseId)}</td>
                                <td>{record.quantity}</td>
                                <td>{record.unit}</td>
                                <td>
                                    {new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(getProductPriceById(record.productId))}
                                </td>
                                <td>
                                    {new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(getProductPriceById(record.productId) * record.quantity)}
                                </td>
                                <td>
                                    {new Intl.DateTimeFormat("sl-SI", { dateStyle: "short", timeStyle: "short" }).format(
                                        new Date(record.dateAdded || new Date())
                                    )}
                                </td>
                                <td className="d-flex justify-content-center column-gap-2">
                                <Button variant="primary" size="sm" onClick={() => {
                                    setCurrentData(record);
                                    setIsOpen(true);
                                    }}>
                                    Uredi
                                </Button>
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                                        <Button variant="danger" size="sm">
                                            Izbriši
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        );
                    })}

                    {filteredData.length > 0 && (
                        <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                            <td colSpan={4} className="text-end">Skupaj:</td>
                            <td>{totalQuantity}</td>
                            <td colSpan={2}></td>
                            <td>{new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(totalValue)}</td>
                            <td colSpan={2}></td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {filteredData.length === 0 && <h3 className="text-center">Ni podatkov</h3>}

            {isOpen && <InventoryForm isOpen={isOpen} onClose={() => setIsOpen(false)} fetchInventory={fetchData} currentData={currentData} />}
        </div>
    );
}

export default StockPage;
