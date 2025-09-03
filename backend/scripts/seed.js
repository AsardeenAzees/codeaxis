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
          { value: 'in-progress', label: 'In Progress', type: 'active' },
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

    // Seed a sample client
    const client = await Client.create({
      name: 'Acme Corp',
      email: 'contact@acme.com',
      organization: 'Acme Corporation'
    });

    // Seed a sample project
    await Project.create({
      title: 'Acme Website',
      description: 'Corporate website redesign project',
      slug: 'acme-website',
      status: 'completed',
      client: client._id,
      visibility: { public: true },
      techStack: ['react', 'node', 'mongodb'],
      category: 'web',
      completedDate: new Date(),
      progress: 100
    });
    console.log('✅ Sample data seeded');

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();


