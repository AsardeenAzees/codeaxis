const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectDB } = require('../config/database');
const User = require('../models/User');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Settings = require('../models/Settings');

const run = async () => {
  try {
    await connectDB();

    // Create Main Admin
    const adminEmail = 'admin@codeaxis.dev';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        email: adminEmail,
        password: 'Admin@1234',
        firstName: 'Main',
        lastName: 'Admin',
        role: 'main_admin',
        nic: '123456789V',
        isFirstLogin: false
      });
      console.log('✅ Created main admin: admin@codeaxis.dev / Admin@1234');
    } else {
      console.log('ℹ️ Main admin already exists');
    }

    // Seed Settings
    const settings = await Settings.findOneAndUpdate({}, {
      companyInformation: {
        name: 'CodeAxis',
        email: 'info@codeaxis.dev',
        phone: '+94 11 234 5678',
        address: 'Colombo, Sri Lanka'
      },
      projectConfiguration: {
        statuses: [
          { value: 'planning', label: 'Planning', type: 'pending' },
          { value: 'in_progress', label: 'In Progress', type: 'active' },
          { value: 'review', label: 'In Review', type: 'active' },
          { value: 'completed', label: 'Completed', type: 'completed' }
        ],
        categories: [
          { value: 'web', label: 'Web App' },
          { value: 'mobile', label: 'Mobile App' },
          { value: 'ecommerce', label: 'E-Commerce' }
        ],
        techStacks: [
          { value: 'react', label: 'React' },
          { value: 'node', label: 'Node.js' },
          { value: 'mongodb', label: 'MongoDB' }
        ]
      }
    }, { upsert: true, new: true });
    console.log('✅ Settings seeded');

    // Seed or reuse a sample client
    const client = await Client.findOneAndUpdate(
      { email: 'contact@acme.com' },
      {
        name: 'Acme Corp',
        organization: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'contact@acme.com',
        phone: '+94 11 111 2222',
        address: { city: 'Colombo', country: 'Sri Lanka' }
      },
      { upsert: true, new: true }
    );

    // Seed a sample project
    const project = await Project.findOneAndUpdate(
      { slug: 'acme-website' },
      {
        title: 'Acme Website',
        description: 'Corporate website redesign project',
        status: 'completed',
        client: client._id,
        visibility: 'public',
        budget: { amount: 500000, currency: 'LKR', type: 'fixed' },
        plannedStartDate: new Date(Date.now() - 30*24*60*60*1000),
        plannedEndDate: new Date(),
        techStack: ['react', 'node', 'mongodb'],
        category: 'web',
        completedDate: new Date(),
        progress: 100
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✅ Project ready');

    // Create a demo payment
    const Payment = require('../models/Payment');
    const existingPayment = await Payment.findOne({ project: project._id, amount: 250000, status: 'paid' });
    if (!existingPayment) {
      await Payment.create({
        project: project._id,
        client: client._id,
        amount: 250000,
        currency: 'LKR',
        type: 'final',
        method: 'bank',
        status: 'paid',
        dueDate: new Date(),
        paidDate: new Date(),
        reference: 'BANK-REF-001',
        createdBy: (await User.findOne({ email: adminEmail }))._id,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 250000
      });
    }

    // Create a demo testimonial
    const Testimonial = require('../models/Testimonial');
    const existingTestimonial = await Testimonial.findOne({ slug: 'acme-website-outstanding-work' });
    if (!existingTestimonial) {
      await Testimonial.create({
        project: project._id,
        client: client._id,
        clientName: 'John Doe',
        clientPosition: 'CTO',
        clientOrganization: 'Acme Corporation',
        rating: 5,
        title: 'Outstanding Work',
        content: 'The CodeAxis team delivered beyond expectations.',
        isApproved: true,
        isPublic: true,
        createdBy: (await User.findOne({ email: adminEmail }))._id,
        slug: 'acme-website-outstanding-work'
      });
    }

    // Create a demo lead
    const Lead = require('../models/Lead');
    const existingLead = await Lead.findOne({ email: 'jane@example.com', projectBrief: 'New ecommerce storefront' });
    if (!existingLead) {
      await Lead.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 77 555 6666',
        organization: 'Smith Co',
        projectBrief: 'New ecommerce storefront',
        budgetRange: '100k_250k',
        projectType: 'ecommerce',
        timeline: '3_6_months',
        source: 'website'
      });
    }

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();


