// Network diagnostic script for mobile hotspot connectivity
const os = require('os');

console.log('=== Network Configuration ===\n');

const interfaces = os.networkInterfaces();
const addresses = [];

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
    if (iface.family === 'IPv4') {
      addresses.push({
        name: name,
        address: iface.address,
        internal: iface.internal
      });
      
      console.log(`Interface: ${name}`);
      console.log(`  Address: ${iface.address}`);
      console.log(`  Internal: ${iface.internal}`);
      console.log('');
    }
  }
}

console.log('=== Instructions for Mobile Hotspot Access ===\n');

const externalAddresses = addresses.filter(a => !a.internal);

if (externalAddresses.length > 0) {
  console.log('Use one of these IP addresses from your mobile device:');
  externalAddresses.forEach(addr => {
    const port = process.env.PORT || 3000;
    console.log(`  http://${addr.address}:${port}`);
  });
} else {
  console.log('No external network interfaces found!');
  console.log('Make sure your computer is connected to the hotspot network.');
}

console.log('\n=== Firewall Check ===');
console.log('If you still cannot connect, you may need to:');
console.log('1. Allow Node.js through Windows Firewall');
console.log('2. Make sure your mobile device is on the same hotspot network');
console.log('3. Temporarily disable Windows Firewall to test');
console.log('\nTo allow through firewall, run PowerShell as Administrator:');
const port = process.env.PORT || 3000;
console.log(`  netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=${port}`);
