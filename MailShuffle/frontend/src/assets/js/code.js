import { API_BASE_URL } from "@/api/emailService";

export const buildApiUri = (email, apiKey) =>
  `${API_BASE_URL}/inbox?email=${email}&apiKey=${apiKey}`;

export const buildCodeSnippet = (apiUri) =>
  `
fetch('${apiUri}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => {
  if (!res.ok) throw new Error('Error in server response');
  return res.json();
})
.then(data => {
  console.log('✅ Server response:', data);
})
.catch(err => {
  console.error('❌ Error:', err.message);
});
`.trim();

export const getSampleOutput = () =>
  `
[
  {
    "sender": "example1@mail.com",
    "subject": "Welcome to Our Service!",
    "body": "Thank you for signing up for our service. We are excited to have you on board!",
    "receivedAt": "2025-04-12T08:00:00.000Z",
    "_id": "email1"
  },
  {
    "sender": "newsletter@company.com",
    "subject": "Your Weekly Newsletter",
    "body": "Here is your weekly newsletter with the latest updates and news.",
    "receivedAt": "2025-04-12T09:00:00.000Z",
    "_id": "email2"
  }
]
`.trim();
