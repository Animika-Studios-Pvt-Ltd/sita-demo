const smsService = require('./src/services/smsService');

async function testFullOrder() {
  const mockOrder = {
    name: 'Vinod Kumar',
    phone: '9606723930', // Customer phone (working number)
    _id: '507f1f77bcf86cd799610999',
    totalPrice: 900,
    guestOrderCode: null,
    createdAt: new Date()
  };

  console.log('🚀 Testing FULL order confirmation (customer + admin)...\n');
  const result = await smsService.sendOrderConfirmation(mockOrder);
  
  console.log('\n📊 Results:');
  result.forEach(r => {
    console.log(`  ${r.type}: ${r.success ? '✅ Success' : '❌ Failed'}`);
    if (r.success) {
      console.log(`    Phone: ${r.mobile}`);
      console.log(`    Message: ${r.message}`);
    }
  });
  
  process.exit(0);
}

testFullOrder().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
