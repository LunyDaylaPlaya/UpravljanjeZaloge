using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController:ControllerBase
    {

        private readonly AppDbContext _context;
        
        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Products()
        {
            var products = await _context.Products.AsNoTracking().ToListAsync();
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(Product product) 
        {

            if (product is null)
            {
                return BadRequest();
            }

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return Ok(product);

        }

        [HttpGet("without-inventory")]
        public async Task<IActionResult> GetProductsWithoutInventory()
        {
            var productsWithoutInventory = await _context.Products
                .Where(p => !_context.InventoryRecords.Any(ir => ir.ProductId == p.Id))
                .ToListAsync();

            return Ok(productsWithoutInventory);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product is null)
            {
                return NotFound();
            }
            _context.Products.Remove(product);
            
            await _context.SaveChangesAsync();
            
            return Ok(product);
        }
    }
}