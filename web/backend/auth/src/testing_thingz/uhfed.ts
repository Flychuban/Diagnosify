import bcrypt from 'bcrypt';

function comparePasswordsSync(
  plainTextPassword: string,
  hashedPassword: string,
): boolean {
  try {
    const match = bcrypt.compareSync(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

// Example usage
function exampleUsage() {
  const plainText = 'password123';
  const hashed = bcrypt.hashSync(plainText, 10); // Hash the password

  const isMatch = comparePasswordsSync(plainText, hashed);

  const wrongPassword = 'wrongpassword';
  const isWrongMatch = comparePasswordsSync(wrongPassword, hashed)
}

exampleUsage();
