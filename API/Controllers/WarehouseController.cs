using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehouseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WarehouseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Warehouses()
        {
            var warehouses = await _context.Warehouses.AsNoTracking().ToListAsync();
            return Ok(warehouses);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWarehouse(Warehouse warehouse)
        {
            if (warehouse is null)
            {
                return BadRequest();
            }

            await _context.Warehouses.AddAsync(warehouse);
            await _context.SaveChangesAsync();
            return Ok(warehouse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouse(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse is null)
            {
                return NotFound();
            }
            return Ok(warehouse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWarehouse(int id, Warehouse warehouse)
        {
            if (id != warehouse.Id)
            {
                return BadRequest();
            }

            _context.Entry(warehouse).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);

            if (warehouse is null)
            {
                return NotFound();
            }

            _context.Warehouses.Remove(warehouse);
            await _context.SaveChangesAsync();
            return Ok(warehouse);
        }
    }
}
