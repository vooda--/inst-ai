export async function seed(knex) {
    await knex('emails').del();

    await knex('emails').insert([
      {
        to: 'alice@example.com',
        cc: 'team@example.com',
        bcc: null,
        subject: 'Welcome to our service',
        body: 'Hi Alice, thanks for joining our platform. Let us know if you need help.',
      },
      {
        to: 'bob@example.com',
        cc: null,
        bcc: null,
        subject: 'Meeting Reminder',
        body: 'Hi Bob, just a reminder about our meeting tomorrow at 10 AM.',
      },
      {
        to: 'charlie@example.com',
        cc: 'manager@example.com',
        bcc: null,
        subject: 'Sales offer',
        body: 'Hi Charlie, we have a special discount just for your business.',
      },
      {
        to: 'diana@example.com',
        cc: null,
        bcc: null,
        subject: 'Follow-up: Proposal Discussion',
        body: 'Hi Diana, following up on our last discussion about the proposal. Any updates?',
      },
      {
        to: 'eve@example.com',
        cc: null,
        bcc: 'admin@example.com',
        subject: 'Weekly newsletter',
        body: 'Hi Eve, here is our latest newsletter. Enjoy the read!',
      },
      {
        to: 'frank@example.com',
        cc: null,
        bcc: null,
        subject: 'Payment Received',
        body: 'Hi Frank, we have received your payment. Thank you for your business.',
      },
      {
        to: 'grace@example.com',
        cc: 'support@example.com',
        bcc: null,
        subject: 'Issue Report',
        body: 'Hi Grace, thanks for reporting the issue. Our team will follow up shortly.',
      },
      {
        to: 'henry@example.com',
        cc: null,
        bcc: null,
        subject: 'Vacation Notice',
        body: 'Hi Henry, our office will be closed next week for holidays.',
      },
      {
        to: 'irene@example.com',
        cc: 'team@example.com',
        bcc: null,
        subject: 'Project Update',
        body: 'Hi Irene, here’s an update on the current project status.',
      },
      {
        to: 'jack@example.com',
        cc: null,
        bcc: null,
        subject: 'Survey Invitation',
        body: 'Hi Jack, please take a moment to complete our customer satisfaction survey.',
      },
    ]);
  }
