const student = {
  name: "ฐาปกรณ์ ใจงาม",
  studentId: "68543210050-9",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));