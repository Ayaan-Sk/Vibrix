const fetch = require('node-fetch');

async function testCreate() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vibrix.edu', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login token:', loginData.token ? 'Success' : 'Failed');
    
    if (!loginData.token) {
        console.log("Login error:", loginData);
        return;
    }

    // 2. Create Notice
    const payload = {
      title: 'Test Notice',
      content: 'This is a test notice',
      department: 'ALL',
      urgency: 'normal',
      tags: ['Test'],
      isPinned: false,
      isStartupNotification: false,
      isDraft: false
    };

    const createRes = await fetch('http://localhost:5000/api/notices', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(payload)
    });
    
    const createData = await createRes.json();
    console.log('Create Notice Response:', createRes.status, createData);
  } catch (e) {
    console.error('Test script error:', e.message);
  }
}

testCreate();
