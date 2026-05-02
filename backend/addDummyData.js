const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/royalway');

// Dummy data
const driverData = [
  { name: 'Kamal Perera', email: 'kamal.perera@royalway.com', phone: '0771234567', nic: '198512345V', route: 'Puttalam Town to Kurunegala', dob: '1985-03-15' },
  { name: 'Nimal Silva', email: 'nimal.silva@royalway.com', phone: '0772345678', nic: '198623456V', route: 'Kandy Town to Kurunegala', dob: '1986-07-22' },
  { name: 'Sunil Fernando', email: 'sunil.fernando@royalway.com', phone: '0773456789', nic: '198734567V', route: 'Matale Town to Kurunegala', dob: '1987-11-08' },
  { name: 'Ajith Bandara', email: 'ajith.bandara@royalway.com', phone: '0774567890', nic: '198845678V', route: 'Ibbagamuwa Town to Kurunegala', dob: '1988-05-19' },
  { name: 'Pradeep Kumara', email: 'pradeep.kumara@royalway.com', phone: '0775678901', nic: '198956789V', route: 'Polgahawela to Kurunegala', dob: '1989-09-30' },
  { name: 'Chaminda Dias', email: 'chaminda.dias@royalway.com', phone: '0776789012', nic: '199067890V', route: 'Puttalam Town to Kurunegala', dob: '1990-02-14' },
  { name: 'Ruwan Jayasinghe', email: 'ruwan.jayasinghe@royalway.com', phone: '0777890123', nic: '199178901V', route: 'Kandy Town to Kurunegala', dob: '1991-06-25' },
  { name: 'Mahesh Wickramasinghe', email: 'mahesh.wickramasinghe@royalway.com', phone: '0778901234', nic: '199289012V', route: 'Matale Town to Kurunegala', dob: '1992-10-12' },
  { name: 'Lasith Malinga', email: 'lasith.malinga@royalway.com', phone: '0779012345', nic: '199390123V', route: 'Ibbagamuwa Town to Kurunegala', dob: '1993-04-07' },
  { name: 'Sanath Jayasuriya', email: 'sanath.jayasuriya@royalway.com', phone: '0770123456', nic: '199401234V', route: 'Polgahawela to Kurunegala', dob: '1994-08-18' },
  { name: 'Kumar Sangakkara', email: 'kumar.sangakkara@royalway.com', phone: '0771234560', nic: '199512345V', route: 'Puttalam Town to Kurunegala', dob: '1995-12-03' },
  { name: 'Mahela Jayawardene', email: 'mahela.jayawardene@royalway.com', phone: '0772345601', nic: '199623456V', route: 'Kandy Town to Kurunegala', dob: '1996-01-27' },
  { name: 'Tillakaratne Dilshan', email: 'tillakaratne.dilshan@royalway.com', phone: '0773456012', nic: '199734567V', route: 'Matale Town to Kurunegala', dob: '1997-05-15' },
  { name: 'Angelo Mathews', email: 'angelo.mathews@royalway.com', phone: '0774560123', nic: '199845678V', route: 'Ibbagamuwa Town to Kurunegala', dob: '1998-09-22' },
  { name: 'Thisara Perera', email: 'thisara.perera@royalway.com', phone: '0775601234', nic: '199956789V', route: 'Polgahawela to Kurunegala', dob: '1999-03-11' }
];

