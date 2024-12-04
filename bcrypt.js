const bcrypt = require('bcryptjs');

async function hashPasswords() {
  const hashedpassword1 = await bcrypt.hash('hashedpassword1', 10);
  const hashedpassword2 = await bcrypt.hash('hashedpassword2', 10);
  const hashedpassword3 = await bcrypt.hash('hashedpassword3', 10);

  console.log(hashedpassword1);
  console.log(hashedpassword2);
  console.log(hashedpassword3);
}

hashPasswords();
