const API_URL = 'http://localhost:8099/v1/demo-requests';

async function testBackendMail() {
  console.log(`Hitting backend endpoint: ${API_URL}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: "Test User",
        work_email: "test@operator.com",
        organization: "Test MVNO",
        job_title: "Test Engineer",
        country: "United States",
        operator_type: "mvno",
        project_requirements: "Testing if mail is going or not",
        source_page: "/test-script"
      })
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      return;
    }

    const data = await response.json();
    console.log("Success! Backend responded with:");
    console.log(JSON.stringify(data, null, 2));

    if (data.mail_status === "SENT") {
      console.log("✅ The backend reports the mail was successfully SENT!");
    } else {
      console.log(`❌ The backend reports the mail was NOT SENT. Reason: ${data.mail_error || 'Unknown'}`);
    }

  } catch (error) {
    console.error("Failed to connect to the backend. Is it running on localhost:8099?");
    console.error(error.message);
  }
}

testBackendMail();
