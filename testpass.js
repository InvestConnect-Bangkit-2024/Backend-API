const bcrypt = require('bcryptjs');

async function hashPassword() {
  try {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    console.log(hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

hashPassword();
