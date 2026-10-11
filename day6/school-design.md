# School Database Design

## 1. Tables

### Students
The students table stores student information using student_id
as the primary key. The name and email are required, and email
is UNIQUE to prevent two students from using the same email.

### Courses
The courses table stores the courses offered by the school.
course_id is the primary key, and course_name is required and
unique so that each course has a distinct name.

### Enrolments
The enrolments table records which students take which courses.
It contains enrolment_id as the primary key, student_id and
course_id as foreign keys, and grade for the student's result.
Both foreign keys are NOT NULL. The composite UNIQUE constraint
on (student_id, course_id) prevents duplicate enrolments in the
same course by the same student.

## 2. Relationships

Students and enrolments have a one-to-many relationship because
one student can have multiple enrolments, while each enrolment
belongs to one student. Courses and enrolments also have a
one-to-many relationship because one course can have many
enrolments, while each enrolment refers to one course.

Students and courses have a many-to-many relationship: each
student can take several courses, and each course can have many
students. The enrolments table is an associative entity that
resolves this relationship using foreign keys. It also stores
information specific to the relationship, such as the grade.

## 3. Index

I would add an index on enrolments(course_id) to speed up
queries that find students enrolled in a particular course and
joins involving courses. The UNIQUE constraint on
(student_id, course_id) already creates an index useful for
student-based lookups, so another index on student_id alone
may be unnecessary.

## 4. SQL or NoSQL?

I would choose SQL because students, courses, and enrolments
have structured data and clearly defined relationships. A
relational database supports primary keys, foreign keys, unique
constraints, and required fields to maintain data integrity.
JOIN and GROUP BY queries also make it straightforward to
retrieve course registrations and calculate enrolment counts.
NoSQL is useful for flexible or unstructured data, but SQL is
better suited to this school's relational requirements.