const parentData = [
  { name: 'Saman Wijesinghe', email: 'saman.wijesinghe@gmail.com', children: [{ name: 'Kavindi Wijesinghe', class: 'Grade 5', dob: '2014-04-12', route: 'Puttalam Town to Kurunegala' }] },
  { name: 'Anura Dissanayake', email: 'anura.dissanayake@gmail.com', children: [{ name: 'Tharindu Dissanayake', class: 'Grade 7', dob: '2012-08-25', route: 'Kandy Town to Kurunegala' }] },
  { name: 'Chandrika Kumaratunga', email: 'chandrika.kumaratunga@gmail.com', children: [{ name: 'Nethmi Kumaratunga', class: 'Grade 3', dob: '2016-11-30', route: 'Matale Town to Kurunegala' }] },
  { name: 'Ranil Wickremesinghe', email: 'ranil.wickremesinghe@gmail.com', children: [{ name: 'Dineth Wickremesinghe', class: 'Grade 9', dob: '2010-02-18', route: 'Ibbagamuwa Town to Kurunegala' }] },
  { name: 'Mahinda Rajapaksa', email: 'mahinda.rajapaksa@gmail.com', children: [{ name: 'Yoshitha Rajapaksa', class: 'Grade 6', dob: '2013-06-07', route: 'Polgahawela to Kurunegala' }] },
  { name: 'Sirisena Maithripala', email: 'sirisena.maithripala@gmail.com', children: [{ name: 'Chathurika Sirisena', class: 'Grade 4', dob: '2015-09-14', route: 'Puttalam Town to Kurunegala' }] },
  { name: 'Gotabaya Rajapaksa', email: 'gotabaya.rajapaksa@gmail.com', children: [{ name: 'Manoj Rajapaksa', class: 'Grade 8', dob: '2011-12-22', route: 'Kandy Town to Kurunegala' }] },
  { name: 'Sajith Premadasa', email: 'sajith.premadasa@gmail.com', children: [{ name: 'Amandi Premadasa', class: 'Grade 2', dob: '2017-03-05', route: 'Matale Town to Kurunegala' }] },
  { name: 'Dullas Alahapperuma', email: 'dullas.alahapperuma@gmail.com', children: [{ name: 'Sithum Alahapperuma', class: 'Grade 10', dob: '2009-07-19', route: 'Ibbagamuwa Town to Kurunegala' }] },
  { name: 'Karu Jayasuriya', email: 'karu.jayasuriya@gmail.com', children: [{ name: 'Hiruni Jayasuriya', class: 'Grade 5', dob: '2014-10-28', route: 'Polgahawela to Kurunegala' }] },
  { name: 'Ravi Karunanayake', email: 'ravi.karunanayake@gmail.com', children: [{ name: 'Sandun Karunanayake', class: 'Grade 7', dob: '2012-01-16', route: 'Puttalam Town to Kurunegala' }, { name: 'Nimali Karunanayake', class: 'Grade 4', dob: '2015-05-23', route: 'Puttalam Town to Kurunegala' }] },
  { name: 'Mangala Samaraweera', email: 'mangala.samaraweera@gmail.com', children: [{ name: 'Kasun Samaraweera', class: 'Grade 6', dob: '2013-08-09', route: 'Kandy Town to Kurunegala' }] },
  { name: 'Champika Ranawaka', email: 'champika.ranawaka@gmail.com', children: [{ name: 'Dilini Ranawaka', class: 'Grade 3', dob: '2016-11-12', route: 'Matale Town to Kurunegala' }] },
  { name: 'Wimal Weerawansa', email: 'wimal.weerawansa@gmail.com', children: [{ name: 'Chamod Weerawansa', class: 'Grade 9', dob: '2010-04-27', route: 'Ibbagamuwa Town to Kurunegala' }] },
  { name: 'Udaya Gammanpila', email: 'udaya.gammanpila@gmail.com', children: [{ name: 'Ishara Gammanpila', class: 'Grade 8', dob: '2011-07-03', route: 'Polgahawela to Kurunegala' }] }
];

async function addDummyData() {
  try {
    console.log('Starting to add dummy data...');

    // Add Drivers
    console.log('\nAdding 15 drivers...');
    for (let i = 0; i < driverData.length; i++) {
      const driver = driverData[i];
      const existingDriver = await User.findOne({ email: driver.email });
      
      if (!existingDriver) {
        const newDriver = await User.create({
          name: driver.name,
          email: driver.email,
          password: 'driver123',
          role: 'driver',
          dateOfBirth: new Date(driver.dob),
          phoneNumber: driver.phone,
          nicNumber: driver.nic,
          driverLicenseImage: 'https://example.com/license.jpg',
          assignedRoute: driver.route,
          driverStatus: i < 5 ? 'pending' : (i < 10 ? 'approved' : 'rejected')
        });
        console.log(`✓ Added driver: ${driver.name} (${newDriver.driverStatus})`);
      } else {
        console.log(`- Driver already exists: ${driver.name}`);
      }
    }

    // Add Parents and Students
    console.log('\n\nAdding 15 parents with students...');
    for (let i = 0; i < parentData.length; i++) {
      const parent = parentData[i];
      const existingParent = await User.findOne({ email: parent.email });
      
      if (!existingParent) {
        const childrenData = parent.children.map(child => ({
          childName: child.name,
          childClass: child.class,
          childDateOfBirth: new Date(child.dob),
          selectedRoute: child.route
        }));

        const newParent = await User.create({
          name: parent.name,
          email: parent.email,
          password: 'parent123',
          role: 'parent',
          childName: childrenData[0].childName,
          childClass: childrenData[0].childClass,
          childDateOfBirth: childrenData[0].childDateOfBirth,
          selectedRoute: childrenData[0].selectedRoute,
          children: childrenData
        });

        console.log(`✓ Added parent: ${parent.name}`);

        // Create student records for each child
        for (const child of childrenData) {
          const driver = await User.findOne({ 
            role: 'driver', 
            assignedRoute: child.selectedRoute,
            driverStatus: 'approved'
          });

          const studentId = `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
          
          await Student.create({
            studentId,
            childName: child.childName,
            parentName: newParent.name,
            childClass: child.childClass,
            childDateOfBirth: child.childDateOfBirth,
            route: child.selectedRoute,
            parentId: newParent._id,
            parentEmail: newParent.email,
            assignedDriver: driver ? driver._id : null
          });

          console.log(`  ✓ Added student: ${child.childName} (${child.childClass})`);
        }
      } else {
        console.log(`- Parent already exists: ${parent.name}`);
      }
    }

    console.log('\n\n✅ Dummy data added successfully!');
    console.log('\nSummary:');
    console.log('- 15 Drivers added (5 pending, 5 approved, 5 rejected)');
    console.log('- 15 Parents added');
    console.log('- 16 Students added (one parent has 2 children)');
    console.log('\nDriver credentials: email / driver123');
    console.log('Parent credentials: email / parent123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding dummy data:', error);
    mongoose.connection.close();
  }
}

addDummyData();
