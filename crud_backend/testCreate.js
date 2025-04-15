// testCreate.js
import fetch from 'node-fetch';  // if using Node 18+ you can omit this import

async function run() {
  const payload = {
    name: "Suraj",
    middlename: "Parmeshwar",
    lastname: "Thorat",
    age: 23,
    phoneno: "9876543210",
    bloodgroup: "B+",
    dob: "2002-08-15",
    address: [
      {
        line1: "Flat 203",
        line2: "Raj Nagar Society",
        city: "Pune"
      }
    ]
  };

  const res = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  console.log("Status:", res.status);
  console.log("Response:", await res.json());
}

run().catch(console.error);
