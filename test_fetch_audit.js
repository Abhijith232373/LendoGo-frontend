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
    await fetch('http://localhost:8080/api/admin/staff', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: "audit_test", email: "audit_test@gmail.com", password: "test", role: "HR", permissions: {}
      })
    });

    const logsRes = await fetch('http://localhost:8080/api/admin/audit-logs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const logsData = await logsRes.text();
    console.log("AUDIT LOGS:");
    console.log(logsData);
  } catch (e) {
    console.error(e);
  }
}
run();
