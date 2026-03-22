
import prisma from '../src/lib/prisma.ts';
import { UserRole, ClassStatus, ResourceType } from '../generated/prisma/client';
import { fakerEN_IN as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import sensiLorem from 'sensible-lorem';



import { SUBJECTS } from '../src/constants/subjects';
const LOCATIONS = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

async function main() {
  console.log('🌱 Starting seeding...');

  // Opt ional: Cleanup existing data (Be careful in production!)
  // await prisma.queryResponse.deleteMany();
  // await prisma.query.deleteMany();
  // await prisma.report.deleteMany();
  // await prisma.homework.deleteMany();
  // await prisma.class.deleteMany();
  // await prisma.resource.deleteMany();
  // await prisma.student.deleteMany();
  // await prisma.tutorProfile.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Create Tutors
  const numOfHardcodedTutors = 5;
  const numOfHardcodedParent = 3; // User said 100 tutors, didn't specify parents but 120 seems high relative to 100. I'll reduce to 50 for speed.

  console.log(`Creating ${numOfHardcodedTutors} Tutors...`);
  const tutors = [];
  for (let i = 0; i < numOfHardcodedTutors; i++) {
    const pfp = faker.image.avatar();
    const firstName = faker.person.firstName('female');
    const lastName = faker.person.lastName('female');
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const user = await prisma.user.create({
      data: {
        fullname: fullName,
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        email: email,
        password: await bcrypt.hash('123', 10),
        role: UserRole.TUTOR,
        phoneNumber: faker.phone.number(),
        image: pfp,
        profileImage: pfp,
        tutorProfile: {
          create: {
            bio: sensiLorem(5),
            subjects: faker.helpers.arrayElements(SUBJECTS, { min: 3, max: 8 }),
            hourlyRate: faker.number.int({ min: 500, max: 2000, multipleOf: 10 }),
            location: faker.helpers.arrayElement(LOCATIONS),
            isVerified: faker.datatype.boolean(0.5),
            rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
            classesTaught: faker.helpers.arrayElement(['1-5', '6-8', '9-10', '11-12']),
          }
        }
      },
      include: {
        tutorProfile: true
      }
    });

    tutors.push(user);
  }

  // 2. Create Parents and Students
  console.log('Creating 50 Parents and their Students...');
  const parents = [];
  const students = [];

  for (let i = 0; i < numOfHardcodedParent; i++) {
    const firstName = faker.person.firstName('female');
    const lastName = faker.person.lastName('female');
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const parent = await prisma.user.create({
      data: {
        fullname: fullName, // Fixed: name -> fullname
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        email: email,
        phoneNumber: faker.phone.number(),
        password: await bcrypt.hash('123', 10),
        role: UserRole.PARENT,
      }
    });
    parents.push(parent);

    // Create 1-3 Students for this parent
    const numStudents = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numStudents; j++) {
      const studentName = faker.person.firstName();
      const student = await prisma.student.create({
        data: {
          name: `${studentName} ${lastName}`,
          parentId: parent.id,
          password: await bcrypt.hash('123', 10),
          // password: await bcrypt.hash('123',10),
          age: faker.number.int({ min: 6, max: 18 }),
          school: faker.company.name() + ' School',
          interests: faker.helpers.arrayElements(['Sports', 'Music', 'Coding', 'Art', 'Reading'], { min: 1, max: 3 }),
          aspirations: sensiLorem(8),
        }
      });
      students.push(student);
    }
  }

  // 3. Create Classes, Homework, Reports, Queries
  console.log('Generating Activities...');

  for (const student of students) {
    // Assign 1-3 random tutors to each student
    const studentTutors = faker.helpers.arrayElements(tutors, { min: 1, max: 3 });

    for (const tutorUser of studentTutors) {
      if (!tutorUser.tutorProfile) continue;

      // Create 5-10 Classes (Past and Future)
      const numClasses = faker.number.int({ min: 5, max: 10 });
      for (let k = 0; k < numClasses; k++) {
        const isPast = faker.datatype.boolean();
        const date = isPast ? faker.date.recent({ days: 30 }) : faker.date.soon({ days: 30 });
        const status = isPast ? ClassStatus.COMPLETED : ClassStatus.SCHEDULED;

        const cls = await prisma.class.create({
          data: {
            tutorId: tutorUser.tutorProfile.id,
            studentId: student.id,
            scheduledAt: date,
            status: status,
            attendanceToken: status === ClassStatus.SCHEDULED ? faker.string.alphanumeric(6).toUpperCase() : null,
          }
        });

        // If class is completed, maybe add homework
        if (status === ClassStatus.COMPLETED && faker.datatype.boolean(0.7)) {
          await prisma.homework.create({
            data: {
              classId: cls.id,
              studentId: student.id,
              title: `Homework for ${date.toLocaleDateString()}`,
              description: sensiLorem(35),
              dueDate: faker.date.soon({ days: 7, refDate: date }),
              isCompleted: faker.datatype.boolean(0.6),
            }
          });
        }
      }

      // Create Reports (1-2 per tutor-student pair)
      if (faker.datatype.boolean(0.5)) {
        await prisma.report.create({
          data: {
            studentId: student.id,
            title: `Monthly Progress - ${faker.date.month()}`,
            feedback: sensiLorem(35),
            grade: faker.helpers.arrayElement(['A', 'B', 'A+', 'B+']),
          }
        });
      }

      // Create Queries (Conversation)
      if (faker.datatype.boolean(0.4)) {
        const context = faker.helpers.arrayElement(['TUTOR_PARENT', 'TUTOR_STUDENT']);
        const senderRole = context === 'TUTOR_PARENT' ? faker.helpers.arrayElement([UserRole.PARENT, UserRole.TUTOR]) : faker.helpers.arrayElement([UserRole.STUDENT, UserRole.TUTOR]);

        const query = await prisma.query.create({
          data: {
            content: sensiLorem(9),
            senderId: senderRole === UserRole.STUDENT ? student.id : (senderRole === UserRole.PARENT ? student.parentId : tutorUser.id),
            senderRole: senderRole,
            tutorId: tutorUser.tutorProfile.id,
            studentId: student.id,
            parentId: student.parentId,
            context: context,
          }
        });

        // Add responses
        const numResponses = faker.number.int({ min: 1, max: 5 });
        for (let r = 0; r < numResponses; r++) {
          await prisma.queryResponse.create({
            data: {
              queryId: query.id,
              content: sensiLorem(9),
              senderId: faker.datatype.boolean() ? tutorUser.id : (context === 'TUTOR_PARENT' ? student.parentId : student.id),
              senderRole: UserRole.TUTOR, // Simplified
            }
          });
        }
      }
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });