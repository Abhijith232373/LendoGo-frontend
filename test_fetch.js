async function run() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: '232373' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    if (!token) {
        console.log("LOGIN FAILED", loginData);
        return;
    }

    const staffRes = await fetch('http://localhost:8080/api/admin/staff', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const staffData = await staffRes.text();
    console.log("STAFF DATA:");
    console.log(staffData);
  } catch (e) {
    console.error(e);
  }
}
run();
