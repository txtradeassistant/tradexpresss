async function testRelay() {
  const url = 'http://localhost:5173/api/chat'; // Replace with your actual endpoint

  console.log(`Testing relay to: ${url}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, TradExpress!' }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Relay is working.');
      console.log('Response:', data);
    } else {
      console.error(`❌ Relay failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Connection failed. Ensure your dev server is running (npm run dev).');
    console.error(error.message);
  }
}

testRelay();