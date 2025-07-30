const { User, Module, Cohort, Class, Mode, CourseOffering } = require('../models');

const seedDatabase = async () => {
  try {
    // Create sample users
    const manager = await User.create({
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    const facilitator1 = await User.create({
      firstName: 'Jane',
      lastName: 'Facilitator',
      email: 'facilitator@example.com',
      password: 'password123',
      role: 'facilitator'
    });

    const facilitator2 = await User.create({
      firstName: 'Mike',
      lastName: 'Smith',
      email: 'mike.smith@example.com',
      password: 'password123',
      role: 'facilitator'
    });

    const student1 = await User.create({
      firstName: 'Bob',
      lastName: 'Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    });

    const student2 = await User.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'password123',
      role: 'student'
    });

    // Create sample modules
    const module1 = await Module.create({
      name: 'Advanced Backend Development',
      code: 'ABD101',
      credits: 3,
      description: 'Advanced concepts in backend development'
    });

    const module2 = await Module.create({
      name: 'Database Systems',
      code: 'DBS201',
      credits: 4,
      description: 'Comprehensive database systems course'
    });

    const module3 = await Module.create({
      name: 'Web Development',
      code: 'WEB301',
      credits: 3,
      description: 'Modern web development techniques'
    });

    // Create sample cohorts
    const cohort1 = await Cohort.create({
      name: 'Software Engineering 2024',
      year: 2024,
      program: 'Software Engineering',
      startDate: '2024-01-15',
      endDate: '2024-12-15'
    });

    const cohort2 = await Cohort.create({
      name: 'Computer Science 2024',
      year: 2024,
      program: 'Computer Science',
      startDate: '2024-02-01',
      endDate: '2024-11-30'
    });

    // Create sample classes
    const class1 = await Class.create({
      name: '2024S',
      year: 2024
    });

    const class2 = await Class.create({
      name: '2025J',
      year: 2025
    });

    // Create sample modes
    const onlineMode = await Mode.create({
      name: 'Online',
      description: 'Fully online delivery',
      active: true
    });

    const inPersonMode = await Mode.create({
      name: 'In-Person',
      description: 'Traditional classroom delivery',
      active: true
    });

    const hybridMode = await Mode.create({
      name: 'Hybrid',
      description: 'Combination of online and in-person delivery',
      active: true
    });

    // Create sample course offerings
    await CourseOffering.create({
      moduleId: module1.id,
      cohortId: cohort1.id,
      classId: class1.id,
      modeId: onlineMode.id,
      facilitatorId: facilitator1.id,
      trimester: 1,
      intakePeriod: 'HT1',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      active: true,
      createdBy: manager.id
    });

    await CourseOffering.create({
      moduleId: module2.id,
      cohortId: cohort1.id,
      classId: class1.id,
      modeId: inPersonMode.id,
      facilitatorId: facilitator2.id,
      trimester: 1,
      intakePeriod: 'HT2',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      active: true,
      createdBy: manager.id
    });

    await CourseOffering.create({
      moduleId: module3.id,
      cohortId: cohort2.id,
      classId: class2.id,
      modeId: hybridMode.id,
      facilitatorId: facilitator1.id,
      trimester: 2,
      intakePeriod: 'FT',
      startDate: '2024-05-01',
      endDate: '2024-08-01',
      active: true,
      createdBy: manager.id
    });

    console.log('Sample data created:');
    console.log(`- ${await User.count()} users`);
    console.log(`- ${await Module.count()} modules`);
    console.log(`- ${await Cohort.count()} cohorts`);
    console.log(`- ${await Class.count()} classes`);
    console.log(`- ${await Mode.count()} modes`);
    console.log(`- ${await CourseOffering.count()} course offerings`);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };