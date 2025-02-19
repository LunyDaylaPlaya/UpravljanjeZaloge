using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryRecord>>> GetInventoryRecords()
        {
            var inventoryRecords = await _context.InventoryRecords.ToListAsync();

            return Ok(inventoryRecords);
        }


        [HttpPost]
        public async Task<IActionResult> CreateInventoryRecord(InventoryRecord inventoryRecord)
        {
            if (inventoryRecord is null)
            {
                return BadRequest();
            }

            await _context.InventoryRecords.AddAsync(inventoryRecord);
            await _context.SaveChangesAsync();
            return Ok(inventoryRecord);
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.AsNoTracking().ToListAsync();
            return Ok(products);
        }

        [HttpGet("warehouses")]
        public async Task<IActionResult> GetWarehouses()
        {
            var warehouses = await _context.Warehouses.AsNoTracking().ToListAsync();
            return Ok(warehouses);
        }

        [HttpGet("low-stock/{threshold}")]
        public async Task<IActionResult> GetLowStockProducts(int threshold)
        {
            var lowStockProducts = await _context.InventoryRecords
                .Where(ir => ir.Quantity < threshold)
                .Select(ir => new 
                {
                    ir.ProductId,
                    ir.WarehouseId,
                    ir.Quantity
                })
                .ToListAsync();

            return Ok(lowStockProducts);
        }




        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventoryRecord(int id)
        {
            var inventoryRecord = await _context.InventoryRecords.FindAsync(id);
            if (inventoryRecord is null)
            {
                return NotFound();
            }
            return Ok(inventoryRecord);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventoryRecord(int id, InventoryRecord inventoryRecord)
        {
            if (id != inventoryRecord.Id)
            {
                return BadRequest();
            }

            _context.Entry(inventoryRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventoryRecord(int id)
        {
            var inventoryRecord = await _context.InventoryRecords.FindAsync(id);

            if (inventoryRecord is null)
            {
                return NotFound();
            }

            _context.InventoryRecords.Remove(inventoryRecord);
            await _context.SaveChangesAsync();
            return Ok(inventoryRecord);
        }
    }
}
