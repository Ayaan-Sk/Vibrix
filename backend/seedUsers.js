const seedUsers = async () => {
  const users = [
    { name: 'Admin User', email: 'admin@vibrix.edu', password: 'admin123', role: 'admin', department: 'Administration' },
    { name: 'Faculty User', email: 'faculty@vibrix.edu', password: 'faculty123', role: 'faculty', department: 'Computer Science' },
    { name: 'Student User', email: 'student@vibrix.edu', password: 'student123', role: 'student', department: 'IT' }
  ];

  for (const user of users) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`Created ${user.role}:`, data.email);
      } else {
        console.log(`Failed to create ${user.role}:`, data.error || data);
      }
    } catch (err) {
      console.log(`Error creating ${user.role}:`, err.message);
    }
  }
};

seedUsers();
