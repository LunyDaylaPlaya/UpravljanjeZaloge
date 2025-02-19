import axios from "axios";
import { useState, useEffect } from "react";
import { Accordion, Table, Button } from "react-bootstrap";
import { BASE_URL } from "../const";
import { Product } from "../types/product";
import { Warehouse } from "../types/warehouse";
import { InventoryRecord } from "../types/inventoryRecord";

function ReportPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<InventoryRecord[]>([]);
    const [productsWithoutInventory, setProductsWithoutInventory] = useState<Product[]>([]);
    const [threshold, setThreshold] = useState(4);

    useEffect(() => {
        axios.get(`${BASE_URL}inventory/products`).then((res) => setProducts(res.data));
        axios.get(`${BASE_URL}inventory/warehouses`).then((res) => setWarehouses(res.data));
        fetchProductsWithoutInventory();
    }, []);

    const fetchLowStockProducts = () => {
        axios.get(`${BASE_URL}inventory/low-stock/${threshold}`)
            .then((res) => setLowStockProducts(res.data))
            .catch((err) => console.error("Error fetching low-stock products:", err));
    };

    const fetchProductsWithoutInventory = () => {
        axios.get(BASE_URL + "product/without-inventory")
            .then((res) => setProductsWithoutInventory(res.data))
            .catch((err) => console.log(err));
    };

    const getProductNameById = (id: number) => products.find((p) => p.id === id)?.name || "N/A";
    const getProductDescriptionById = (id: number) => products.find((p) => p.id === id)?.description || "N/A";
    const getWarehouseNameById = (id: number) => warehouses.find((w) => w.id === id)?.name || "N/A";

    const exportToCSV = (data: any[], filename: string, headers: string[]) => {
        const csvRows = [];
        csvRows.push(headers.join(","));

        data.forEach((row) => {
            const values = headers.map((header) => {
                const value = row[header];
                return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
            });
            csvRows.push(values.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const exportProductsWithoutInventory = () => {
        const headers = ["Id", "Naziv Izdelka", "Opis"];
        const data = productsWithoutInventory.map((p) => ({
            Id: p.id,
            "Naziv Izdelka": p.name,
            Opis: p.description,
        }));
        exportToCSV(data, "products_without_inventory.csv", headers);
    };

    const exportLowStockProducts = () => {
        const headers = ["Id", "Naziv Izdelka", "Opis", "Skladišče", "Količina"];
        const data = lowStockProducts.map((r) => ({
            Id: r.productId,
            "Naziv Izdelka": getProductNameById(r.productId),
            Opis: getProductDescriptionById(r.productId),
            Skladišče: getWarehouseNameById(r.warehouseId),
            Količina: r.quantity,
        }));
        exportToCSV(data, "low_stock_products.csv", headers);
    };

    return (
        <div style={{ padding: "2em" }}>
            <div className="header"><h2>Poročila</h2></div>

            <Accordion defaultActiveKey={["0"]} alwaysOpen className="md-3" style={{ width: "70%", margin: "auto" }}>
                <Accordion.Item eventKey="0" className="mb-3">
                    <Accordion.Header>Produkti brez zaloge</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Id</th>
                                    <th>Naziv Izdelka</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsWithoutInventory.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center">
                            <Button variant="outline-primary" onClick={exportProductsWithoutInventory} className="mb-2">
                                <i className="bi bi-save"></i> Izvozi kot CSV
                            </Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Produkti z zalogo, ki je manjša od vpisane</Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <label>Zaloga manjša od:</label>
                            <input
                                type="number"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                min="1"
                                style={{ width: "4em", borderRadius: "5px" }}
                            />
                            <Button variant="primary" onClick={fetchLowStockProducts}>
                                Pridobi podatke
                            </Button>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Id</th>
                                    <th>Naziv Izdelka</th>
                                    <th>Opis</th>
                                    <th>Skladišče</th>
                                    <th>Količina</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map((record, index) => (
                                    <tr key={`${record.productId}-${record.warehouseId}`}>
                                        <td>{index + 1}</td>
                                        <td>{record.productId}</td>
                                        <td>{getProductDescriptionById(record.productId)}</td>
                                        <td>{getProductNameById(record.productId)}</td>
                                        <td>{getWarehouseNameById(record.warehouseId)}</td>
                                        <td>{record.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center">
                            <Button variant="outline-primary" onClick={exportLowStockProducts} className="mb-2">
                                <i className="bi bi-save"></i> Izvozi kot CSV
                            </Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

export default ReportPage;
