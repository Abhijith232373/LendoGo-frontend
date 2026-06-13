async function run() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: '232373' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    // Create staff
    const createRes = await fetch('http://localhost:8080/api/admin/staff', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: "test", email: "test@gmail.com", password: "test", role: "HR", permissions: {"Careers": true}
      })
    });
    console.log("CREATE STATUS:", createRes.status);
    console.log("CREATE BODY:", await createRes.text());
  } catch (e) {
    console.error(e);
  }
}
run();
