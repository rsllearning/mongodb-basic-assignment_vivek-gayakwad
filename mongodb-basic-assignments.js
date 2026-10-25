/**
 * Selects the database used by the commands below, creating it on first write
 * if it does not already exist.
 */
use company;

/** Lists the databases available to the current MongoDB deployment. */
show dbs;

/**
 * Removes the existing employees collection so this script can recreate its
 * sample data. This is destructive to that collection.
 */
db.employees.drop();

/** Inserts the sample employee documents used by the queries in this script. */
db.employees.insertMany([
  { _id: "EMP001", name: "John", department: "Engineering", experience: 4, skills: ["Java", "Spring Boot"], active: true, address: { city: "Pune", country: "India" } },
  { _id: "EMP002", name: "Alice", department: "HR", experience: 3, skills: ["Recruitment", "Communication"], active: true, address: { city: "Mumbai", country: "India" } },
  { _id: "EMP003", name: "David", department: "Engineering", experience: 6, skills: ["Java", "MongoDB"], active: true, address: { city: "Bengaluru", country: "India" } },
  { _id: "EMP004", name: "Emma", department: "Finance", experience: 2, skills: ["Accounting", "Excel"], active: false, address: { city: "Pune", country: "India" } },
  { _id: "EMP005", name: "Robert", department: "Engineering", experience: 5, skills: ["Java", "Docker"], active: true, address: { city: "Delhi", country: "India" } }
]);

/** Lists collections in the current database. */
show collections;

/** Counts all documents currently stored in the employees collection. */
db.employees.countDocuments();

/** Returns all employee documents. */
db.employees.find();

/**
 * Finds Engineering employees, returns selected fields, and sorts by name
 * alphabetically.
 */
db.employees.find({ department: "Engineering" }, { _id: 1, name: 1, experience: 1 }).sort({ name: 1 });

/**
 * Finds employees with at least five years of experience and sorts from most
 * to least experienced.
 */
db.employees.find({ experience: { $gte: 5 } }, { _id: 0, name: 1, experience: 1 }).sort({ experience: -1 });

/** Finds employees in Pune, returning only their names and city. */
db.employees.find({ "address.city": "Pune" }, { _id: 0, name: 1, "address.city": 1 }).sort({ name: 1 });

/** Finds employees with either MongoDB or Spring Boot in their skills. */
db.employees.find({ skills: { $in: ["MongoDB", "Spring Boot"] } }).sort({ name: 1 });

/** Returns the two employees with the most experience. */
db.employees.find({}, { _id: 0, name: 1, experience: 1 }).sort({ experience: -1 }).limit(2);

/** Adds one year of experience to Alice's document. */
db.employees.updateOne({ name: "Alice" }, { $inc: { experience: 1 } });

/** Retrieves Alice to verify the experience update. */
db.employees.findOne({ name: "Alice" });

/** Marks Emma as active. */
db.employees.updateOne({ name: "Emma" }, { $set: { active: true } });

/** Retrieves Emma to verify the active-status update. */
db.employees.findOne({ name: "Emma" });

/** Adds MongoDB to Robert's skills only if it is not already present. */
db.employees.updateOne({ name: "Robert" }, { $addToSet: { skills: "MongoDB" } });

/** Retrieves Robert to inspect the updated skills array. */
db.employees.findOne({ name: "Robert" });

/**
 * Repeats the same $addToSet operation to demonstrate that it does not add a
 * duplicate skill.
 */
db.employees.updateOne({ name: "Robert" }, { $addToSet: { skills: "MongoDB" } });

/** Confirms Robert still has only one MongoDB entry in his skills array. */
db.employees.findOne({ name: "Robert" });

/** Counts employees before inserting a temporary test document. */
db.employees.countDocuments();

/** Inserts a temporary employee document for the insert/delete example. */
db.employees.insertOne({ _id: "EMP999", name: "Temporary Employee", department: "Training", experience: 0 });

/** Counts employees after the temporary document is inserted. */
db.employees.countDocuments();

/** Confirms that the temporary employee was inserted. */
db.employees.findOne({ _id: "EMP999" });

/** Deletes the temporary employee document by its unique ID. */
db.employees.deleteOne({ _id: "EMP999" });

/** Confirms that the temporary employee no longer exists. */
db.employees.findOne({ _id: "EMP999" });

/** Counts employees after the temporary document is deleted. */
db.employees.countDocuments();

/** Lists the indexes currently defined on the employees collection. */
db.employees.getIndexes();

/** Creates an ascending index on department to support department lookups. */
db.employees.createIndex({ department: 1 });

/** Lists indexes again to verify that the department index was created. */
db.employees.getIndexes();

/**
 * Groups employees by department, counts each group, and sorts the result by
 * department name.
 */
db.employees.aggregate([
  { $group: { _id: "$department", totalEmployees: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);

/**
 * Groups employees by department, calculates average experience, and sorts the
 * result by department name.
 */
db.employees.aggregate([
  { $group: { _id: "$department", averageExperience: { $avg: "$experience" } } },
  { $sort: { _id: 1 } }
]);

/**
 * Filters for Engineering employees, selects the two most experienced, and
 * returns only their names and experience.
 */
db.employees.aggregate([
  { $match: { department: "Engineering" } },
  { $sort: { experience: -1 } },
  { $limit: 2 },
  { $project: { _id: 0, name: 1, experience: 1 } }
]);